<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\File;
use App\Models\FileShare;
use App\Models\GroupFileShare;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Alert;

class FileController extends Controller
{
    private const MAX_SIZE_BYTES = 10 * 1024 * 1024;

    private const ALLOWED_MIME = [
        'application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
    ];

    /* ── 1. LIST ── */
    public function index()
    {
        $files = File::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($f) => $this->formatFile($f));

        return response()->json(['files' => $files]);
    }

    /* ── 2. UPLOAD (مع ClamAV) ── */
    public function upload(Request $request)
    {
        if (!in_array(auth()->user()->role, ['student', 'professor'])) {
            return response()->json(['message' => 'Only students and professors can upload files.'], 403);
        }

        $request->validate(['file' => 'required|file|max:10240']);
        $uploadedFile = $request->file('file');

        if (!in_array($uploadedFile->getMimeType(), self::ALLOWED_MIME)) {
            return response()->json(['message' => 'File type not allowed.'], 422);
        }

        if ($uploadedFile->getSize() > self::MAX_SIZE_BYTES) {
            return response()->json(['message' => 'File exceeds 10 MB limit.'], 422);
        }

        $tempDir  = storage_path('app/temp');
        if (!is_dir($tempDir)) mkdir($tempDir, 0755, true);
        $tempPath = $tempDir . DIRECTORY_SEPARATOR . Str::uuid() . '_' . $uploadedFile->getClientOriginalName();
        copy($uploadedFile->getRealPath(), $tempPath);

        try {
            $scanResult = $this->scanFile($tempPath);
        } catch (\Exception $e) {
            @unlink($tempPath);
            return response()->json(['message' => 'Security scanner is unavailable. Upload blocked for safety.'], 503);
        }

        if ($scanResult === 'infected') {
            @unlink($tempPath);
            AuditLog::create(['user_id' => auth()->id(), 'action' => 'scan_file', 'file_id' => null, 'ip_address' => $request->ip(),
                'details' => json_encode(['result' => 'infected', 'original_name' => $uploadedFile->getClientOriginalName()])]);
            return response()->json(['message' => 'File rejected: Malware detected. This incident has been logged.', 'status' => 'infected'], 400);
        }

        $rawContent = file_get_contents($tempPath);
        @unlink($tempPath);

        $hash      = hash('sha256', $rawContent);
        $key       = random_bytes(32);
        $iv        = random_bytes(16);
        $encrypted = openssl_encrypt($rawContent, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
        $storedKey = base64_encode($key) . '::' . base64_encode($iv);
        $storedName= Str::uuid() . '.enc';
        $filePath  = 'encrypted/' . $storedName;

        Storage::disk('local')->put($filePath, $encrypted);

        $file = File::create([
            'user_id' => auth()->id(), 'original_name' => $uploadedFile->getClientOriginalName(),
            'stored_name' => $storedName, 'file_path' => $filePath,
            'file_size' => $uploadedFile->getSize(), 'mime_type' => $uploadedFile->getMimeType(),
            'encryption_key' => $storedKey, 'hash' => $hash, 'status' => 'safe',
        ]);

        $this->log('upload_file', $file->id, $request);
        /* =========================
             CORRELATION ENGINE HOOK
            ========================= */
            $this->triggerUploadAnalysis($file->user_id, $request->ip());
            AuditLog::create(['user_id' => auth()->id(), 'action' => 'scan_file', 'file_id' => $file->id,
            'ip_address' => $request->ip(), 'details' => json_encode(['result' => 'safe'])]);

        return response()->json(['message' => 'File uploaded, scanned, and encrypted successfully.', 'file' => $this->formatFile($file)], 201);
    }

    /* ── 3. VIEW ── */
    public function view(Request $request, int $id)
    {
        $file = File::findOrFail($id);
        $user = auth()->user();
        if (!$this->canAccess($user, $file, 'view')) return response()->json(['message' => 'Access denied.'], 403);
        if ($file->status === 'infected') return response()->json(['message' => 'Access denied: file flagged as infected.'], 403);
        if (!Storage::disk('local')->exists($file->file_path)) return response()->json(['message' => 'File not found on disk.'], 404);
        $decrypted = $this->decrypt($file);
        if ($decrypted === false) return response()->json(['message' => 'Decryption failed.'], 500);
        if (hash('sha256', $decrypted) !== $file->hash) return response()->json(['message' => 'File integrity check failed.'], 422);
        return response($decrypted, 200, [
            'Content-Type' => $file->mime_type,
            'Content-Disposition' => 'inline; filename="' . $file->original_name . '"',
            'Content-Length' => strlen($decrypted),
            'Cache-Control' => 'no-store, no-cache, must-revalidate', 'Pragma' => 'no-cache',
        ]);
    }

    /* ── 4. DOWNLOAD ── */
    public function download(Request $request, int $id)
    {
        $file = File::findOrFail($id);
        $user = auth()->user();
        if (!$this->canAccess($user, $file, 'download')) return response()->json(['message' => 'Access denied. Download permission required.'], 403);
        if ($file->status === 'infected') return response()->json(['message' => 'Access denied: file flagged as infected.'], 403);
        if (!Storage::disk('local')->exists($file->file_path)) return response()->json(['message' => 'File not found on disk.'], 404);
        $decrypted = $this->decrypt($file);
        if ($decrypted === false) return response()->json(['message' => 'Decryption failed.'], 500);
        if (hash('sha256', $decrypted) !== $file->hash) return response()->json(['message' => 'File integrity check failed.'], 422);
        $this->log('download_file', $file->id, $request);
        return response($decrypted, 200, [
            'Content-Type' => $file->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->original_name . '"',
            'Content-Length' => strlen($decrypted),
        ]);
    }

    /* ── 5. DELETE ── */
    public function destroy(Request $request, int $id)
    {
        $file = File::findOrFail($id);
        if ((int) $file->user_id !== (int) auth()->id()) return response()->json(['message' => 'Access denied.'], 403);
        $this->log('delete_file', $file->id, $request);
        Storage::disk('local')->delete($file->file_path);
        $file->delete();
        return response()->json(['message' => 'File deleted successfully.']);
    }

    /* ── 6. SHARE (فردي) ── */
    public function share(Request $request)
    {
        $request->validate(['file_id' => 'required|exists:files,id', 'shared_with' => 'required|exists:users,id', 'permission' => 'required|in:view,download']);
        $file = File::findOrFail($request->file_id);
        if ((int) $file->user_id !== (int) auth()->id()) return response()->json(['message' => 'Access denied.'], 403);
        $sharerRole = auth()->user()->role;
        if (!in_array($sharerRole, ['student', 'professor'])) return response()->json(['message' => 'Only students and professors can share files.'], 403);
        if ((int) $request->shared_with === (int) auth()->id()) return response()->json(['message' => 'Cannot share with yourself.'], 422);
        $targetUser = User::findOrFail($request->shared_with);
        $allowed = match($sharerRole) {
            'student'   => $targetUser->role === 'professor',
            'professor' => in_array($targetUser->role, ['student', 'professor']),
            default     => false,
        };
        if (!$allowed) {
            AuditLog::create(['user_id' => auth()->id(), 'action' => 'unauthorized_share_attempt', 'file_id' => $file->id,
                'ip_address' => $request->ip(), 'details' => json_encode(['sharer_role' => $sharerRole, 'target_role' => $targetUser->role])]);
            return response()->json(['message' => $sharerRole === 'student' ? 'Students can only share files with professors.' : 'Professors can only share with students or professors.'], 403);
        }
        $share = FileShare::updateOrCreate(
            ['file_id' => $file->id, 'shared_with' => $request->shared_with],
            ['shared_by' => auth()->id(), 'permission' => $request->permission]
        );
        $this->log('share_file', $file->id, $request);
        return response()->json(['message' => 'File shared successfully.', 'share' => $share], 201);
    }

    /* ══════════════════════════════════════════════════════════════
       7. SHARED WITH ME ← يدمج المشاركات الفردية + مشاركات المجموعات
    ══════════════════════════════════════════════════════════════ */
    public function sharedWithMe()
    {
        $userId = auth()->id();

        /* أ) مشاركات فردية */
        $directShares = FileShare::where('shared_with', $userId)
            ->with(['file.owner', 'sharedByUser'])
            ->get()
            ->map(fn($share) => [
                'share_id'   => $share->id,
                'share_type' => 'direct',
                'permission' => $share->permission,
                'shared_at'  => $share->created_at,
                'shared_by'  => $share->sharedByUser?->name,
                'group_name' => null,
                'file'       => $this->formatFile($share->file),
            ]);

        /* ب) مشاركات المجموعات */
        $groupIds = DB::table('group_users')->where('user_id', $userId)->pluck('group_id');

        $groupShares = GroupFileShare::whereIn('group_id', $groupIds)
            ->with(['file.owner', 'sharedByUser', 'group'])
            ->get()
            ->map(fn($share) => [
                'share_id'   => 'g_' . $share->id,
                'share_type' => 'group',
                'permission' => $share->permission,
                'shared_at'  => $share->created_at,
                'shared_by'  => $share->sharedByUser?->name,
                'group_name' => $share->group?->name,
                'file'       => $this->formatFile($share->file),
            ]);

        /* دمج + إزالة التكرار بحسب file_id */
        $all = $directShares->concat($groupShares)
            ->unique(fn($item) => $item['file']['id'] ?? null)
            ->values();

        return response()->json(['files' => $all]);
    }

    /* ══════════════════════════════════════════════════════════════
       8. FILES I SHARED ← يدمج الفردي + المجموعات
    ══════════════════════════════════════════════════════════════ */
    public function sharedByMe()
    {
        $userId = auth()->id();

        $directShares = FileShare::where('shared_by', $userId)
            ->with(['file', 'sharedWithUser'])
            ->get()
            ->map(fn($share) => [
                'share_id'       => $share->id,
                'share_type'     => 'direct',
                'permission'     => $share->permission,
                'shared_at'      => $share->created_at,
                'shared_with'    => $share->sharedWithUser?->name,
                'shared_with_id' => $share->shared_with,
                'group_name'     => null,
                'group_id'       => null,
                'file'           => $this->formatFile($share->file),
            ]);

        $groupShares = GroupFileShare::where('shared_by', $userId)
            ->with(['file', 'group'])
            ->get()
            ->map(fn($share) => [
                'share_id'       => 'g_' . $share->id,
                'share_type'     => 'group',
                'permission'     => $share->permission,
                'shared_at'      => $share->created_at,
                'shared_with'    => null,
                'shared_with_id' => null,
                'group_name'     => $share->group?->name,
                'group_id'       => $share->group_id,
                'file_id'        => $share->file_id,
                'file'           => $this->formatFile($share->file),
            ]);

        return response()->json(['files' => $directShares->concat($groupShares)->values()]);
    }

    /* ── 9. REVOKE ── */
    public function revokeShare(Request $request, int $shareId)
    {
        $share = FileShare::findOrFail($shareId);
        if ((int) $share->shared_by !== (int) auth()->id()) return response()->json(['message' => 'Access denied.'], 403);
        $this->log('revoke_share', (int) $share->file_id, $request);
        $share->delete();
        return response()->json(['message' => 'Share revoked successfully.']);
    }

    /* ── 10. USERS LIST ── */
    public function usersList()
    {
        $callerRole   = auth()->user()->role;
        $allowedRoles = match($callerRole) {
            'student'   => ['professor'],
            'professor' => ['student', 'professor'],
            default     => [],
        };
        $users = User::where('id', '!=', auth()->id())->whereIn('role', $allowedRoles)
            ->select('id', 'name', 'email', 'role')->orderBy('name')->get();
        return response()->json(['users' => $users]);
    }

    /* ══════════════════════════════════════════════════════════════
       PRIVATE HELPERS
    ══════════════════════════════════════════════════════════════ */

    /**
     * canAccess ← مُحدَّث: يتحقق من المشاركة الفردية + مشاركة المجموعة
     */
    private function canAccess(User $user, File $file, string $action): bool
    {
        /* صاحب الملف */
        if ((int) $file->user_id === (int) $user->id) return true;

        /* مشاركة فردية */
        $directOk = FileShare::where('file_id', $file->id)
            ->where('shared_with', $user->id)
            ->where(function ($q) use ($action) {
                $action === 'download'
                    ? $q->where('permission', 'download')
                    : $q->whereIn('permission', ['view', 'download']);
            })->exists();

        if ($directOk) return true;

        /* مشاركة عبر مجموعة */
        $groupIds = DB::table('group_users')->where('user_id', $user->id)->pluck('group_id');

        return GroupFileShare::where('file_id', $file->id)
            ->whereIn('group_id', $groupIds)
            ->where(function ($q) use ($action) {
                $action === 'download'
                    ? $q->where('permission', 'download')
                    : $q->whereIn('permission', ['view', 'download']);
            })->exists();
    }

    private function scanFile(string $filePath): string
    {
        $socket = @fsockopen('127.0.0.1', 3310, $errno, $errstr, 10);
        if (!$socket) throw new \Exception("ClamAV connection failed: $errstr ($errno)");
        fwrite($socket, "zINSTREAM\0");
        $handle = fopen($filePath, 'rb');
        if (!$handle) { fclose($socket); throw new \Exception("Cannot open file for scanning"); }
        while (!feof($handle)) { $chunk = fread($handle, 8192); fwrite($socket, pack('N', strlen($chunk)) . $chunk); }
        fwrite($socket, pack('N', 0));
        fclose($handle);
        $response = fgets($socket);
        fclose($socket);
        if (str_contains($response, 'OK'))    return 'safe';
if (str_contains($response, 'FOUND')) {
    Alert::create([
        'user_id' => auth()->id(),
        'type' => 'malware_detected',
        'severity' => 'critical',
        'message' => 'Malware detected during file upload scan',
        'ip' => request()->ip(),
        'context' => json_encode([
            'file_scan' => 'clamav',
            'result' => $response
        ])
    ]);

    return 'infected';
}
        throw new \Exception("Unexpected ClamAV response: $response");
    }

    private function decrypt(File $file): string|false
    {
        $encrypted = Storage::disk('local')->get($file->file_path);
        [$keyB64, $ivB64] = explode('::', $file->encryption_key);
        return openssl_decrypt($encrypted, 'AES-256-CBC', base64_decode($keyB64), OPENSSL_RAW_DATA, base64_decode($ivB64));
    }

    private function log(string $action, ?int $fileId, Request $request): void
    {
        AuditLog::create(['user_id' => auth()->id(), 'action' => $action, 'file_id' => $fileId, 'ip_address' => $request->ip()]);
    }

    private function formatFile(?File $file): ?array
    {
        if (!$file) return null;
        return [
            'id' => $file->id, 'original_name' => $file->original_name,
            'file_size' => $file->file_size, 'formatted_size' => $file->formatted_size,
            'mime_type' => $file->mime_type, 'status' => $file->status ?? 'safe',
            'created_at' => $file->created_at, 'owner' => $file->owner?->name,
        ];
    }
    /* =========================
   CORRELATION ENGINE HOOK
========================= */
private function triggerUploadAnalysis($userId, $ip)
{
    // مثال بسيط: تحليل سريع + إنشاء Alert

    $recentUploads = File::where('user_id', $userId)
        ->where('created_at', '>=', now()->subMinutes(10))
        ->count();

    if ($recentUploads >= 5) {
        Alert::create([
            'user_id' => $userId,
            'type' => 'mass_upload',
            'severity' => 'medium',
            'message' => 'User uploaded many files in short time',
            'ip' => $ip,
            'context' => json_encode([
                'uploads_last_10min' => $recentUploads
            ])
        ]);
    }

    // IP suspicious behavior
 $ipUploads = AuditLog::where('ip_address', $ip)
    ->where('action', 'upload_file')
    ->where('created_at', '>=', now()->subMinutes(10))
    ->count();

    if ($ipUploads >= 10) {
        Alert::create([
            'user_id' => $userId,
            'type' => 'suspicious_ip_activity',
            'severity' => 'high',
            'message' => 'Abnormal upload activity detected from IP',
            'ip' => $ip,
            'context' => json_encode([
                'risk' => 'high_upload_rate'
            ])
        ]);
    }
}
}

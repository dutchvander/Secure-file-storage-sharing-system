<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\File;
use App\Models\FileShare;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    private const MAX_SIZE_BYTES = 10 * 1024 * 1024;

    private const ALLOWED_MIME = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain',
        'application/msword',
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

    /* ── 2. UPLOAD ── */
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

        $rawContent = file_get_contents($uploadedFile->getRealPath());
        $hash       = hash('sha256', $rawContent);
        $key        = random_bytes(32);
        $iv         = random_bytes(16);
        $encrypted  = openssl_encrypt($rawContent, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
        $storedKey  = base64_encode($key) . '::' . base64_encode($iv);
        $storedName = Str::uuid() . '.enc';
        $filePath   = 'encrypted/' . $storedName;

        Storage::disk('local')->put($filePath, $encrypted);

        $file = File::create([
            'user_id'        => auth()->id(),
            'original_name'  => $uploadedFile->getClientOriginalName(),
            'stored_name'    => $storedName,
            'file_path'      => $filePath,
            'file_size'      => $uploadedFile->getSize(),
            'mime_type'      => $uploadedFile->getMimeType(),
            'encryption_key' => $storedKey,
            'hash'           => $hash,
        ]);

        $this->log('upload_file', $file->id, $request);

        return response()->json([
            'message' => 'File uploaded and encrypted successfully.',
            'file'    => $this->formatFile($file),
        ], 201);
    }

    /* ── 3. VIEW — GET /api/files/{id}/view ── */
    public function view(Request $request, int $id)
    {
        $file = File::findOrFail($id);
        $user = auth()->user();

        if (!$this->canAccess($user, $file, 'view')) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        if (!Storage::disk('local')->exists($file->file_path)) {
            return response()->json(['message' => 'File not found on disk.'], 404);
        }

        $decrypted = $this->decrypt($file);
        if ($decrypted === false) {
            return response()->json(['message' => 'Decryption failed.'], 500);
        }

        if (hash('sha256', $decrypted) !== $file->hash) {
            return response()->json(['message' => 'File integrity check failed.'], 422);
        }

        /* لا نسجل audit log للـ view لأنه عملية قراءة فقط */

        return response($decrypted, 200, [
            'Content-Type'        => $file->mime_type,
            'Content-Disposition' => 'inline; filename="' . $file->original_name . '"',
            'Content-Length'      => strlen($decrypted),
            'Cache-Control'       => 'no-store, no-cache, must-revalidate',
            'Pragma'              => 'no-cache',
        ]);
    }

    /* ── 4. DOWNLOAD — GET /api/files/{id}/download ── */
    public function download(Request $request, int $id)
    {
        $file = File::findOrFail($id);
        $user = auth()->user();

        if (!$this->canAccess($user, $file, 'download')) {
            return response()->json(['message' => 'Access denied. Download permission required.'], 403);
        }

        if (!Storage::disk('local')->exists($file->file_path)) {
            return response()->json(['message' => 'File not found on disk.'], 404);
        }

        $decrypted = $this->decrypt($file);
        if ($decrypted === false) {
            return response()->json(['message' => 'Decryption failed.'], 500);
        }

        if (hash('sha256', $decrypted) !== $file->hash) {
            return response()->json(['message' => 'File integrity check failed.'], 422);
        }

        $this->log('download_file', $file->id, $request);

        return response($decrypted, 200, [
            'Content-Type'        => $file->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->original_name . '"',
            'Content-Length'      => strlen($decrypted),
        ]);
    }

    /* ── 5. DELETE ── */
    public function destroy(Request $request, int $id)
    {
        $file = File::findOrFail($id);

        if ((int) $file->user_id !== (int) auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        $this->log('delete_file', $file->id, $request);
        Storage::disk('local')->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File deleted successfully.']);
    }

    /* ── 6. SHARE ── */
    public function share(Request $request)
    {
        $request->validate([
            'file_id'     => 'required|exists:files,id',
            'shared_with' => 'required|exists:users,id',
            'permission'  => 'required|in:view,download',
        ]);

        $file = File::findOrFail($request->file_id);

        if ((int) $file->user_id !== (int) auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        $sharerRole = auth()->user()->role;
        if (!in_array($sharerRole, ['student', 'professor'])) {
            return response()->json(['message' => 'Only students and professors can share files.'], 403);
        }

        $targetUser = User::findOrFail($request->shared_with);
        if ($sharerRole === 'student' && !in_array($targetUser->role, ['student', 'professor'])) {
            return response()->json(['message' => 'Students can only share with students and professors.'], 403);
        }

        if ((int) $request->shared_with === (int) auth()->id()) {
            return response()->json(['message' => 'Cannot share with yourself.'], 422);
        }

        $share = FileShare::updateOrCreate(
            ['file_id' => $file->id, 'shared_with' => $request->shared_with],
            ['shared_by' => auth()->id(), 'permission' => $request->permission]
        );

        $this->log('share_file', $file->id, $request);

        return response()->json(['message' => 'File shared successfully.', 'share' => $share], 201);
    }

    /* ── 7. SHARED WITH ME ── */
    public function sharedWithMe()
    {
        $shares = FileShare::where('shared_with', auth()->id())
            ->with(['file.owner', 'sharedByUser'])
            ->get()
            ->map(fn($share) => [
                'share_id'   => $share->id,
                'permission' => $share->permission,
                'shared_at'  => $share->created_at,
                'shared_by'  => $share->sharedByUser?->name,
                'file'       => $this->formatFile($share->file),
            ]);

        return response()->json(['files' => $shares]);
    }

    /* ── 8. FILES I SHARED ── */
    public function sharedByMe()
    {
        $shares = FileShare::where('shared_by', auth()->id())
            ->with(['file', 'sharedWithUser'])
            ->get()
            ->map(fn($share) => [
                'share_id'       => $share->id,
                'permission'     => $share->permission,
                'shared_at'      => $share->created_at,
                'shared_with'    => $share->sharedWithUser?->name,
                'shared_with_id' => $share->shared_with,
                'file'           => $this->formatFile($share->file),
            ]);

        return response()->json(['files' => $shares]);
    }

    /* ── 9. REVOKE SHARE ── */
    public function revokeShare(Request $request, int $shareId)
    {
        $share = FileShare::findOrFail($shareId);

        /* ✅ int cast على الطرفين لتجنب مقارنة string vs int */
        if ((int) $share->shared_by !== (int) auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        $fileId = (int) $share->file_id;
        $this->log('revoke_share', $fileId, $request);
        $share->delete();

        return response()->json(['message' => 'Share revoked successfully.']);
    }

    /* ── 10. USERS LIST ── */
    public function usersList()
    {
        $users = User::where('id', '!=', auth()->id())
            ->whereIn('role', ['student', 'professor'])
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return response()->json(['users' => $users]);
    }

    /* ══════════════════════════════════════════════════════════════
       PRIVATE HELPERS
    ══════════════════════════════════════════════════════════════ */

    private function canAccess(User $user, File $file, string $action): bool
    {
        /* صاحب الملف دائماً مسموح له */
        if ((int) $file->user_id === (int) $user->id) return true;

        return FileShare::where('file_id', $file->id)
            ->where('shared_with', $user->id)
            ->where(function ($q) use ($action) {
                if ($action === 'download') {
                    $q->where('permission', 'download');
                } else {
                    /* view → كلا الـ permissions مسموح */
                    $q->whereIn('permission', ['view', 'download']);
                }
            })
            ->exists();
    }

    private function decrypt(File $file): string|false
    {
        $encrypted        = Storage::disk('local')->get($file->file_path);
        [$keyB64, $ivB64] = explode('::', $file->encryption_key);

        return openssl_decrypt(
            $encrypted,
            'AES-256-CBC',
            base64_decode($keyB64),
            OPENSSL_RAW_DATA,
            base64_decode($ivB64)
        );
    }

    private function log(string $action, ?int $fileId, Request $request): void
    {
        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => $action,
            'file_id'    => $fileId,
            'ip_address' => $request->ip(),
        ]);
    }

    private function formatFile(?File $file): ?array
    {
        if (!$file) return null;

        return [
            'id'             => $file->id,
            'original_name'  => $file->original_name,
            'file_size'      => $file->file_size,
            'formatted_size' => $file->formatted_size,
            'mime_type'      => $file->mime_type,
            'created_at'     => $file->created_at,
            'owner'          => $file->owner?->name,
        ];
    }
}

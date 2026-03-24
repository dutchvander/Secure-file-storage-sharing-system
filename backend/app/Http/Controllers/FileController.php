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
    /* ══════════════════════════════════════════════════════════════
       CONSTANTS
    ══════════════════════════════════════════════════════════════ */
    private const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

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

    /* ══════════════════════════════════════════════════════════════
       1. LIST — GET /api/files
       يُعيد ملفات المستخدم الحالي
    ══════════════════════════════════════════════════════════════ */
    public function index(Request $request)
    {
        $files = File::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($f) => $this->formatFile($f));

        return response()->json(['files' => $files]);
    }

    /* ══════════════════════════════════════════════════════════════
       2. UPLOAD — POST /api/files/upload
    ══════════════════════════════════════════════════════════════ */
    public function upload(Request $request)
    {
        /* ── فقط student و professor يستطيعان الرفع ── */
        $uploaderRole = auth()->user()->role;
        if (!in_array($uploaderRole, ['student', 'professor'])) {
            return response()->json([
                'message' => 'Only students and professors can upload files.',
            ], 403);
        }

        /* ── Validation ── */
        $request->validate([
            'file' => 'required|file|max:10240',  // 10 MB
        ]);

        $uploadedFile = $request->file('file');

        /* ── Type check ── */
        if (!in_array($uploadedFile->getMimeType(), self::ALLOWED_MIME)) {
            return response()->json([
                'message' => 'File type not allowed.',
            ], 422);
        }

        /* ── Size check ── */
        if ($uploadedFile->getSize() > self::MAX_SIZE_BYTES) {
            return response()->json([
                'message' => 'File exceeds 10 MB limit.',
            ], 422);
        }

        /* ── Read raw bytes for hash + encryption ── */
        $rawContent = file_get_contents($uploadedFile->getRealPath());

        /* ── SHA-256 integrity hash ── */
        $hash = hash('sha256', $rawContent);

        /* ── AES-256 Encryption ── */
        $key = random_bytes(32);               // 256-bit key
        $iv  = random_bytes(16);               // 128-bit IV

        $encrypted = openssl_encrypt(
            $rawContent,
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );

        /* نحفظ key + iv معاً بـ base64 مفصولَين بـ :: */
        $storedKey = base64_encode($key) . '::' . base64_encode($iv);

        /* ── Store encrypted file ── */
        $storedName = Str::uuid() . '.enc';
        $filePath   = 'encrypted/' . $storedName;

        Storage::disk('local')->put($filePath, $encrypted);

        /* ── Save metadata ── */
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

        /* ── Audit log ── */
        $this->log('upload_file', $file->id, $request);

        return response()->json([
            'message' => 'File uploaded and encrypted successfully.',
            'file'    => $this->formatFile($file),
        ], 201);
    }

    /* ══════════════════════════════════════════════════════════════
       3. DOWNLOAD — GET /api/files/{id}/download
    ══════════════════════════════════════════════════════════════ */
    public function download(Request $request, int $id)
    {
        $file = File::findOrFail($id);
        $user = auth()->user();

        /* ── Access control ── */
        if (!$this->canAccess($user, $file, 'download')) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        /* ── Read encrypted file ── */
        if (!Storage::disk('local')->exists($file->file_path)) {
            return response()->json(['message' => 'File not found on disk.'], 404);
        }

        $encrypted = Storage::disk('local')->get($file->file_path);

        /* ── Decrypt ── */
        [$keyB64, $ivB64] = explode('::', $file->encryption_key);
        $key = base64_decode($keyB64);
        $iv  = base64_decode($ivB64);

        $decrypted = openssl_decrypt(
            $encrypted,
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($decrypted === false) {
            return response()->json(['message' => 'Decryption failed.'], 500);
        }

        /* ── Integrity check ── */
        if (hash('sha256', $decrypted) !== $file->hash) {
            return response()->json([
                'message' => 'File integrity check failed — file may be compromised.',
            ], 422);
        }

        /* ── Audit log ── */
        $this->log('download_file', $file->id, $request);

        return response($decrypted, 200, [
            'Content-Type'        => $file->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->original_name . '"',
            'Content-Length'      => strlen($decrypted),
        ]);
    }

    /* ══════════════════════════════════════════════════════════════
       4. DELETE — DELETE /api/files/{id}
    ══════════════════════════════════════════════════════════════ */
    public function destroy(Request $request, int $id)
    {
        $file = File::findOrFail($id);

        /* فقط صاحب الملف يستطيع الحذف */
        if ($file->user_id !== auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        /* ── Audit log قبل الحذف ── */
        $this->log('delete_file', $file->id, $request);

        /* ── حذف الملف من القرص ── */
        Storage::disk('local')->delete($file->file_path);

        /* ── حذف المعلومات من قاعدة البيانات ── */
        $file->delete();

        return response()->json(['message' => 'File deleted successfully.']);
    }

    /* ══════════════════════════════════════════════════════════════
       5. SHARE — POST /api/files/share
    ══════════════════════════════════════════════════════════════ */
    public function share(Request $request)
    {
        $request->validate([
            'file_id'     => 'required|exists:files,id',
            'shared_with' => 'required|exists:users,id',
            'permission'  => 'required|in:read,download',
        ]);

        $file = File::findOrFail($request->file_id);

        /* فقط صاحب الملف يشارك */
        if ($file->user_id !== auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        /* ── فقط student و professor يستطيعان المشاركة ── */
        $sharerRole = auth()->user()->role;
        if (!in_array($sharerRole, ['student', 'professor'])) {
            return response()->json([
                'message' => 'Only students and professors can share files.',
            ], 403);
        }

        /* ── student لا يشارك مع admin أو super_admin ── */
        $targetUser = User::findOrFail($request->shared_with);
        if ($sharerRole === 'student' &&
            !in_array($targetUser->role, ['student', 'professor'])) {
            return response()->json([
                'message' => 'Students can only share with students and professors.',
            ], 403);
        }

        /* لا يمكن المشاركة مع نفسك */
        if ($request->shared_with == auth()->id()) {
            return response()->json(['message' => 'Cannot share with yourself.'], 422);
        }

        /* إنشاء أو تحديث المشاركة */
        $share = FileShare::updateOrCreate(
            [
                'file_id'     => $file->id,
                'shared_with' => $request->shared_with,
            ],
            [
                'shared_by'  => auth()->id(),
                'permission' => $request->permission,
            ]
        );

        $this->log('share_file', $file->id, $request);

        return response()->json([
            'message' => 'File shared successfully.',
            'share'   => $share,
        ], 201);
    }

    /* ══════════════════════════════════════════════════════════════
       6. SHARED WITH ME — GET /api/files/shared-with-me
    ══════════════════════════════════════════════════════════════ */
    public function sharedWithMe()
    {
        $shares = FileShare::where('shared_with', auth()->id())
            ->with(['file.owner', 'sharedByUser'])
            ->get()
            ->map(function ($share) {
                return [
                    'share_id'    => $share->id,
                    'permission'  => $share->permission,
                    'shared_at'   => $share->created_at,
                    'shared_by'   => $share->sharedByUser?->name,
                    'file'        => $this->formatFile($share->file),
                ];
            });

        return response()->json(['files' => $shares]);
    }

    /* ══════════════════════════════════════════════════════════════
       7. FILES I SHARED — GET /api/files/shared-by-me
    ══════════════════════════════════════════════════════════════ */
    public function sharedByMe()
    {
        $shares = FileShare::where('shared_by', auth()->id())
            ->with(['file', 'sharedWithUser'])
            ->get()
            ->map(function ($share) {
                return [
                    'share_id'       => $share->id,
                    'permission'     => $share->permission,
                    'shared_at'      => $share->created_at,
                    'shared_with'    => $share->sharedWithUser?->name,
                    'shared_with_id' => $share->shared_with,
                    'file'           => $this->formatFile($share->file),
                ];
            });

        return response()->json(['files' => $shares]);
    }

    /* ══════════════════════════════════════════════════════════════
       8. REVOKE SHARE — DELETE /api/files/share/{shareId}
    ══════════════════════════════════════════════════════════════ */
    public function revokeShare(int $shareId)
    {
        $share = FileShare::findOrFail($shareId);

        if ($share->shared_by !== auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        $share->delete();

        return response()->json(['message' => 'Share revoked successfully.']);
    }

    /* ══════════════════════════════════════════════════════════════
       9. LIST USERS TO SHARE WITH — GET /api/users/list
       يُعيد قائمة المستخدمين (بدون كلمات المرور) لاختيار من تشارك
    ══════════════════════════════════════════════════════════════ */
    public function usersList()
    {
        $callerRole = auth()->user()->role;

        /* student يرى فقط student و professor
           professor يرى student و professor (لا يرى admin)  */
        $allowedRoles = match($callerRole) {
            'student'   => ['student', 'professor'],
            'professor' => ['student', 'professor'],
            default     => ['student', 'professor'],   // admin لا يشارك لكن نعيد قائمة آمنة
        };

        $users = User::where('id', '!=', auth()->id())
            ->whereIn('role', $allowedRoles)
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return response()->json(['users' => $users]);
    }

    /* ══════════════════════════════════════════════════════════════
       PRIVATE HELPERS
    ══════════════════════════════════════════════════════════════ */

    /** التحقق من صلاحية الوصول للملف */
    private function canAccess(User $user, File $file, string $permission): bool
    {
        /* صاحب الملف يملك كامل الصلاحيات */
        if ($file->user_id === $user->id) return true;

        /* التحقق من المشاركة */
        return FileShare::where('file_id', $file->id)
            ->where('shared_with', $user->id)
            ->where(function ($q) use ($permission) {
                if ($permission === 'download') {
                    $q->where('permission', 'download');
                } else {
                    $q->whereIn('permission', ['read', 'download']);
                }
            })
            ->exists();
    }

    /** تسجيل العملية في audit_logs */
    private function log(string $action, ?int $fileId, Request $request): void
    {
        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => $action,
            'file_id'    => $fileId,
            'ip_address' => $request->ip(),
        ]);
    }

    /** تنسيق بيانات الملف للـ API response */
    private function formatFile(File $file): array
    {
        return [
            'id'            => $file->id,
            'original_name' => $file->original_name,
            'file_size'     => $file->file_size,
            'formatted_size'=> $file->formatted_size,
            'mime_type'     => $file->mime_type,
            'created_at'    => $file->created_at,
            'owner'         => $file->owner?->name,
        ];
    }
}

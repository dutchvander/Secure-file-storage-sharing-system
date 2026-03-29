<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\File;
use App\Models\Group;
use App\Models\GroupFileShare;
use App\Models\User;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /* ── 1. LIST ── */
    public function index()
    {
        $this->allowProfessor();

        $groups = Group::where('created_by', auth()->id())
            ->withCount('members')
            ->with([
                'members:id,name,email,role',
                'fileShares.file',
                'fileShares.sharedByUser',
            ])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($g) => $this->formatGroup($g));

        return response()->json(['groups' => $groups]);
    }

    /* ── 2. CREATE ── */
    public function store(Request $request)
    {
        $this->allowProfessor();

        $request->validate(['name' => 'required|string|min:2|max:100']);

        $group = Group::create([
            'name'       => $request->name,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Group created successfully.',
            'group'   => $this->formatGroup($group->load(['members', 'fileShares.file'])),
        ], 201);
    }

    /* ── 3. ADD MEMBERS ── */
    public function addMembers(Request $request, int $id)
    {
        $this->allowProfessor();

        $group = Group::findOrFail($id);
        $this->ownsGroup($group);

        $request->validate([
            'user_ids'   => 'required|array|min:1',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $students = User::whereIn('id', $request->user_ids)
            ->where('role', 'student')
            ->pluck('id');

        if ($students->isEmpty()) {
            return response()->json(['message' => 'No valid students found.'], 422);
        }

        $group->members()->syncWithoutDetaching($students);

        return response()->json([
            'message'     => 'Members added successfully.',
            'added_count' => $students->count(),
            'group'       => $this->formatGroup(
                $group->load(['members', 'fileShares.file'])
            ),
        ]);
    }

    /* ── 4. REMOVE MEMBER ── */
    public function removeMember(int $id, int $userId)
    {
        $this->allowProfessor();

        $group = Group::findOrFail($id);
        $this->ownsGroup($group);

        $group->members()->detach($userId);

        return response()->json(['message' => 'Member removed successfully.']);
    }

    /* ── 5. SHARE FILE WITH GROUP ── */
    public function shareFile(Request $request, int $id)
    {
        $this->allowProfessor();

        $group = Group::findOrFail($id);
        $this->ownsGroup($group);

        $request->validate([
            'file_id'    => 'required|exists:files,id',
            'permission' => 'required|in:view,download',
        ]);

        $file = File::findOrFail($request->file_id);

        if ((int) $file->user_id !== (int) auth()->id()) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        GroupFileShare::updateOrCreate(
            ['file_id' => $file->id, 'group_id' => $group->id],
            ['shared_by' => auth()->id(), 'permission' => $request->permission]
        );

        // ← 'share_file' بدل 'group_share_file' (أقصر)
        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => 'share_file',
            'file_id'    => $file->id,
            'ip_address' => $request->ip(),
            'details'    => json_encode([
                'type'       => 'group',
                'group_id'   => $group->id,
                'group_name' => $group->name,
                'permission' => $request->permission,
            ]),
        ]);

        $updatedGroup = Group::where('id', $id)
            ->withCount('members')
            ->with(['members:id,name,email,role', 'fileShares.file'])
            ->first();

        return response()->json([
            'message' => "File shared with group \"{$group->name}\" successfully.",
            'group'   => $this->formatGroup($updatedGroup),
        ], 201);
    }

    /* ── 6. REVOKE GROUP SHARE ── */
    public function revokeShare(Request $request, int $id, int $fileId)
    {
        $this->allowProfessor();

        $group = Group::findOrFail($id);
        $this->ownsGroup($group);

        GroupFileShare::where('group_id', $id)
            ->where('file_id', $fileId)
            ->delete();

        // ← 'revoke_share' بدل 'group_revoke_share' (أقصر)
        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => 'revoke_share',
            'file_id'    => $fileId,
            'ip_address' => $request->ip(),
            'details'    => json_encode([
                'type'     => 'group',
                'group_id' => $id,
            ]),
        ]);

        return response()->json(['message' => 'Group share revoked.']);
    }

    /* ── 7. DELETE GROUP ── */
    public function destroy(int $id)
    {
        $this->allowProfessor();

        $group = Group::findOrFail($id);
        $this->ownsGroup($group);

        $group->delete();

        return response()->json(['message' => 'Group deleted successfully.']);
    }

    /* ── 8. STUDENTS LIST ── */
    public function students()
    {
        $this->allowProfessor();

        $students = User::where('role', 'student')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json(['students' => $students]);
    }

    /* ══════════════════════════════════════════════════════════════
       PRIVATE HELPERS
    ══════════════════════════════════════════════════════════════ */

    private function allowProfessor(): void
    {
        if (auth()->user()->role !== 'professor') {
            abort(403, 'Only professors can manage groups.');
        }
    }

    private function ownsGroup(Group $group): void
    {
        if ((int) $group->created_by !== (int) auth()->id()) {
            abort(403, 'Access denied.');
        }
    }

    private function formatGroup(Group $group): array
    {
        $sharedFiles = $group->relationLoaded('fileShares')
            ? $group->fileShares->map(fn($share) => [
                'share_id'   => $share->id,
                'file_id'    => $share->file_id,
                'permission' => $share->permission,
                'shared_at'  => $share->created_at,
                'file'       => $share->file ? [
                    'id'             => $share->file->id,
                    'original_name'  => $share->file->original_name,
                    'formatted_size' => $share->file->formatted_size,
                    'mime_type'      => $share->file->mime_type,
                    'status'         => $share->file->status ?? 'safe',
                ] : null,
            ])->filter(fn($s) => $s['file'] !== null)->values()
            : [];

        return [
            'id'            => $group->id,
            'name'          => $group->name,
            'members_count' => $group->members_count ?? $group->members->count(),
            'members'       => $group->relationLoaded('members')
                ? $group->members->map(fn($u) => [
                    'id'    => $u->id,
                    'name'  => $u->name,
                    'email' => $u->email,
                ])
                : [],
            'shared_files'  => $sharedFiles,
            'created_at'    => $group->created_at,
        ];
    }
}

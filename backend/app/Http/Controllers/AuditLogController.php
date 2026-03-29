<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with(['user:id,name,email,role', 'file:id,original_name'])
            ->orderByDesc('created_at');

        /* ── فلترة بالـ action ── */
        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        /* ── فلترة بالـ user ── */
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        /* ── بحث بالاسم أو الإيميل أو IP ── */
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($u) =>
                      $u->where('name',  'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                  );
            });
        }

        $logs = $query->paginate(15);

        return response()->json([
            'logs'  => $logs->items(),
            'total' => $logs->total(),
            'pages' => $logs->lastPage(),
            'page'  => $logs->currentPage(),
        ]);
    }
}

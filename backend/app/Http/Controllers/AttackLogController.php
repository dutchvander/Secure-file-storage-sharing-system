<?php

namespace App\Http\Controllers;

use App\Models\AttackLog;
use Illuminate\Http\Request;

class AttackLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AttackLog::query()->latest();

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('source') && $request->source !== 'all') {
            $query->where('source', $request->source);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('ip', 'like', "%{$s}%")
                  ->orWhere('payload', 'like', "%{$s}%")
                  ->orWhere('url', 'like', "%{$s}%");
            });
        }

        $perPage = 15;
        $paginated = $query->paginate($perPage);

        return response()->json([
            'logs'  => $paginated->items(),
            'total' => $paginated->total(),
            'page'  => $paginated->currentPage(),
            'pages' => $paginated->lastPage(),
        ]);
    }

public function stats()
{
    return response()->json([
        'total'         => AttackLog::count(),
        'blocked'       => AttackLog::where('status', 'blocked')->count(),
        'xss'           => AttackLog::where('type', 'XSS')->count(),
        'sqli'          => AttackLog::where('type', 'SQLi')->count(),
        'cmdi'          => AttackLog::where('type', 'CMDi')->count(),
        'path_traversal'=> AttackLog::where('type', 'PathTraversal')->count(),
        'file_inclusion'=> AttackLog::where('type', 'FileInclusion')->count(),
        'scanner'       => AttackLog::where('type', 'Scanner')->count(),
        'ai'            => AttackLog::where('source', 'ai')->count(),
        'rules'         => AttackLog::where('source', 'rules')->count(),
    ]);
}
}
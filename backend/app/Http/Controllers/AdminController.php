<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAlerts(Request $request)
    {
        $query = Alert::with('user'); // si tu as une relation user

        if ($request->severity && $request->severity !== 'all') {
            $query->where('severity', $request->severity);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('type', 'like', "%{$request->search}%")
                  ->orWhere('message', 'like', "%{$request->search}%")
                  ->orWhere('ip', 'like', "%{$request->search}%");
            });
        }

        $alerts = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'alerts' => $alerts->items(),
            'total'  => $alerts->total(),
            'pages'  => $alerts->lastPage(),
            'page'   => $alerts->currentPage(),
        ]);
    }
}
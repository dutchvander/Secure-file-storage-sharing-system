<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $role = $request->user()?->role;

        if (!$role || !in_array($role, ['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        return $next($request);
    }
}

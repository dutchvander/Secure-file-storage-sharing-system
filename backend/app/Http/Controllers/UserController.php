<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /* ── helper لتسجيل الأحداث ── */
    private function log(string $action, ?int $userId, Request $request, array $details = []): void
    {
        AuditLog::create([
            'user_id'    => $userId,
            'action'     => $action,
            'file_id'    => null,
            'ip_address' => $request->ip(),
            'details'    => !empty($details) ? json_encode($details) : null,
        ]);
    }

    // ─────────────────────────────────────────
    // REGISTER
    // ─────────────────────────────────────────
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'student',
        ]);

        /* ── تسجيل عملية التسجيل ── */
        $this->log('register', $user->id, $request);

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user,
        ], 201);
    }

    // ─────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $key = 'login|' . Str::lower($request->email) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);

            /* ── تسجيل محاولة محجوبة ── */
            $blocked = User::where('email', $request->email)->first();
            $this->log('login_blocked', $blocked?->id, $request, [
                'email'              => $request->email,
                'retry_after_seconds'=> $seconds,
            ]);

            return response()->json([
                'message'             => "Too many failed attempts. Please try again after {$minutes} minute(s).",
                'retry_after_seconds' => $seconds,
                'retry_after_minutes' => $minutes,
                'locked'              => true,
            ], 429);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            RateLimiter::hit($key, 3600);

            $attempts  = RateLimiter::attempts($key);
            $remaining = max(0, 5 - $attempts);

            /* ── تسجيل فشل تسجيل الدخول ── */
            $failed = User::where('email', $request->email)->first();
            $this->log('login_failed', $failed?->id, $request, [
                'email'              => $request->email,
                'attempts_remaining' => $remaining,
            ]);

            return response()->json([
                'message'            => 'Invalid email or password.',
                'attempts_remaining' => $remaining,
                'locked'             => $remaining === 0,
            ], 401);
        }

        RateLimiter::clear($key);

        $user  = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        /* ── تسجيل نجاح تسجيل الدخول ── */
        $this->log('login', $user->id, $request);

        return response()->json([
            'message' => 'Login successfully',
            'user'    => $user,
            'token'   => $token,
        ], 200);
    }

    // ─────────────────────────────────────────
    // LOGOUT
    // ─────────────────────────────────────────
    public function logout(Request $request)
    {
        /* ── تسجيل تسجيل الخروج قبل حذف التوكن ── */
        $this->log('logout', auth()->id(), $request);

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    // ─────────────────────────────────────────
    // PROFILE
    // ─────────────────────────────────────────
    public function profile()
    {
        return response()->json(['user' => auth()->user()]);
    }

    // ─────────────────────────────────────────
    // ADMIN — list all users
    // ─────────────────────────────────────────
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data'   => User::all(),
        ]);
    }

    // ─────────────────────────────────────────
    // ADMIN — delete user
    // ─────────────────────────────────────────
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete yourself'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    // ─────────────────────────────────────────
    // ADMIN — update role
    // ─────────────────────────────────────────
    public function updateRole(Request $request, $id)
    {
        $authUser = auth()->user();
        $user     = User::findOrFail($id);

        $request->validate([
            'role' => 'required|in:student,professor,admin,super_admin',
        ]);

        if ($user->id === $authUser->id) {
            return response()->json(['message' => 'You cannot change your own role'], 403);
        }

        if ($authUser->role !== 'super_admin' && in_array($request->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Only super admin can assign admin or super admin role'], 403);
        }

        if ($user->role === 'super_admin' && $authUser->role !== 'super_admin') {
            return response()->json(['message' => 'You cannot modify a super admin'], 403);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'user'    => $user,
        ]);
    }

    // ─────────────────────────────────────────
    // SETTINGS — update name
    // ─────────────────────────────────────────
    public function updateName(Request $request)
    {
        $request->validate(['name' => 'required|string|min:2|max:255']);

        $user       = auth()->user();
        $user->name = $request->name;
        $user->save();

        return response()->json([
            'message' => 'Name updated successfully',
            'user'    => $user,
        ]);
    }

    // ─────────────────────────────────────────
    // SETTINGS — update password
    // ─────────────────────────────────────────
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        if (Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'New password must be different from the current password'], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }
}

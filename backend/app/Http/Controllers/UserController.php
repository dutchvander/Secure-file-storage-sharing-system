<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
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

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }

        $user  = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

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
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    // ─────────────────────────────────────────
    // PROFILE  (GET /api/profile)
    // ─────────────────────────────────────────
    public function profile()
    {
        return response()->json([
            'user' => auth()->user(),
        ]);
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
            return response()->json([
                'message' => 'You cannot delete yourself',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
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

        // Cannot change your own role
        if ($user->id === $authUser->id) {
            return response()->json([
                'message' => 'You cannot change your own role',
            ], 403);
        }

        // Only super_admin can assign admin / super_admin
        if ($authUser->role !== 'super_admin' && in_array($request->role, ['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'Only super admin can assign admin or super admin role',
            ], 403);
        }

        // Cannot modify a super_admin unless you are one
        if ($user->role === 'super_admin' && $authUser->role !== 'super_admin') {
            return response()->json([
                'message' => 'You cannot modify a super admin',
            ], 403);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'user'    => $user,
        ]);
    }

    // ─────────────────────────────────────────
    // SETTINGS — update name  (PUT /api/settings/name)
    // ─────────────────────────────────────────
    public function updateName(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:255',
        ]);

        $user       = auth()->user();
        $user->name = $request->name;
        $user->save();

        return response()->json([
            'message' => 'Name updated successfully',
            'user'    => $user,
        ]);
    }

    // ─────────────────────────────────────────
    // SETTINGS — update password  (PUT /api/settings/password)
    // ─────────────────────────────────────────
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        // New password must differ from current
        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'New password must be different from the current password',
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
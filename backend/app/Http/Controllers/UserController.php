<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{ 

// register fonction
    public function register(Request $request){
    $request->validate([
        'name'=>'required|string|max:255',
        'email'=>'required|string|email|max:255|unique:users,email',
        'password'=>'required|string|min:8|confirmed'
    ]);
    $user=User::create([
        'name'=>$request->name,
        'email'=>$request->email,
        'password'=>Hash::make($request->password)

    ]);
    return response()->json([
        'message'=>'User Registred Successfully',
        'User'=>$user
        
        ],201);
    }

// login fonction
    public function login(Request $request){
        $request->validate([
        'email'=>'required|string|email',
        'password'=>'required|string'
    ]);
    if(!Auth::attempt($request->only('email','password')))
    return response()->json([
        'message'=>'invalid email or password'
    ],
    401
    );
    $user=User::where('email',$request->email)->firstOrFail();
    $token=$user->createToken('auth_Token')->plainTextToken;

    return response()->json([
        'message'=>'Login Successfully',
        'User'=>$user,
        'Token'=>$token
        
        ],200);
    }

// logout fonction
   public function logout(Request $request){
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'message'=>'Log out Successfully',

        
        ]);

   }

    public function profile()
{
    $user = auth()->user(); // المستخدم المسجل حالياً
    // $user = Auth::user();

    return response()->json($user);
}
}

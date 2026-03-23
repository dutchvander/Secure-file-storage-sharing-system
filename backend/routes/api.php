<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────
Route::post('register', [UserController::class, 'register']);
Route::post('login',    [UserController::class, 'login']);

// ─────────────────────────────────────────
// AUTHENTICATED ROUTES
// ─────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user',    fn(Request $r) => $r->user());
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'profile']);

    // Settings
    Route::put('/settings/name',     [UserController::class, 'updateName']);
    Route::put('/settings/password', [UserController::class, 'updatePassword']);

});

// ─────────────────────────────────────────
// ADMIN ONLY ROUTES
// ─────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    Route::get('/users',         [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}',    [UserController::class, 'updateRole']);

});
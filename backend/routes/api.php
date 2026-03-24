<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/* ── Public ── */
Route::post('register', [UserController::class, 'register']);
Route::post('login',    [UserController::class, 'login']);

/* ── Authenticated ── */
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user',    fn(Request $r) => $r->user());
    Route::post('/logout', [UserController::class, 'logout']);

    /* ─── Settings ─── */
    Route::put('/settings/name',     [UserController::class, 'updateName']);
    Route::put('/settings/password', [UserController::class, 'updatePassword']);

    /* ─── Files ─── */
    Route::prefix('files')->group(function () {
        Route::get('/',                   [FileController::class, 'index']);
        Route::post('/upload',            [FileController::class, 'upload']);
        Route::get('/shared-with-me',     [FileController::class, 'sharedWithMe']);
        Route::get('/shared-by-me',       [FileController::class, 'sharedByMe']);
        Route::post('/share',             [FileController::class, 'share']);
        Route::delete('/share/{shareId}', [FileController::class, 'revokeShare']);
        Route::get('/{id}/download',      [FileController::class, 'download']);
        Route::delete('/{id}',            [FileController::class, 'destroy']);
    });

    /* ─── Users list (للمشاركة) ─── */
    Route::get('/users/list', [FileController::class, 'usersList']);

});

/* ── Admin only ── */
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users',         [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}',    [UserController::class, 'updateRole']);

    /* ─── Audit Logs ─── */
    Route::get('/logs', [AuditLogController::class, 'index']);
});

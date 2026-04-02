<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttackLogController;


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
        Route::get('/',               [FileController::class, 'index']);
        Route::post('/upload',        [FileController::class, 'upload']);
        Route::get('/shared-with-me', [FileController::class, 'sharedWithMe']);
        Route::get('/shared-by-me',   [FileController::class, 'sharedByMe']);
        Route::post('/share',         [FileController::class, 'share']);
        Route::delete('/share/{shareId}', [FileController::class, 'revokeShare']);
        Route::get('/{id}/view',      [FileController::class, 'view']);
        Route::get('/{id}/download',  [FileController::class, 'download']);
        Route::delete('/{id}',        [FileController::class, 'destroy']);
    });

    /* ─── Users list ─── */
    Route::get('/users/list', [FileController::class, 'usersList']);

    /* ─── Groups ─── */
    Route::prefix('groups')->group(function () {
        Route::get('/students',                  [GroupController::class, 'students']);
        Route::get('/',                          [GroupController::class, 'index']);
        Route::post('/',                         [GroupController::class, 'store']);
        Route::delete('/{id}',                   [GroupController::class, 'destroy']);
        Route::post('/{id}/members',             [GroupController::class, 'addMembers']);
        Route::delete('/{id}/members/{userId}',  [GroupController::class, 'removeMember']);
        Route::post('/{id}/share',               [GroupController::class, 'shareFile']);
        Route::delete('/{id}/share/{fileId}',    [GroupController::class, 'revokeShare']);
    });
});

/* ── Admin only ── */
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users',         [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}',    [UserController::class, 'updateRole']);
    Route::get('/audit-logs',    [AuditLogController::class, 'index']);
    Route::get('/logs',          [AuditLogController::class, 'index']);

    Route::get('/attack-logs',        [AttackLogController::class, 'index']);
    Route::get('/attack-logs/stats',  [AttackLogController::class, 'stats']);
});


// // test AI bot
// Route::get('/test-ai', function() {
//     return ['message' => 'Hello AI'];
// });



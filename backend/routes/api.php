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
        /* static routes أولاً — قبل أي dynamic {id} */
        Route::get('/',               [FileController::class, 'index']);
        Route::post('/upload',        [FileController::class, 'upload']);
        Route::get('/shared-with-me', [FileController::class, 'sharedWithMe']);
        Route::get('/shared-by-me',   [FileController::class, 'sharedByMe']);
        Route::post('/share',         [FileController::class, 'share']);

        /* share/{shareId} قبل /{id} */
        Route::delete('/share/{shareId}', [FileController::class, 'revokeShare']);

        /* dynamic routes في الآخر */
        Route::get('/{id}/view',     [FileController::class, 'view']);
        Route::get('/{id}/download', [FileController::class, 'download']);
        Route::delete('/{id}',       [FileController::class, 'destroy']);
    });

    /* ─── Users list ─── */
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

/* ── Test route ── */
Route::any('/test', function () {
    return response()->json(['status' => 'ok']);
});

/* ── WAF Test Routes ── */
Route::prefix('waf-test')->group(function () {

    Route::any('/xss', function (Request $request) {
        return response()->json([
            'status' => 'XSS test passed',
            'input' => $request->all()
        ]);
    });

    Route::any('/sqli', function (Request $request) {
        return response()->json([
            'status' => 'SQLi test passed',
            'input' => $request->all()
        ]);
    });

    Route::any('/cmd', function (Request $request) {
        return response()->json([
            'status' => 'CMD test passed',
            'input' => $request->all()
        ]);
    });

    Route::any('/path', function (Request $request) {
        return response()->json([
            'status' => 'Path test passed',
            'input' => $request->all()
        ]);
    });

    Route::any('/file', function (Request $request) {
        return response()->json([
            'status' => 'File test passed',
            'input' => $request->all()
        ]);
    });

})->middleware(\App\Http\Middleware\WafMiddleware::class);

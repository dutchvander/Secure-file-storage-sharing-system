<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::post('logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum','admin'])->prefix('admin')->group(function () {

    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}', [UserController::class, 'updateRole']);

});

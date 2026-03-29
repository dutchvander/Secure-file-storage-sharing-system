<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\WafMiddleware; // ✅ أضف هذا

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
->withMiddleware(function (Middleware $middleware): void {

    $middleware->use([
        \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\WafMiddleware::class, // 🔥 هذا ضروري
       
    ]);
 

    $middleware->alias([
        'admin' => AdminMiddleware::class,
    ]);

})
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
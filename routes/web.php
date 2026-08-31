<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MovieController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/categories', [MovieController::class, 'categories']);
    Route::get('/movies', [MovieController::class, 'index']);
    Route::get('/movies/{movie}', [MovieController::class, 'show']);

    Route::middleware('auth')->group(function () {
        Route::get('/admin/movies', [MovieController::class, 'adminIndex']);
        Route::post('/admin/movies', [MovieController::class, 'store']);
        Route::match(['post', 'patch'], '/admin/movies/{movie}', [MovieController::class, 'update']);
        Route::delete('/admin/movies/{movie}', [MovieController::class, 'destroy']);
    });
});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');

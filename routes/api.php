<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are prefixed with /api automatically by the
| bootstrap/app.php configuration. Routes requiring authentication
| are grouped under the 'auth:sanctum' middleware.
|
*/

// ─── Public Routes (No Auth Required) ────────────────────────────────────────

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login',    [AuthController::class, 'login'])->name('auth.login');
});

// ─── Protected Routes (Sanctum Auth Required) ─────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // User Medical Profile
    Route::prefix('profile')->group(function () {
        Route::get('/',    [ProfileController::class, 'show'])->name('profile.show');
        Route::patch('/',  [ProfileController::class, 'update'])->name('profile.update');
    });

    // Chat Sessions & Messages
    Route::prefix('chat')->group(function () {
        Route::get('/',                                  [ChatController::class, 'index'])->name('chat.index');
        Route::post('/',                                 [ChatController::class, 'store'])->name('chat.store');
        Route::get('/{chatSession}/messages',            [ChatController::class, 'messages'])->name('chat.messages');
        Route::post('/{chatSession}/messages',           [ChatController::class, 'sendMessage'])->name('chat.sendMessage');
        Route::delete('/sessions/{id}',                  [ChatController::class, 'destroy'])->name('chat.destroy');
    });
});

<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\InterviewController;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('auth/profile', [AuthController::class, 'profile']);
    Route::put('auth/profile', [AuthController::class, 'updateProfile']);

    // Password
    Route::put('auth/password', [AuthController::class, 'changePassword']);

    // Account
    Route::delete('auth/account', [AuthController::class, 'deleteAccount']);

    // Applications
    Route::get('applications/export/csv', [ApplicationController::class, 'export']);
    Route::post('applications/{application}/resume', [ApplicationController::class, 'uploadResume']);
    Route::get('applications/{application}/resume', [ApplicationController::class, 'downloadResume']);
    Route::get('applications/{application}/history', [ApplicationController::class, 'history']);
    Route::apiResource('applications', ApplicationController::class);

    // Settings
    Route::get('auth/settings', [AuthController::class, 'settings']);
    Route::put('auth/settings', [AuthController::class, 'updateSettings']);

    // Interview Management
    Route::apiResource('interviews', InterviewController::class);
});
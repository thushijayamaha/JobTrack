<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        if (User::count() === 1) {
            Application::whereNull('user_id')->update([
                'user_id' => $user->id,
            ]);
        }

        return $this->tokenResponse($user, 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return $this->tokenResponse($user);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Profile
    |--------------------------------------------------------------------------
    */

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Account
    |--------------------------------------------------------------------------
    */

    public function deleteAccount(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Token Response
    |--------------------------------------------------------------------------
    */

    private function tokenResponse(User $user, int $status = 200)
    {
        return response()->json([
            'success' => true,
            'token' => $user->createToken('jobtrack-frontend')->plainTextToken,
            'user' => $user,
        ], $status);
    }

    public function settings(Request $request)
{
    $user = $request->user();

    return response()->json([
        'success' => true,
        'settings' => [
            'email_notifications' => (bool) $user->email_notifications,
            'interview_reminders' => (bool) $user->interview_reminders,
            'dark_mode' => (bool) $user->dark_mode,
        ],
    ]);
}

public function updateSettings(Request $request)
{
    $validated = $request->validate([
        'email_notifications' => 'required|boolean',
        'interview_reminders' => 'required|boolean',
        'dark_mode' => 'required|boolean',
    ]);

    $user = $request->user();

    $user->update([
        'email_notifications' => $validated['email_notifications'],
        'interview_reminders' => $validated['interview_reminders'],
        'dark_mode' => $validated['dark_mode'],
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Settings updated successfully.',
        'settings' => [
            'email_notifications' => (bool) $user->email_notifications,
            'interview_reminders' => (bool) $user->interview_reminders,
            'dark_mode' => (bool) $user->dark_mode,
        ],
    ]);
}
}
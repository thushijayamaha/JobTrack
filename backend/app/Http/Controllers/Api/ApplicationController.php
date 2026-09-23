<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Get all applications.
     */
    public function index(Request $request)
    {
        $applications = $request->user()->applications()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }


    /**
     * Store a new application.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'job_type' => 'required|string|max:100',
            'application_date' => 'required|date',
            'status' => 'required|string|max:100',
            'job_url' => 'nullable|url|max:255',
            'salary' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $application = $request->user()->applications()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Application created successfully.',
            'data' => $application
        ], 201);
    }


    /**
     * Get one application.
     */
    public function show(Request $request, string $id)
    {
        $application = $request->user()->applications()->find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $application
        ]);
    }


    /**
     * Update an application.
     */
    public function update(Request $request, string $id)
    {
        $application = $request->user()->applications()->find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.'
            ], 404);
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'job_type' => 'required|string|max:100',
            'application_date' => 'required|date',
            'status' => 'required|string|max:100',
            'job_url' => 'nullable|url|max:255',
            'salary' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $application->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Application updated successfully.',
            'data' => $application
        ]);
    }


    /**
     * Delete an application.
     */
    public function destroy(Request $request, string $id)
    {
        $application = $request->user()->applications()->find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.'
            ], 404);
        }

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully.'
        ]);
    }
}
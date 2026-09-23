<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Interview;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    /**
     * Get all interviews for the logged-in user.
     */
    public function index(Request $request)
    {
        $interviews = Interview::whereHas('application', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
        ->with('application')
        ->orderBy('interview_date')
        ->orderBy('interview_time')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $interviews,
        ]);
    }

    /**
     * Create a new interview.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'interview_date' => 'required|date',
            'interview_time' => 'required',
            'interview_type' => 'required|in:Online,On-site,Phone',
            'meeting_link' => 'nullable|url',
            'interviewer_name' => 'nullable|string|max:255',
            'status' => 'nullable|in:Scheduled,Completed,Cancelled',
            'notes' => 'nullable|string',
        ]);

        // Make sure the application belongs to the logged-in user.
        $application = Application::where('id', $validated['application_id'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.',
            ], 404);
        }

        $interview = Interview::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Interview created successfully.',
            'data' => $interview->load('application'),
        ], 201);
    }

    /**
     * Get one interview.
     */
    public function show(Request $request, Interview $interview)
    {
        $application = $interview->application;

        if (!$application || $application->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Interview not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $interview->load('application'),
        ]);
    }

    /**
     * Update an interview.
     */
    public function update(Request $request, Interview $interview)
    {
        $application = $interview->application;

        if (!$application || $application->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Interview not found.',
            ], 404);
        }

        $validated = $request->validate([
            'interview_date' => 'required|date',
            'interview_time' => 'required',
            'interview_type' => 'required|in:Online,On-site,Phone',
            'meeting_link' => 'nullable|url',
            'interviewer_name' => 'nullable|string|max:255',
            'status' => 'required|in:Scheduled,Completed,Cancelled',
            'notes' => 'nullable|string',
        ]);

        $interview->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Interview updated successfully.',
            'data' => $interview->fresh()->load('application'),
        ]);
    }

    /**
     * Delete an interview.
     */
    public function destroy(Request $request, Interview $interview)
    {
        $application = $interview->application;

        if (!$application || $application->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Interview not found.',
            ], 404);
        }

        $interview->delete();

        return response()->json([
            'success' => true,
            'message' => 'Interview deleted successfully.',
        ]);
    }
}
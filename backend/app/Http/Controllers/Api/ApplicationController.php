<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    /**
     * Get all applications.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:100',
            'job_type' => 'nullable|string|max:100',
            'sort' => 'nullable|in:company_name,job_title,application_date,status,created_at',
            'direction' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = $request->user()->applications();

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($applicationQuery) use ($search) {
                $applicationQuery
                    ->where('company_name', 'like', "%{$search}%")
                    ->orWhere('job_title', 'like', "%{$search}%");
            });
        }

        $query->when(!empty($validated['status']), fn ($builder) =>
            $builder->where('status', $validated['status'])
        );
        $query->when(!empty($validated['job_type']), fn ($builder) =>
            $builder->where('job_type', $validated['job_type'])
        );

        $sort = $validated['sort'] ?? 'application_date';
        $direction = $validated['direction'] ?? 'desc';
        $applications = $query
            ->orderBy($sort, $direction)
            ->paginate($validated['per_page'] ?? 10)
            ->withQueryString();

        return response()->json([
            'success' => true,
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ],
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
            'resume_path' => 'nullable|string|max:255',
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
            'data' => $application->load('statusHistory'),
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

        $previousStatus = $application->status;
        $application->update($validated);

        if ($previousStatus !== $application->status) {
            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'from_status' => $previousStatus,
                'to_status' => $application->status,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Application updated successfully.',
            'data' => $application->load('statusHistory')
        ]);
    }

    public function history(Request $request, string $id)
    {
        $application = $request->user()->applications()->find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $application->statusHistory,
        ]);
    }

    public function uploadResume(Request $request, string $id)
    {
        $application = $request->user()->applications()->find($id);

        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Application not found.'], 404);
        }

        $validated = $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        if ($application->resume_path) {
            Storage::disk('local')->delete($application->resume_path);
        }

        $path = $validated['resume']->store('resumes');
        $application->update(['resume_path' => $path]);

        return response()->json(['success' => true, 'data' => $application->fresh()]);
    }

    public function downloadResume(Request $request, string $id)
    {
        $application = $request->user()->applications()->find($id);

        if (!$application || !$application->resume_path || !Storage::disk('local')->exists($application->resume_path)) {
            return response()->json(['success' => false, 'message' => 'Resume not found.'], 404);
        }

        return Storage::disk('local')->download($application->resume_path);
    }

    public function export(Request $request)
    {
        $applications = $request->user()->applications()->latest()->get();
        $filename = 'jobtrack-applications-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($applications) {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, ['Company', 'Job Title', 'Job Type', 'Application Date', 'Status', 'Location', 'Salary', 'Job URL']);
            foreach ($applications as $application) {
                fputcsv($stream, [$application->company_name, $application->job_title, $application->job_type, $application->application_date, $application->status, $application->location, $application->salary, $application->job_url]);
            }
            fclose($stream);
        }, $filename, ['Content-Type' => 'text/csv']);
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
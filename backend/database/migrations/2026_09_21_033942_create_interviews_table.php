<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();

            // Related job application
            $table->foreignId('application_id')
                ->constrained('applications')
                ->cascadeOnDelete();

            $table->date('interview_date');
            $table->time('interview_time');

            $table->enum('interview_type', [
                'Online',
                'On-site',
                'Phone'
            ]);

            $table->string('meeting_link')->nullable();

            $table->string('interviewer_name')->nullable();

            $table->enum('status', [
                'Scheduled',
                'Completed',
                'Cancelled'
            ])->default('Scheduled');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
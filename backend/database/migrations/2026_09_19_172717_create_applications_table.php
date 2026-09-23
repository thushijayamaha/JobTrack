<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {

            $table->id();

            $table->string('company_name');

            $table->string('job_title');

            $table->string('job_type');

            $table->date('application_date');

            $table->string('status')->default('Applied');

            $table->string('job_url')->nullable();

            $table->string('salary')->nullable();

            $table->string('location')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
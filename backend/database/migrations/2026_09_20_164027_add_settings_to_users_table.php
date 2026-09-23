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
        Schema::table('users', function (Blueprint $table) {

            $table->boolean('email_notifications')
                ->default(true);

            $table->boolean('interview_reminders')
                ->default(true);

            $table->boolean('dark_mode')
                ->default(false);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'email_notifications',
                'interview_reminders',
                'dark_mode',
            ]);

        });
    }
};
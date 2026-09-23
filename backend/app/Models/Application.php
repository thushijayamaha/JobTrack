<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'job_title',
        'job_type',
        'application_date',
        'status',
        'job_url',
        'salary',
        'location',
        'notes',
    ];

    protected $casts = [
        'application_date' => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * An application can have multiple interviews.
     */
    public function interviews()
    {
        return $this->hasMany(Interview::class);
    }
}
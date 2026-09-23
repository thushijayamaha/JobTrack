<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStatusHistory extends Model
{
    protected $fillable = [
        'application_id',
        'from_status',
        'to_status',
        'note',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
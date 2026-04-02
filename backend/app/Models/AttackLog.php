<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttackLog extends Model
{
    protected $fillable = [
        'ip',
        'type',
        'payload',
        'method',
        'url',
        'user_agent',
        'source',
        'status',
        'score',
    ];

    protected $casts = [
        'score' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
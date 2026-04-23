<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    public $timestamps = false; // عندك فقط created_at

    protected $fillable = [
        'user_id',
        'type',
        'severity',
        'message',
        'ip',
        'context',
    ];

    protected $casts = [
        'context' => 'array',
    ];

    /* علاقة مع المستخدم */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
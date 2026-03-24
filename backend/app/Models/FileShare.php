<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileShare extends Model
{
    protected $fillable = [
        'file_id',
        'shared_by',
        'shared_with',
        'permission',
    ];

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    public function sharedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_by');
    }

    public function sharedWithUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_with');
    }
}

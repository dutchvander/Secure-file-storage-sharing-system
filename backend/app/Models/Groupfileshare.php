<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupFileShare extends Model
{
    protected $fillable = ['file_id', 'group_id', 'shared_by', 'permission'];

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function sharedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_by');
    }
}

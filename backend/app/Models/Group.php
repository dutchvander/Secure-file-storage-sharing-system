<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    protected $fillable = ['name', 'created_by'];

    /* ── المجموعة تنتمي إلى الأستاذ الذي أنشأها ── */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /* ── الطلاب الأعضاء في المجموعة ── */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    /* ── الملفات المشتركة مع المجموعة ── */
    public function fileShares(): HasMany
    {
        return $this->hasMany(GroupFileShare::class);
    }
}

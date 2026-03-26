<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('file_shares')
            ->where('permission', 'read')
            ->update(['permission' => 'view']);
    }

    public function down(): void
    {
        DB::table('file_shares')
            ->where('permission', 'view')
            ->update(['permission' => 'read']);
    }
};

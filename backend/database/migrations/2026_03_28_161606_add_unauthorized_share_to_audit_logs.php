<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE audit_logs MODIFY COLUMN action ENUM(
            'upload_file',
            'download_file',
            'share_file',
            'delete_file',
            'revoke_share',
            'scan_file',
            'unauthorized_share_attempt',
            'login',
            'login_failed',
            'logout',
            'register',
            'group_share_file'
        ) NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE audit_logs MODIFY COLUMN action ENUM(
            'upload_file',
            'download_file',
            'share_file',
            'delete_file',
            'revoke_share',
            'scan_file',
            'login',
            'login_failed',
            'logout',
            'register'
        ) NOT NULL");
    }
};

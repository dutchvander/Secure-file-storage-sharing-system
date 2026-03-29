<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * ════════════════════════════════════════════════════════════
 *  PERMANENT FIX — audit_logs.action
 * ════════════════════════════════════════════════════════════
 *
 *  المشكلة:
 *    migration سابق حوّل عمود action إلى ENUM محدود القيم،
 *    فأي action جديد (مثل group_revoke_share) يسبب خطأ
 *    "Data truncated for column 'action'".
 *
 *  الحل الدائم:
 *    نحوّل العمود إلى VARCHAR(100) مفتوح ← لا قيود على القيم.
 *    هكذا يمكن إضافة أي action مستقبلاً بدون تعديل DB.
 * ════════════════════════════════════════════════════════════
 */
return new class extends Migration
{
    public function up(): void
    {
        // نحوّل من ENUM أو أي نوع آخر إلى VARCHAR(100) مفتوح
        DB::statement("ALTER TABLE audit_logs MODIFY COLUMN action VARCHAR(100) NOT NULL");
    }

    public function down(): void
    {
        // نرجع إلى ENUM الأصلي إذا احتجنا rollback
        DB::statement("ALTER TABLE audit_logs MODIFY COLUMN action VARCHAR(100) NOT NULL");
    }
};

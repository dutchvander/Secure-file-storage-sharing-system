<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('files', function (Blueprint $table) {
            /*
             * pending  → لم يُفحص بعد (قيمة قديمة للسجلات الموجودة)
             * safe     → اجتاز فحص ClamAV
             * infected → رُفض من ClamAV (لن يُخزن في الواقع — فقط للـ audit)
             */
            $table->enum('status', ['pending', 'safe', 'infected'])
                  ->default('pending')
                  ->after('hash');
        });
    }

    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};

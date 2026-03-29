<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_file_shares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shared_by')->constrained('users')->cascadeOnDelete();
            $table->enum('permission', ['view', 'download'])->default('view');
            $table->timestamps();

            $table->unique(['file_id', 'group_id']); // ملف واحد لكل مجموعة مرة واحدة
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_file_shares');
    }
};

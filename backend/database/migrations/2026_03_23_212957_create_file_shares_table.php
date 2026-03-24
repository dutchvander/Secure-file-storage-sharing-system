<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('file_shares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained()->onDelete('cascade');
            $table->foreignId('shared_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('shared_with')->constrained('users')->onDelete('cascade');
            $table->enum('permission', ['read', 'download'])->default('read');
            $table->timestamps();

            // منع مشاركة نفس الملف مع نفس الشخص مرتين
            $table->unique(['file_id', 'shared_with']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_shares');
    }
};

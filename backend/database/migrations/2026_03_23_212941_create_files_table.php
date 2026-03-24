<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('original_name');
            $table->string('stored_name')->unique();
            $table->string('file_path');
            $table->unsignedBigInteger('file_size');   // bytes
            $table->string('mime_type');
            $table->text('encryption_key');             // مفتاح AES-256 مشفر بـ base64
            $table->string('hash');                     // SHA-256 للتحقق من السلامة
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};

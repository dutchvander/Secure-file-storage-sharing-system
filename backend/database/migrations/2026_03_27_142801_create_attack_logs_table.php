<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('attack_logs', function (Blueprint $table) {
    $table->id();

    $table->string('ip')->index();
    $table->string('type'); // XSS / SQLi
    $table->text('payload');

    $table->string('method')->nullable();
    $table->text('url')->nullable();
    $table->text('user_agent')->nullable();

    $table->string('source')->default('rules'); // rules / ai
    $table->string('status')->default('blocked'); // blocked / allowed
    $table->integer('score')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attack_logs');
    }
};

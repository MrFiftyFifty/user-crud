<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ФИО
            $table->string('email')->unique();
            $table->string('gender'); // Пол
            $table->date('birthdate'); // Дата рождения
            $table->rememberToken(); // Токен для "запомнить меня"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

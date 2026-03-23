<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'password' => Hash::make('admin1234'),
            'role' => 'super_admin'
        ]);

        // Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin1234'),
            'role' => 'admin'
        ]);

        // Professor
        User::create([
            'name' => 'Professor',
            'email' => 'prof@gmail.com',
            'password' => Hash::make('password1234'),
            'role' => 'professor'
        ]);

        // 10 students
        User::factory()->count(10)->create([
            'role' => 'student'
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SUPER_ADMIN,
        ]);

        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
        ]);

        // Reseller
        $reseller = User::factory()->create([
            'name' => 'Reseller User',
            'email' => 'reseller@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_RESELLER,
        ]);

        // Reseller Clients
        User::factory(5)->create([
            'role' => User::ROLE_CLIENT,
            'parent_id' => $reseller->id,
        ]);

        // Normal Clients (No parent)
        User::factory(5)->create([
            'role' => User::ROLE_CLIENT,
        ]);
    }
}

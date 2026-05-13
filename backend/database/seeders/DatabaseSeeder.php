<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = Role::pluck('id', 'slug');

        // Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $roles['super_admin'],
        ]);

        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $roles['admin'],
        ]);

        // Reseller
        $reseller = User::factory()->create([
            'name' => 'Reseller User',
            'email' => 'reseller@example.com',
            'password' => Hash::make('password'),
            'role_id' => $roles['reseller'],
        ]);

        // Reseller Clients
        User::factory(5)->create([
            'role_id' => $roles['client'],
            'parent_id' => $reseller->id,
        ]);

        // Normal Clients (No parent - though the new rule says they should have one)
        // For seeding purposes, we might still want some "orphan" clients or just assign them to the reseller
        User::factory(5)->create([
            'role_id' => $roles['client'],
            'parent_id' => $reseller->id,
        ]);
    }
}

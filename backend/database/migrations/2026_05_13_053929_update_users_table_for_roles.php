<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('is_active')->constrained('roles');
        });

        // Data migration: mapping old string roles to new role_ids
        $roles = DB::table('roles')->pluck('id', 'slug');
        
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            if (isset($roles[$user->role])) {
                DB::table('users')->where('id', $user->id)->update(['role_id' => $roles[$user->role]]);
            } else {
                // Default to client if role not found
                DB::table('users')->where('id', $user->id)->update(['role_id' => $roles['client']]);
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->foreignId('role_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->after('is_active');
        });

        // Reverse data migration
        $roles = DB::table('roles')->pluck('slug', 'id');
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            if (isset($roles[$user->role_id])) {
                DB::table('users')->where('id', $user->id)->update(['role' => $roles[$user->role_id]]);
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};

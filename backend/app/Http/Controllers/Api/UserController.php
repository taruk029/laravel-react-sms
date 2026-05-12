<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = User::query();

        // SuperAdmin and Admin can see everyone
        // Reseller can only see their clients
        if ($user->role === User::ROLE_RESELLER) {
            $query->where('parent_id', $user->id);
        }

        $users = $query->paginate(10);
        return response()->json($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|string|in:super_admin,admin,reseller,client',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = $request->role ?? User::ROLE_CLIENT;
        $parentId = null;

        // Reseller can only create clients
        if ($currentUser->role === User::ROLE_RESELLER) {
            $role = User::ROLE_CLIENT;
            $parentId = $currentUser->id;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $role,
            'parent_id' => $parentId,
            'is_active' => true,
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'User created successfully'
        ], 201);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $currentUser = $request->user();

        // Check if reseller is trying to update someone else's client
        if ($currentUser->role === User::ROLE_RESELLER && $user->parent_id !== $currentUser->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'sometimes|string|in:super_admin,admin,reseller,client',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only('name', 'email');
        
        // Only SuperAdmin/Admin can change roles
        if ($currentUser->role === User::ROLE_SUPER_ADMIN || $currentUser->role === User::ROLE_ADMIN) {
            if ($request->has('role')) {
                $data['role'] = $request->role;
            }
        }

        $user->update($data);

        return response()->json([
            'user' => $user,
            'message' => 'User updated successfully'
        ]);
    }

    /**
     * Toggle the status of the specified user.
     */
    public function toggleStatus(Request $request, User $user)
    {
        $currentUser = $request->user();

        // Check if reseller is trying to toggle someone else's client
        if ($currentUser->role === User::ROLE_RESELLER && $user->parent_id !== $currentUser->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'is_active' => $user->is_active,
            'message' => 'User status updated successfully'
        ]);
    }
}

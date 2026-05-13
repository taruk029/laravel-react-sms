<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\UserProfile;
use App\Services\NotificationService;
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
        
        $query = User::query()->excludeSuperAdmin()->with(['parent', 'role', 'profile']);

        // Role filtering from request
        if ($request->has('role')) {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('slug', $request->role);
            });
        }

        // Hierarchy filtering:
        // SuperAdmin can see everyone (except other SuperAdmins)
        // Admin can see Resellers and Clients
        if ($user->isAdmin()) {
            $query->whereHas('role', function($q) {
                $q->whereIn('slug', [User::ROLE_RESELLER, User::ROLE_CLIENT]);
            });
        } elseif ($user->isReseller()) {
            $query->where('parent_id', $user->id)
                  ->whereHas('role', function($q) {
                      $q->where('slug', User::ROLE_CLIENT);
                  });
        } elseif ($user->isClient()) {
            $query->where('id', $user->id);
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
            'mobile' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'role_slug' => 'required|string|in:admin,reseller,client',
            'parent_id' => 'sometimes|exists:users,id',
            'country' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $roleSlug = $request->role_slug;
        $parentId = $request->parent_id;

        // Handle empty parent_id from frontend
        if (empty($parentId)) {
            $parentId = null;
        }

        // Enforce Hierarchy Rules
        if ($currentUser->isSuperAdmin()) {
            // SuperAdmin can create Admin and Reseller
            if (!in_array($roleSlug, [User::ROLE_ADMIN, User::ROLE_RESELLER])) {
                return response()->json(['message' => 'SuperAdmin can only create Admins and Resellers.'], 403);
            }
            // Default parent for Admin/Reseller created by SuperAdmin is the SuperAdmin itself
            $parentId = $parentId ?? $currentUser->id;
        } elseif ($currentUser->isAdmin()) {
            // Admin can create Reseller or Client
            if (!in_array($roleSlug, [User::ROLE_RESELLER, User::ROLE_CLIENT])) {
                return response()->json(['message' => 'Admin can only create Resellers or Clients.'], 403);
            }
            
            // If Admin creates a Reseller, Admin is the parent
            // If Admin creates a Client, they MUST specify a Reseller as parent (enforced below)
            if ($roleSlug === User::ROLE_RESELLER) {
                $parentId = $currentUser->id;
            }
        } elseif ($currentUser->isReseller()) {
            // Reseller can only create Clients
            if ($roleSlug !== User::ROLE_CLIENT) {
                return response()->json(['message' => 'Reseller can only create Clients.'], 403);
            }
            $parentId = $currentUser->id;
        } else {
            return response()->json(['message' => 'Unauthorized to create users.'], 403);
        }

        $role = Role::where('slug', $roleSlug)->first();

        // Final check for Client: Must have a reseller parent
        if ($roleSlug === User::ROLE_CLIENT) {
            if (!$parentId) {
                return response()->json(['errors' => ['parent_id' => ['A Client must be assigned to a Reseller.']]], 422);
            }
            $parent = User::find($parentId);
            if (!$parent || !$parent->isReseller()) {
                return response()->json(['errors' => ['parent_id' => ['The selected parent must be a Reseller.']]], 422);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => bcrypt($request->password),
            'role_id' => $role->id,
            'parent_id' => $parentId,
            'is_active' => true,
        ]);

        // Profile data
        $profileData = [
            'country' => $request->country,
            'address' => $request->address,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profiles', 'public');
            $profileData['image'] = $path;
        }

        $user->profile()->create($profileData);

        // Notify all ancestors in the hierarchy
        $ancestors = $user->getAllAncestors();
        $newUserName = $user->name;
        $newUserRole = $role->name;
        
        foreach ($ancestors as $ancestor) {
            NotificationService::send(
                $ancestor->id,
                'New User Created',
                "A new {$newUserRole}, {$newUserName}, has been added to your hierarchy.",
                'success'
            );
        }

        return response()->json([
            'user' => $user->load(['parent', 'role', 'profile']),
            'message' => 'User created successfully'
        ], 201);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $currentUser = $request->user();

        // Prevent acting on SuperAdmin
        if ($user->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hierarchy check for Reseller
        if ($currentUser->isReseller() && ($user->parent_id !== $currentUser->id || !$user->isClient())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hierarchy check for Admin
        if ($currentUser->isAdmin() && !$user->isReseller() && !$user->isClient()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'mobile' => 'nullable|string|max:20',
            'role_slug' => 'sometimes|string|in:admin,reseller,client',
            'country' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only('name', 'email', 'mobile');
        
        // Role update logic
        if ($currentUser->isSuperAdmin() || $currentUser->isAdmin()) {
            if ($request->has('role_slug')) {
                if ($request->role_slug === User::ROLE_SUPER_ADMIN) {
                    return response()->json(['message' => 'Cannot promote to SuperAdmin'], 403);
                }
                $role = Role::where('slug', $request->role_slug)->first();
                $data['role_id'] = $role->id;
            }
        }

        $user->update($data);

        // Profile update
        $profileData = $request->only('country', 'address');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profiles', 'public');
            $profileData['image'] = $path;
        }

        $user->profile()->updateOrCreate(['user_id' => $user->id], $profileData);

        return response()->json([
            'user' => $user->load(['parent', 'role', 'profile']),
            'message' => 'User updated successfully'
        ]);
    }

    /**
     * Toggle the status of the specified user.
     */
    public function toggleStatus(Request $request, User $user)
    {
        $currentUser = $request->user();

        // Prevent acting on SuperAdmin
        if ($user->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hierarchy checks
        if ($currentUser->isReseller() && ($user->parent_id !== $currentUser->id || !$user->isClient())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($currentUser->isAdmin() && !$user->isReseller() && !$user->isClient()) {
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

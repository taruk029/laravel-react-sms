import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { Mail, Edit2, Shield, ShieldOff, Loader2, ChevronLeft, ChevronRight, X, UserPlus, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: {
    id: number;
    name: string;
    slug: 'super_admin' | 'admin' | 'reseller' | 'client';
  };
  profile?: {
    country?: string;
    address?: string;
    image?: string;
  };
  is_active: boolean;
  parent?: {
    id: number;
    name: string;
    role: {
      name: string;
      slug: string;
    };
  };
  created_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  total: number;
  data: User[];
}

const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [resellers, setResellers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    email: '', 
    mobile: '',
    role_slug: '',
    country: '',
    address: '',
    image: null as File | null
  });
  const [addForm, setAddForm] = useState({ 
    name: '', 
    email: '', 
    mobile: '',
    password: '', 
    role_slug: 'client', 
    parent_id: '',
    country: '',
    address: '',
    image: null as File | null
  });
  const [error, setError] = useState('');

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.baseUrl}/users?page=${page}`);
      setUsers(response.data.data);
      setPagination(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch resellers for the dropdown when an Admin wants to create a client (if allowed)
  // or just to have them handy.
  const fetchResellers = async () => {
    try {
      // This is a bit of a hack, ideally we'd have a specific endpoint for "list-available-parents"
      const response = await axios.get(`${API_CONFIG.baseUrl}/users?role=reseller`);
      setResellers(response.data.data.filter((u: User) => u.role?.slug === 'reseller'));
    } catch (err) {
      console.error('Failed to fetch resellers', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (currentUser?.role?.slug === 'admin' || currentUser?.role?.slug === 'super_admin') {
      fetchResellers();
    }
  }, [currentUser]);

  useEffect(() => {
    // Set default role based on current user's role
    if (currentUser?.role?.slug === 'super_admin') setAddForm(f => ({ ...f, role_slug: 'admin' }));
    else if (currentUser?.role?.slug === 'admin') setAddForm(f => ({ ...f, role_slug: 'reseller' }));
    else if (currentUser?.role?.slug === 'reseller') setAddForm(f => ({ ...f, role_slug: 'client' }));
  }, [isAddingUser, currentUser]);

  const handleToggleStatus = async (user: User) => {
    try {
      const response = await axios.patch(`${API_CONFIG.baseUrl}/users/${user.id}/status`);
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: response.data.is_active } : u));
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ 
      name: user.name, 
      email: user.email, 
      mobile: user.mobile || '',
      role_slug: user.role?.slug || 'client',
      country: user.profile?.country || '',
      address: user.profile?.address || '',
      image: null
    });
    setError('');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setUpdateLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel handles PUT with FormData via _method
      formData.append('name', editForm.name);
      formData.append('email', editForm.email);
      formData.append('mobile', editForm.mobile);
      formData.append('role_slug', editForm.role_slug);
      formData.append('country', editForm.country);
      formData.append('address', editForm.address);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      const response = await axios.post(`${API_CONFIG.baseUrl}/users/${editingUser.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUsers(users.map(u => u.id === editingUser.id ? response.data.user : u));
      setEditingUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('email', addForm.email);
      formData.append('mobile', addForm.mobile);
      formData.append('password', addForm.password);
      formData.append('role_slug', addForm.role_slug);
      
      // Only append parent_id if it's not empty, to avoid 422 validation errors in Laravel
      if (addForm.parent_id) {
        formData.append('parent_id', addForm.parent_id);
      }
      
      formData.append('country', addForm.country);
      formData.append('address', addForm.address);
      if (addForm.image) {
        formData.append('image', addForm.image);
      }

      const response = await axios.post(`${API_CONFIG.baseUrl}/users`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUsers([response.data.user, ...users]);
      setIsAddingUser(false);
      setAddForm({ 
        name: '', 
        email: '', 
        mobile: '',
        password: '', 
        role_slug: 'client', 
        parent_id: '',
        country: '',
        address: '',
        image: null
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setAddLoading(false);
    }
  };

  const getRoleBadge = (role?: { slug: string }) => {
    if (!role) return 'bg-gray-100 text-gray-800';
    switch (role.slug) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'reseller': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setIsAddingUser(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Managed By</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                            {user.profile?.image ? (
                              <img src={`${API_CONFIG.baseUrl.replace('/api', '')}/storage/${user.profile.image}`} alt="" className="h-full w-full object-cover" />
                            ) : user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadge(user.role)}`}>
                          <Tag className="w-3 h-3 mr-1 self-center" />
                          {user.role?.name || 'Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.mobile || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.parent ? (
                          <div className="text-sm text-gray-900 flex flex-col">
                            <span className="font-medium">{user.parent.name}</span>
                            <span className="text-xs text-gray-500 capitalize">{user.parent.role?.name || 'User'}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No Parent</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`${user.is_active ? 'text-red-600 bg-red-50 hover:text-red-900' : 'text-green-600 bg-green-50 hover:text-green-900'} p-2 rounded-lg transition-colors`}
                          >
                            {user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.current_page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(pagination.current_page * 10, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => fetchUsers(pagination.current_page - 1)}
                      disabled={!pagination.prev_page_url}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(pagination.last_page)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => fetchUsers(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.current_page === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => fetchUsers(pagination.current_page + 1)}
                      disabled={!pagination.next_page_url}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddingUser(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                  <button onClick={() => setIsAddingUser(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text" required
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email" required
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password" required
                      value={addForm.password}
                      onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={addForm.mobile}
                      onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={addForm.country}
                      onChange={(e) => setAddForm({ ...addForm, country: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={addForm.address}
                      onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <input
                      type="file"
                      onChange={(e) => setAddForm({ ...addForm, image: e.target.files?.[0] || null })}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {(currentUser?.role?.slug === 'super_admin' || currentUser?.role?.slug === 'admin' || currentUser?.role?.slug === 'reseller') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={addForm.role_slug}
                        onChange={(e) => setAddForm({ ...addForm, role_slug: e.target.value as any })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {currentUser?.role?.slug === 'super_admin' && (
                          <>
                            <option value="admin">Admin</option>
                            <option value="reseller">Reseller</option>
                          </>
                        )}
                        {currentUser?.role?.slug === 'admin' && <option value="reseller">Reseller</option>}
                        {currentUser?.role?.slug === 'admin' && <option value="client">Client</option>}
                        {currentUser?.role?.slug === 'reseller' && <option value="client">Client</option>}
                      </select>
                    </div>
                  )}

                  {addForm.role_slug === 'client' && currentUser?.role?.slug === 'admin' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Reseller</label>
                      <select
                        required
                        value={addForm.parent_id}
                        onChange={(e) => setAddForm({ ...addForm, parent_id: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a Reseller</option>
                        {resellers.map(reseller => (
                          <option key={reseller.id} value={reseller.id}>{reseller.name} ({reseller.email})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="mt-5 sm:mt-6 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingUser(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {addLoading ? 'Adding...' : 'Add User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setEditingUser(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
                  <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text" required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email" required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <input
                      type="file"
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.files?.[0] || null })}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {(currentUser?.role?.slug === 'super_admin' || currentUser?.role?.slug === 'admin') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={editForm.role_slug}
                        onChange={(e) => setEditForm({ ...editForm, role_slug: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="reseller">Reseller</option>
                        <option value="admin">Admin</option>
                        {currentUser?.role?.slug === 'super_admin' && <option value="super_admin">Super Admin</option>}
                      </select>
                    </div>
                  )}
                  <div className="mt-5 sm:mt-6 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updateLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

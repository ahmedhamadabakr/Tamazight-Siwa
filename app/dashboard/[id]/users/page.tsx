'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UsersLoading } from '@/components/dashboard/users-loading';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (!session || (session.user as any)?.role !== 'manager') {
      router.push('/');
    } else {
      fetchUsers();
    }
  }, [sessionStatus, session, router]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();
      if (data.success) setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user =>
          user._id === id ? { ...user, status: newStatus } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user =>
          user._id === id ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const refreshUsers = () => {
    fetchUsers();
  };

  if (loading) {
    return <UsersLoading />;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-md w-full sm:w-auto"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-auto"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={refreshUsers}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        {/* Table for desktop, cards for mobile */}
        <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 font-medium">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="p-1 border rounded text-sm"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {user.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found</div>
          )}
        </div>

        {/* Mobile view cards */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow rounded-lg p-4 border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="p-1 border rounded text-sm"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                </select>
                <button
                  onClick={() => handleStatusToggle(user._id, user.status)}
                  className={`px-2 py-1 rounded text-xs ${
                    user.status === 'active'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {user.status === 'active' ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== id));
      } else {
        alert('فشل في حذف المستخدم');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('فشل في حذف المستخدم');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="p-6">
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold">إجمالي المستخدمين</h2>
            <p className="text-3xl text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold">المستخدمين النشطين</h2>
            <p className="text-3xl text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold">المستخدمين غير النشطين</h2>
            <p className="text-3xl text-red-600">{stats.inactive}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold">المستخدمين في الانتظار</h2>
            <p className="text-3xl text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">في الانتظار</option>
            </select>
            <button
              onClick={refreshUsers}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              بحث
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">الاسم</th>
                <th className="px-6 py-3 text-right">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right">الهاتف</th>
                <th className="px-6 py-3 text-right">الدور</th>
                <th className="px-6 py-3 text-right">الحالة</th>
                <th className="px-6 py-3 text-right">تاريخ التسجيل</th>
                <th className="px-6 py-3 text-right">الإجراءات</th>
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
                      <option value="user">مستخدم</option>
                      <option value="admin">مدير</option>
                      <option value="moderator">مشرف</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status === 'active' ? 'نشط' :
                       user.status === 'inactive' ? 'غير نشط' : 'في الانتظار'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {user.status === 'active' ? 'إلغاء تفعيل' : 'تفعيل'}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا يوجد مستخدمون حالياً
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );    
}
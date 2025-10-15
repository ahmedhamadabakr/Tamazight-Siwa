'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'loading') return; // Wait for session to load

console.log(session?.user);

    if (!session?.user || session.user.role !== 'manager') {
      // Redirect to home or an unauthorized page
      router.push('/');
      return;
    }
    
    fetchUsers();
  }, [session, sessionStatus, router]);

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

  if (loading || sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'manager') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح لك بالوصول</h1>
          <p className="text-gray-700 mb-6">ليس لديك صلاحيات للوصول إلى لوحة التحكم هذه.</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            تسجيل الخروج والعودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة المستخدمين</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">إجمالي المستخدمين</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">المستخدمين النشطين</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">المستخدمين غير النشطين</h2>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.inactive}</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">المستخدمين في الانتظار</h2>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="البحث في المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="pending">في الانتظار</option>
          </select>
          <button
            onClick={refreshUsers}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            بحث
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">قائمة المستخدمين</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right font-semibold">الاسم</th>
                <th className="px-6 py-4 text-right font-semibold">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right font-semibold">الهاتف</th>
                <th className="px-6 py-4 text-right font-semibold">الدور</th>
                <th className="px-6 py-4 text-right font-semibold">الحالة</th>
                <th className="px-6 py-4 text-right font-semibold">تاريخ التسجيل</th>
                <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="p-2 border rounded text-sm bg-white"
                    >
                      <option value="user">مستخدم</option>
                      <option value="admin">مدير</option>
                      <option value="moderator">مشرف</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                      className={`px-3 py-2 rounded text-sm font-medium ${
                        user.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {user.status === 'active' ? 'إلغاء تفعيل' : 'تفعيل'}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              لا يوجد مستخدمون حالياً
            </div>
          )}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}

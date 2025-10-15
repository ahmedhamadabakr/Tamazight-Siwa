'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Analytics from '@/components/dashboard/analytics';


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

      {/* Statistics Cards - Responsive Grid */}
  <Analytics
          active={stats.active}
          total={stats.total}
          inactive={stats.inactive}
          pending={stats.pending}
        />

      {/* Filters - Responsive */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="البحث في المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          />
          <div className="grid grid-cols-2 sm:flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base flex-1"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">في الانتظار</option>
            </select>
            <button
              onClick={refreshUsers}
              className="bg-gray-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      {/* Users Table - Responsive */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">قائمة المستخدمين</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="hidden sm:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">الاسم</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">الهاتف</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">الدور</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">الحالة</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">التاريخ</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs sm:text-sm">{user.name}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm">{user.phone}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="p-1 sm:p-2 border rounded text-xs sm:text-sm bg-white w-full"
                        >
                          <option value="user">مستخدم</option>
                          <option value="admin">مدير</option>
                          <option value="moderator">مشرف</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                      <td className="px-4 py-3 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-3 space-x-1 sm:space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(user._id, user.status)}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium ${
                            user.status === 'active'
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {user.status === 'active' ? 'إيقاف' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white rounded text-xs sm:text-sm font-medium hover:bg-red-700"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
              {users.map((user) => (
                <div key={user._id} className="border-b p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{user.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status === 'active' ? 'نشط' :
                       user.status === 'inactive' ? 'غير نشط' : 'في الانتظار'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  <p className="text-sm mb-3">{user.phone}</p>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="p-1 border rounded text-xs w-full mb-2"
                    >
                      <option value="user">مستخدم</option>
                      <option value="admin">مدير</option>
                      <option value="moderator">مشرف</option>
                    </select>
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {user.status === 'active' ? 'إيقاف' : 'تفعيل'}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="flex-1 px-2 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                لا يوجد مستخدمون حالياً
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}

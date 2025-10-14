'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  permissions?: string[];
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchAdmins();
  }, []);
useEffect(() => {
    if (sessionStatus === 'loading') return; // Wait for session to load

    if (!session || session.user?.role !== 'manager') {
      // Redirect to home or an unauthorized page
      router.push('/');
    } else {
      fetchAdmins();
    }
  }, [sessionStatus, session, router]);


  const fetchAdmins = async () => {
    try {
      const response = await fetch(`/api/admins?search=${searchTerm}`);
      const data = await response.json();
      if (data.success) {
        setAdmins(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (adminData: any) => {
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        setShowAddModal(false);
      } else {
        alert('فشل في إضافة المدير: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('فشل في إضافة المدير');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(admins.map(admin =>
          admin._id === id ? { ...admin, status: newStatus } : admin
        ));
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المدير؟ لا يمكن التراجع عن هذا الإجراء.')) return;

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(admins.filter(admin => admin._id !== id));
      } else {
        alert('فشل في حذف المدير');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('فشل في حذف المدير');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">إدارة المشرفين والمديرين</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ إضافة مدير جديد
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="البحث في المشرفين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={fetchAdmins}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            بحث
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">إجمالي المدراء</h2>
            <p className="text-4xl font-bold text-blue-600 mt-2">{admins.length}</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">المدراء النشطين</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {admins.filter(a => a.status === 'active').length}
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">المدراء غير النشطين</h2>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {admins.filter(a => a.status === 'inactive').length}
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">في انتظار التفعيل</h2>
            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {admins.filter(a => a.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">قائمة المشرفين والمديرين</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right font-semibold">الاسم</th>
                  <th className="px-6 py-4 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-right font-semibold">الدور</th>
                  <th className="px-6 py-4 text-right font-semibold">الحالة</th>
                  <th className="px-6 py-4 text-right font-semibold">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{admin.fullName}</td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        admin.role === 'manager'
                          ? 'bg-purple-100 text-purple-800'
                          : admin.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        admin.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : admin.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {admin.status === 'active' ? 'نشط' :
                         admin.status === 'inactive' ? 'غير نشط' : 'في الانتظار'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(admin.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleStatusToggle(admin._id, admin.status)}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          admin.status === 'active'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {admin.status === 'active' ? 'إلغاء تفعيل' : 'تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {admins.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                لا يوجد مدراء حالياً
              </div>
            )}
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <AddAdminModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddAdmin}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Add Admin Modal Component
function AddAdminModal({ onClose, onSubmit }: { 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'مدير',
    permissions: ['users', 'tours'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">إضافة مدير جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">نوع المدير</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="مدير">مدير</option>
              <option value="مدير عام">مدير عام</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              إضافة المدير
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

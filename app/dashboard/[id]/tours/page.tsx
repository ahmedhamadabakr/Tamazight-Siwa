'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { Tour } from '@/types/tour';

export default function Tours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTour, setEditingTour] = useState<Tour | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const response = await fetch(`/api/tours?title=${searchTerm}`);
            const data = await response.json();
            if (data.success) {
                setTours(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الرحلة؟')) return;

        try {
            const response = await fetch(`/api/tours/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setTours(tours.filter(tour => tour._id !== id));
            } else {
                alert('فشل في حذف الرحلة');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
            alert('فشل في حذف الرحلة');
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            const response = await fetch(`/api/tours/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                setTours(tours.map(tour =>
                    tour._id === id ? { ...tour, status: newStatus } : tour
                ));
            }
        } catch (error) {
            console.error('Error updating tour status:', error);
        }
    };

    const refreshTours = () => {
        fetchTours();
    };

    const stats = {
        total: tours.length,
        active: tours.filter(t => t.status === 'active').length,
        featured: tours.filter(t => t.featured).length,
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <DashboardLayout>
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الرحلات السياحية</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    إضافة رحلة جديدة
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-lg font-semibold">إجمالي الرحلات</h2>
                    <p className="text-3xl text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-lg font-semibold">الرحلات النشطة</h2>
                    <p className="text-3xl text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-lg font-semibold">الرحلات المميزة</h2>
                    <p className="text-3xl text-yellow-600">{stats.featured}</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="البحث في الرحلات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={refreshTours}
                    className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    بحث
                </button>
            </div>

            {/* Tours Table */}
            <div className="bg-white shadow rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right">الصورة</th>
                            <th className="px-6 py-3 text-right">العنوان</th>
                            <th className="px-6 py-3 text-right">الفئة</th>
                            <th className="px-6 py-3 text-right">المدة</th>
                            <th className="px-6 py-3 text-right">السعر</th>
                            <th className="px-6 py-3 text-right">الحالة</th>
                            <th className="px-6 py-3 text-right">مميز</th>
                            <th className="px-6 py-3 text-right">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tours.map((tour) => (
                            <tr key={tour._id}>
                                <td className="px-6 py-4">
                                    {tour.images && tour.images.length > 0 ? (
                                        <img
                                            src={tour.images[0]}
                                            alt={tour.titleAr}
                                            className="w-16 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                            بدون صورة
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium">{tour.titleAr}</div>
                                        <div className="text-sm text-gray-500">{tour.titleEn}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{tour.category}</td>
                                <td className="px-6 py-4">{tour.duration}</td>
                                <td className="px-6 py-4">{tour.price} ريال</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        tour.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {tour.status === 'active' ? 'نشط' : 'غير نشط'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {tour.featured ? (
                                        <span className="text-yellow-600">⭐ مميز</span>
                                    ) : (
                                        <span className="text-gray-400">غير مميز</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => setEditingTour(tour)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        onClick={() => handleStatusToggle(tour._id!, tour.status)}
                                        className={`${
                                            tour.status === 'active'
                                                ? 'text-red-600 hover:text-red-900'
                                                : 'text-green-600 hover:text-green-900'
                                        }`}
                                    >
                                        {tour.status === 'active' ? 'إلغاء تفعيل' : 'تفعيل'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour._id!)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tours.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        لا توجد رحلات حالياً
                    </div>
                )}
            </div>

            {/* Add/Edit Modal would go here */}
            {showAddModal && (
                <AddTourModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={refreshTours}
                />
            )}

            {editingTour && (
                <EditTourModal
                    tour={editingTour}
                    onClose={() => setEditingTour(null)}
                    onSuccess={refreshTours}
                />
            )}
        </div>
        </DashboardLayout>
    );
}

// Add Tour Modal Component
function AddTourModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        duration: '',
        price: '',
        location: '',
        category: '',
        featured: false,
    });
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/tours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, images }),
            });

            const data = await response.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                alert(data.error || 'فشل في إضافة الرحلة');
            }
        } catch (error) {
            console.error('Error adding tour:', error);
            alert('فشل في إضافة الرحلة');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const response = await fetch('/api/tours/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                setImages(prev => [...prev, data.data.url]);
            } else {
                alert(data.error || 'فشل في رفع الصورة');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('فشل في رفع الصورة');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <DashboardLayout>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">إضافة رحلة جديدة</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">العنوان بالعربية</label>
                            <input
                                type="text"
                                value={formData.titleAr}
                                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">العنوان بالإنجليزية</label>
                            <input
                                type="text"
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف بالعربية</label>
                            <textarea
                                value={formData.descriptionAr}
                                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label>
                            <textarea
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={3}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">المدة</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="مثال: 3 أيام"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">السعر</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الموقع</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الفئة</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">اختر الفئة</option>
                                <option value="مغامرات">مغامرات</option>
                                <option value="ثقافي">ثقافي</option>
                                <option value="طبيعي">طبيعي</option>
                                <option value="شاطئي">شاطئي</option>
                                <option value="تاريخي">تاريخي</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="mr-2"
                            />
                            <label htmlFor="featured" className="text-sm font-medium">رحلة مميزة</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">صور الرحلة</label>
                        <div className="space-y-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="w-full p-2 border rounded"
                            />
                            {uploading && <p className="text-blue-600">جاري رفع الصورة...</p>}

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`صورة ${index + 1}`}
                                                className="w-full h-24 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                            إضافة الرحلة
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </DashboardLayout>  
    );
}

// Edit Tour Modal Component
function EditTourModal({ tour, onClose, onSuccess }: { tour: Tour; onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        titleAr: tour.titleAr,
        titleEn: tour.titleEn,
        descriptionAr: tour.descriptionAr,
        descriptionEn: tour.descriptionEn,
        duration: tour.duration,
        price: tour.price.toString(),
        location: tour.location,
        category: tour.category,
        featured: tour.featured,
        status: tour.status,
        images: tour.images || [],
    });
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/tours/${tour._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                alert(data.error || 'فشل في تحديث الرحلة');
            }
        } catch (error) {
            console.error('Error updating tour:', error);
            alert('فشل في تحديث الرحلة');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const response = await fetch('/api/tours/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, images: [...prev.images, data.data.url] }));
            } else {
                alert(data.error || 'فشل في رفع الصورة');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('فشل في رفع الصورة');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    return (
        <DashboardLayout>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">تعديل الرحلة</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">العنوان بالعربية</label>
                            <input
                                type="text"
                                value={formData.titleAr}
                                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">العنوان بالإنجليزية</label>
                            <input
                                type="text"
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف بالعربية</label>
                            <textarea
                                value={formData.descriptionAr}
                                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label>
                            <textarea
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={3}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">المدة</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">السعر</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الموقع</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الفئة</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">اختر الفئة</option>
                                <option value="مغامرات">مغامرات</option>
                                <option value="ثقافي">ثقافي</option>
                                <option value="طبيعي">طبيعي</option>
                                <option value="شاطئي">شاطئي</option>
                                <option value="تاريخي">تاريخي</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="mr-2"
                            />
                            <label htmlFor="featured" className="text-sm font-medium">رحلة مميزة</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">صور الرحلة</label>
                        <div className="space-y-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="w-full p-2 border rounded"
                            />
                            {uploading && <p className="text-blue-600">جاري رفع الصورة...</p>}

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`صورة ${index + 1}`}
                                                className="w-full h-24 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">الحالة</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
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
                            حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </DashboardLayout>
    );
}






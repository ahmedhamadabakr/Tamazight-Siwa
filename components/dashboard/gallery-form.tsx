'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
}

interface GalleryFormProps {
  image?: GalleryImage | null;
  onClose: () => void;
  onSave: (imageData: Partial<GalleryImage>) => Promise<void>;
}

export default function GalleryForm({ image, onClose, onSave }: GalleryFormProps) {
  const [formData, setFormData] = useState({
    title: image?.title || '',
    description: image?.description || '',
    category: image?.category || 'طبيعة',
    isActive: image?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(image?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['طبيعة', 'تراث', 'مناظر', 'أنشطة', 'طعام', 'أخرى'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'فشل في رفع الصورة');
    }

    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = image?.imageUrl || '';

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Validate required fields
      if (!formData.title.trim()) {
        alert('يرجى إدخال عنوان الصورة');
        return;
      }

      if (!imageUrl) {
        alert('يرجى اختيار صورة');
        return;
      }

      await onSave({
        ...formData,
        imageUrl,
      });

      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('فشل في حفظ الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">
            {image ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصورة *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <div className="relative h-48 w-full mb-4">
                    <Image
                      src={imagePreview}
                      alt="معاينة الصورة"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    إزالة الصورة
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      اختيار صورة
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, GIF حتى 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الصورة *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل عنوان الصورة"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الصورة
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل وصف الصورة (اختياري)"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفئة *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="mr-2 text-sm font-medium text-gray-700">
                نشط (سيظهر في المعرض)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 font-medium"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : (image ? 'تحديث' : 'إضافة')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
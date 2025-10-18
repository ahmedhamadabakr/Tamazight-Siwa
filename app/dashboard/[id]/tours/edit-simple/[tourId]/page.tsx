'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import { 
  FiArrowLeft, 
  FiSave, 
  FiImage, 
  FiX, 
  FiUpload,
  FiTrash2
} from 'react-icons/fi';

// Component بسيط لعرض الصور
const SimpleImage = ({ src, alt, className, onError }: {
  src?: string;
  alt: string;
  className?: string;
  onError?: () => void;
}) => {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">لا توجد صورة</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error('فشل تحميل الصورة:', src);
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `
            <div class="flex items-center justify-center bg-red-50 ${className}">
              <div class="text-center p-4">
                <svg class="w-12 h-12 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-600 text-sm">فشل في تحميل الصورة</p>
                <p class="text-red-400 text-xs mt-1">${src.substring(0, 30)}...</p>
              </div>
            </div>
          `;
        }
        onError?.();
      }}
    />
  );
};

type Tour = {
  _id: string;
  title: string;
  duration: string;
  groupSize: string;
  price: string;
  description: string;
  difficulty: string;
  category: string;
  location: string;
  highlights: string[];
  images: string[];
};

interface EditTourPageProps {
  params: {
    id: string;
    tourId: string;
  };
}

export default function EditSimpleTourPage({ params }: EditTourPageProps) {
  const { session } = useAuthSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [tour, setTour] = useState<Tour>({
    _id: '',
    title: '',
    duration: '',
    groupSize: '',
    price: '',
    description: '',
    difficulty: 'Easy',
    category: 'Cultural',
    location: '',
    highlights: [],
    images: [],
  });
  
  const [newHighlight, setNewHighlight] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // تحميل بيانات الرحلة
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        
        const res = await fetch(`/api/tours/${params.tourId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(session?.user?.accessToken && {
              'Authorization': `Bearer ${session.user.accessToken}`
            })
          }
        });

        if (res.ok) {
          const data = await res.json();
          console.log('بيانات الرحلة:', data);
          
          if (data.success && data.data) {
            const tourData = data.data;
            
            // معالجة الصور - استبعاد Blob URLs
            let images: string[] = [];
            
            console.log('فحص الصور الواردة:', {
              images: tourData.images,
              image: tourData.image
            });
            
            if (Array.isArray(tourData.images)) {
              images = tourData.images
                .filter(img => {
                  if (!img || typeof img !== 'string') return false;
                  // استبعاد Blob URLs لأنها لا تعمل
                  if (img.startsWith('blob:')) {
                    console.warn('🚫 تم تجاهل Blob URL:', img);
                    return false;
                  }
                  return true;
                })
                .map(img => {
                  // تحسين URLs
                  if (img.startsWith('data:')) return img;
                  if (img.startsWith('//')) return 'https:' + img;
                  if (!img.startsWith('http') && !img.startsWith('/')) return 'https://' + img;
                  return img;
                });
            } else if (tourData.image && !tourData.image.startsWith('blob:')) {
              images = [tourData.image];
            }
            
            // إضافة صور تجريبية عالية الجودة إذا لم توجد صور صالحة
            if (images.length === 0) {
              console.log('📸 إضافة صور تجريبية لأنه لا توجد صور صالحة');
              images = [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format'
              ];
            }
            
            console.log('✅ الصور النهائية (بدون Blob URLs):', images);
            
            setTour({
              _id: tourData._id || '',
              title: tourData.title || '',
              duration: tourData.duration || '',
              groupSize: tourData.groupSize || '',
              price: tourData.price?.toString() || '',
              description: tourData.description || '',
              difficulty: tourData.difficulty || 'Easy',
              category: tourData.category || 'Cultural',
              location: tourData.location || '',
              highlights: Array.isArray(tourData.highlights) ? tourData.highlights : [],
              images: images,
            });
          }
        }
      } catch (error) {
        console.error('خطأ في تحميل الرحلة:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.tourId) {
      fetchTour();
    }
  }, [params.tourId, session]);

  // معالجة تغيير البيانات
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTour(prev => ({ ...prev, [name]: value }));
  };

  // إضافة ميزة
  const addHighlight = () => {
    if (newHighlight.trim() && !tour.highlights.includes(newHighlight.trim())) {
      setTour(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  // حذف ميزة
  const removeHighlight = (highlight: string) => {
    setTour(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h !== highlight)
    }));
  };

  // رفع صورة جديدة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setTour(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // حذف صورة
  const removeImage = (index: number) => {
    setTour(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    if (selectedImageIndex >= tour.images.length - 1) {
      setSelectedImageIndex(0);
    }
  };

  // حفظ التغييرات
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/tours/${params.tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(tour)
      });

      if (response.ok) {
        alert('تم تحديث الرحلة بنجاح');
        router.push(`/dashboard/${params.id}/tours`);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'فشل في تحديث الرحلة');
      }
    } catch (error: any) {
      console.error('خطأ في التحديث:', error);
      alert(error.message || 'حدث خطأ أثناء تحديث الرحلة');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">جاري تحميل بيانات الرحلة...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            العودة للرحلات
          </button>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تعديل الرحلة</h1>
                <p className="text-gray-600">قم بتحديث تفاصيل الرحلة</p>
                
                {/* تحذير Blob URLs */}
                {tour.images.some(img => img.includes('blob:')) && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-red-800">
                        ⚠️ تم العثور على صور مؤقتة (Blob URLs) - لا يمكن عرضها
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const goodImages = [
                            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
                            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format',
                            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format'
                          ];
                          
                          setTour(prev => ({
                            ...prev,
                            images: goodImages
                          }));
                          
                          setSelectedImageIndex(0);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        إصلاح الصور
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* معلومات سريعة */}
              <div className="text-right text-sm text-gray-500">
                <p>ID: {params.tourId}</p>
                <p>الصور: {tour.images.length}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المعلومات الأساسية */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الرحلة
                </label>
                <input
                  type="text"
                  name="title"
                  value={tour.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة
                </label>
                <input
                  type="text"
                  name="duration"
                  value={tour.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حجم المجموعة
                </label>
                <input
                  type="text"
                  name="groupSize"
                  value={tour.groupSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر ($)
                </label>
                <input
                  type="text"
                  name="price"
                  value={tour.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصعوبة
                </label>
                <select
                  name="difficulty"
                  value={tour.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">سهل</option>
                  <option value="Moderate">متوسط</option>
                  <option value="Challenging">صعب</option>
                  <option value="Difficult">صعب جداً</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  name="category"
                  value={tour.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cultural">ثقافية</option>
                  <option value="Adventure">مغامرة</option>
                  <option value="Wellness">استجمام</option>
                  <option value="Nature">طبيعة</option>
                  <option value="Luxury">فاخرة</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع
              </label>
              <input
                type="text"
                name="location"
                value={tour.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={tour.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* المميزات */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">مميزات الرحلة</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="أضف ميزة جديدة..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tour.highlights.map((highlight, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {highlight}
                  <button
                    type="button"
                    onClick={() => removeHighlight(highlight)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* الصور */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">صور الرحلة ({tour.images.length})</h2>
              
              {/* معلومات الصور */}
              <div className="text-sm text-gray-500">
                {tour.images.filter(img => img.startsWith('data:')).length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                    {tour.images.filter(img => img.startsWith('data:')).length} مرفوعة
                  </span>
                )}
                {tour.images.filter(img => img.startsWith('http')).length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                    {tour.images.filter(img => img.startsWith('http')).length} روابط
                  </span>
                )}
                {tour.images.filter(img => img.startsWith('blob:')).length > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    {tour.images.filter(img => img.startsWith('blob:')).length} معطلة
                  </span>
                )}
              </div>
            </div>
            
            {/* الصورة الرئيسية */}
            {tour.images.length > 0 && (
              <div className="mb-6">
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <SimpleImage
                    src={tour.images[selectedImageIndex]}
                    alt="صورة الرحلة"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* الصور المصغرة */}
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {tour.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <SimpleImage
                        src={image}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* رفع صور جديدة */}
            <div>
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <FiUpload className="mr-2" />
                رفع صور جديدة
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                يمكنك رفع عدة صور (JPG, PNG)
              </p>
            </div>
            
            {/* رفع صور جديدة */}
            <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                  <FiUpload className="mr-2 w-4 h-4" />
                  رفع صور جديدة
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG, WebP - أقل من 5MB لكل صورة
                </p>
                
                {/* معلومات مهمة */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <div className="text-blue-800">
                    <p className="font-medium mb-2">💡 نصائح مهمة:</p>
                    <ul className="text-xs space-y-1 text-left">
                      <li>• الصور المرفوعة تُحفظ محلياً وتعمل فوراً</li>
                      <li>• إذا ظهرت رسالة "فشل التحميل"، استخدم زر "إصلاح الصور"</li>
                      <li>• تجنب الصور الكبيرة جداً لضمان الأداء الأمثل</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FiSave className="inline mr-2" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
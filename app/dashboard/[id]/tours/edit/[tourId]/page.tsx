'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import {
    FiArrowLeft,
    FiSave,
    FiImage,
    FiX,
    FiMapPin,
    FiClock,
    FiUsers,
    FiDollarSign,
    FiUpload,
    FiTrash2
} from 'react-icons/fi';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import Image from 'next/image';

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
    startDate: string;
    endDate: string;
};

interface EditTourPageProps {
    params: {
        id: string;
        tourId: string;
    };
}

export default function EditTourPage({ params }: EditTourPageProps) {
    const { session } = useAuthSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

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
        startDate: '',
        endDate: '',
    });

    const [newHighlight, setNewHighlight] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        if (!session || (session.user as any)?.role !== 'manager') {
            router.push('/');
        }
    }, [session, router]);
    
    // Fetch tour data
    const fetchTour = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(`/api/tours/${params.tourId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...((session?.user as any)?.accessToken && {
                        'Authorization': `Bearer ${(session?.user as any).accessToken}`
                    })
                },
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    const tourData = data.data;
             
                    // معالجة الصور بطريقة شاملة
                    let processedImages: string[] = [];


                    // جرب جميع الطرق الممكنة
                    if (tourData.images) {
                        if (Array.isArray(tourData.images)) {
                            // إذا كانت مصفوفة، أضف الصور الصالحة فقط
                            processedImages = tourData.images.filter((img: string | null | undefined) => 
                                img && typeof img === 'string' && img.trim() !== ''
                            );
                        } else if (typeof tourData.images === 'string') {
                            // إذا كانت string واحدة
                            processedImages = [tourData.images];
                        }
                    }

                    // إذا لم نجد صور، جرب الحقول الأخرى
                    if (processedImages.length === 0) {
                        if (tourData.image && typeof tourData.image === 'string') {
                            processedImages.push(tourData.image);
                        }
                        if (tourData.mainImage && typeof tourData.mainImage === 'string') {
                            processedImages.push(tourData.mainImage);
                        }
                    }

    

                    setTour({
                        _id: tourData._id || '',
                        title: tourData.title || tourData.titleEn || tourData.titleAr || '',
                        duration: tourData.duration || '',
                        groupSize: tourData.groupSize || tourData.group_size || '',
                        price: tourData.price?.toString() || '',
                        description: tourData.description || tourData.descriptionEn || tourData.descriptionAr || '',
                        difficulty: tourData.difficulty || 'Easy',
                        category: tourData.category || 'Cultural',
                        location: tourData.location || '',
                        highlights: Array.isArray(tourData.highlights) ? tourData.highlights : [],
                        images: processedImages,
                        startDate: tourData.startDate ? new Date(tourData.startDate).toISOString().split('T')[0] : '',
                        endDate: tourData.endDate ? new Date(tourData.endDate).toISOString().split('T')[0] : '',
                    });

                    setImagePreviews(processedImages);
                }
            }
        } catch (error) {
            console.error('Error fetching tour:', error);
        } finally {
            setLoading(false);
        }
    }, [params.tourId, (session?.user as any)?.accessToken]);

    useEffect(() => {
        if (params.tourId) {
            fetchTour();
        }
    }, [fetchTour, params.tourId]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTour(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle highlights
    const handleAddHighlight = () => {
        if (newHighlight.trim() && !tour.highlights.includes(newHighlight.trim())) {
            setTour(prev => ({
                ...prev,
                highlights: [...prev.highlights, newHighlight.trim()]
            }));
            setNewHighlight('');
        }
    };

    const handleRemoveHighlight = (highlightToRemove: string) => {
        setTour(prev => ({
            ...prev,
            highlights: prev.highlights.filter(h => h !== highlightToRemove)
        }));
    };

    // Handle images
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const newImages: string[] = [];

            for (let i = 0; i <files.length; i++) {
                const file = files[i];

                // رفع الصورة للخادم
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const res = await fetch('/api/tours/upload', {
                        method: 'POST',
                        headers: {
                            ...((session?.user as any)?.accessToken && {
                                'Authorization': `Bearer ${(session?.user as any).accessToken}`
                            })
                        },
                        body: formData,
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.data.url) {
                            newImages.push(data.data.url);
                        } else {
                            alert(`Failed to upload image: ${data.error || 'Unknown error'}`);
                        }
                    } else {
                        const errorData = await res.json();
                        alert(`Failed to upload image: ${errorData.error || 'Server error'}`);
                    }
                } catch (uploadError) {
               
                    alert('Failed to upload image please try again later');
                }
            }

            // تحديث البيانات فقط بالصور الناجحة
            if (newImages.length > 0) {
                setTour(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
                }));
                setImagePreviews(prev => [...prev, ...newImages]);
            }

        } catch (error) {
            alert('Failed to upload image please try again later');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setTour(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));

        if (mainImageIndex >= imagePreviews.length - 1) {
            setMainImageIndex(0);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user) {
            alert('Please login first');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`/api/tours/${params.tourId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(session.user as any).accessToken}`
                },
                body: JSON.stringify({
                    ...tour,
                    price: parseFloat(tour.price.replace(/[^0-9.]/g, '')) || 0
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Tour updated successfully');
                router.push(`/dashboard/${params.id}/tours`);
            } else {
                throw new Error(data.message || 'Failed to update tour');
            }
        } catch (error: any) {
            console.error('Error updating tour:', error);
            alert(error.message || 'Failed to update tour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading tour data</h2>
                    <p className="text-gray-500">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>

        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
               
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tour Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={tour.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tour Title"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tour Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={tour.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tour Description"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiClock className="inline w-4 h-4 mr-1" />
                                        Tour Duration *
                                    </label>
                                    <input
                                        type="text"
                                        id="duration"
                                        name="duration"
                                        value={tour.duration}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tour Duration"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiUsers className="inline w-4 h-4 mr-1" />
                                        Group Size *
                                    </label>
                                    <input
                                        type="text"
                                        id="groupSize"
                                        name="groupSize"
                                        value={tour.groupSize}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Group Size"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiDollarSign className="inline w-4 h-4 mr-1" />
                                        Tour Price *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="price"
                                            name="price"
                                            value={tour.price}
                                            onChange={handleChange}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Tour Price"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-sm">$</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty *
                                    </label>
                                    <select
                                        id="difficulty"
                                        name="difficulty"
                                        value={tour.difficulty}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="Easy">easy</option>
                                        <option value="Moderate">moderate</option>
                                        <option value="Challenging">challenging</option>
                                        <option value="Difficult">difficult</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={tour.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="Cultural">cultural</option>
                                        <option value="Adventure">adventure</option>
                                        <option value="Wellness">wellness</option>
                                        <option value="Nature">nature</option>
                                        <option value="Luxury">luxury</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    <FiMapPin className="inline w-4 h-4 mr-1" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={tour.location}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Example: Siwa Oasis, Egypt"
                                    required
                                />
                            </div>

                            {/* Tour Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiClock className="inline w-4 h-4 mr-1" />
                                        Tour Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={tour.startDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiClock className="inline w-4 h-4 mr-1" />
                                        Tour End Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={tour.endDate}
                                        onChange={handleChange}
                                        min={tour.startDate}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Tour Highlights</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newHighlight}
                                    onChange={(e) => setNewHighlight(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                                    placeholder="Add new highlight..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddHighlight}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tour.highlights.map((highlight, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {highlight}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveHighlight(highlight)}
                                            className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                                        >
                                            <FiX size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Tour Images</h2>
                        </div>
                        <div className="p-6">
                            {imagePreviews.length > 0 ? (
                                <div className="mb-6">
                                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                                        {imagePreviews[mainImageIndex] ? (
                                            <Image
                                                src={imagePreviews[mainImageIndex]}
                                                alt="Tour Image"
                                                fill
                                                className="object-cover"
                                                priority={false}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <div className="text-center">
                                                    <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500 text-sm">No image found</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                                        {imagePreviews.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImageIndex === idx
                                                    ? 'ring-2 ring-blue-500 border-blue-500 scale-105'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setMainImageIndex(idx)}
                                            >
                                                {img ? (
                                                    <Image
                                                        src={img}
                                                        alt={`Tour Image ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                        <FiImage className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage(idx);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg transition-colors"
                                                >
                                                    <FiTrash2 className="w-3 h-3" />
                                                </button>

                                                {/* Image Number */}
                                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <div className="text-center">
                                            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-700 mb-2">No images found</h3>
                                            <p className="text-gray-500 text-sm">Upload images for the tour to display here</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                    <FiUpload className="mr-2 h-4 w-4" />
                                    {uploading ? 'Uploading...' : 'Upload Images'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        disabled={uploading}
                                    />
                                </label>
                                <p className="mt-2 text-xs text-gray-500">
                                    You can upload multiple images (JPG, PNG). The first image will be the main image.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={saving || uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={saving || uploading}
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave className="-ml-1 mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </DashboardLayout>
    );
}
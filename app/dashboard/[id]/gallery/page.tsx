'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import GalleryForm from '@/components/dashboard/gallery-form';
import { UsersLoading } from '@/components/dashboard/users-loading';

interface GalleryImage {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function GalleryDashboard() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === 'loading') return;

        if (!session?.user || (session.user as any).role !== 'manager') {
            router.push('/');
            return;
        }

        fetchImages();
    }, [session, sessionStatus, router]);

    const fetchImages = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await fetch(`/api/gallery?${params.toString()}`);
            const data = await response.json();
            if (data.success) {
                setImages(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setImages(images.filter(img => img._id !== id));
            } else {
                alert('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/gallery/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            const data = await response.json();
            if (data.success) {
                setImages(images.map(img =>
                    img._id === id ? { ...img, isActive: !currentStatus } : img
                ));
            }
        } catch (error) {
            console.error('Error updating image status:', error);
        }
    };

    const handleSaveImage = async (imageData: Partial<GalleryImage>) => {
        try {
            const url = editingImage ? `/api/gallery/${editingImage._id}` : '/api/gallery';
            const method = editingImage ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imageData),
            });

            const data = await response.json();
            if (data.success) {
                if (editingImage) {
                    // Update existing image
                    setImages(images.map(img =>
                        img._id === editingImage._id ? { ...img, ...imageData } : img
                    ));
                } else {
                    // Add new image
                    setImages([data.data, ...images]);
                }
                setEditingImage(null);
                setShowAddModal(false);
            } else {
                alert(data.message || 'Failed to save image');
            }
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Failed to save image');
        }
    };

    const categories = ['Nature', 'Heritage', 'Scenery', 'Activities', 'Food', 'Other'];

    const stats = {
        total: images.length,
        active: images.filter(img => img.isActive).length,
        inactive: images.filter(img => !img.isActive).length,
        byCategory: categories.reduce((acc, cat) => {
            acc[cat] = images.filter(img => img.category === cat).length;
            return acc;
        }, {} as Record<string, number>)
    };

    if (loading || sessionStatus === 'loading') {
        return (
           <UsersLoading />
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Gallery Management</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Plus size={18} />
                        Add New Image
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Images</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Images</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Inactive Images</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.inactive}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Categories</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-3 border rounded-lg"
                        />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="p-3 border rounded-lg"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchImages}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Images Grid */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Gallery</h2>
                    </div>

                    {images.length === 0 ? (
                        <div className="text-center py-12">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
                            <p className="mt-1 text-sm text-gray-500">Start by adding new images to the gallery</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Add New Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                            {images.map((image) => (
                                <div key={image._id} className="bg-gray-50 rounded-lg overflow-hidden">
                                    <div className="relative h-40 sm:h-48">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${image.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {image.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">{image.title}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                                        <p className="text-xs text-gray-500 mb-3">Category: {image.category}</p>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => setEditingImage(image)}
                                                className="flex-1 bg-blue-500 text-white px-2 sm:px-3 py-2 rounded text-xs sm:text-sm hover:bg-blue-600 flex items-center justify-center gap-1"
                                            >
                                                <Edit size={12} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleStatusToggle(image._id, image.isActive)}
                                                className={`flex-1 px-2 sm:px-3 py-2 rounded text-xs sm:text-sm ${image.isActive
                                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                            >
                                                {image.isActive ? 'Hide' : 'Show'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(image._id)}
                                                className="bg-red-500 text-white px-2 sm:px-3 py-2 rounded text-xs sm:text-sm hover:bg-red-600 flex items-center justify-center"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingImage) && (
                <GalleryForm
                    image={editingImage}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingImage(null);
                    }}
                    onSave={handleSaveImage}
                />
            )}
        </DashboardLayout>
    );
}
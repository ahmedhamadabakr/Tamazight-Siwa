'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiMapPin,
    FiClock,
    FiUsers,
    FiDollarSign
} from 'react-icons/fi';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession } from 'next-auth/react';
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
    images: string[];
    image?: string; // الصورة الرئيسية
};

interface ToursPageProps {
    params: {
        id: string;
    };
}

export default function ToursPage({ params }: ToursPageProps) {
   
    const router = useRouter();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === 'loading') return; // Wait for session to load

        if (!session || (session.user as any)?.role !== 'manager') {
            // Redirect to home or an unauthorized page
            router.push('/');
        } else {
            fetchTours();
        }
    }, [sessionStatus, session, router]);

    // Fetch tours
    const fetchTours = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/tours', {
                headers: {
                    'Content-Type': 'application/json',
                    ...((session?.user as any)?.accessToken && {
                        'Authorization': `Bearer ${(session?.user as any).accessToken}`
                    })
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setTours(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, [session]);

    // Delete tour
    const handleDelete = async (tourId: string) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;

        try {
            const res = await fetch(`/api/tours/${tourId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${(session?.user as any).accessToken}`
                }
            });

            if (res.ok) {
                setTours(tours.filter(tour => tour._id !== tourId));
                alert('Tour deleted successfully!');
            } else {
                alert('Failed to delete tour');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
            alert('Failed to delete tour');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading tours...</h2>
                    <p className="text-gray-500">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tour Management</h1>
                        <p className="mt-2 text-gray-600">Manage and edit your tours</p>
                    </div>
                    <Link
                        href={`/dashboard/${params.id}/tours/new-trip`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add New Tour
                    </Link>
                </div>

                {/* Tours Grid */}
                {tours.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiMapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
                        <p className="text-gray-500 mb-6">Start by adding your first tour</p>
                        <Link
                            href={`/dashboard/${params.id}/tours/new-trip`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <FiPlus className="mr-2 h-4 w-4" />
                            Add New Tour
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {tours.map((tour) => (
                            <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Tour Image */}
                                <div className="relative h-40 sm:h-48 bg-gray-200">
                                    {(tour.images && tour.images[0]) || tour.image ? (
                                        <Image
                                            src={(tour.images && tour.images[0]) || tour.image!}
                                            alt={tour.title}
                                            fill
                                            priority={false}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    {/* Overlay gradient */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {tour.category}
                                        </span>
                                    </div>
                                    {/* Duration Chip */}
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur">
                                            <FiClock className="w-3.5 h-3.5 mr-1" />
                                            {parseInt(tour.duration) > 1 ? `${tour.duration} days` : `${tour.duration} day`}
                                        </span>
                                    </div>
                                </div>

                                {/* Tour Content */}
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {tour.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {tour.description}
                                    </p>

                                    {/* Tour Details */}
                                    <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiMapPin className="w-4 h-4 mr-2" />
                                                {tour.location} {tour.location.split(',').length > 1 ? 'Locations' : 'Location'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiClock className="w-4 h-4 mr-2" />
                                                {parseInt(tour.duration) > 1 ? `${tour.duration} days` : `${tour.duration} day`}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiUsers className="w-4 h-4 mr-2" />
                                                {tour.groupSize} {parseInt(tour.groupSize) > 1 ? 'People' : 'Person'}
                                            </div>
                                            <div className="flex items-center text-sm font-semibold text-green-600">
                                                <FiDollarSign className="w-4 h-4 mr-2" />
                                                ${tour.price}
                                            </div>
                                        </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => router.push(`/dashboard/${params.id}/tours/edit/${tour._id}`)}
                                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FiEdit className="w-4 h-4 mr-1" />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(tour._id)}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <FiTrash2 className="w-4 h-4 sm:mr-0" />
                                            <span className="sm:hidden ml-1">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
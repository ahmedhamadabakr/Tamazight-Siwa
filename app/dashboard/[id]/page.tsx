'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Analytics from '@/components/dashboard/analytics';
import { UsersLoading } from '@/components/dashboard/users-loading';
import {
  Calendar,
  Users as UsersIcon,
  CreditCard,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

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

interface Booking {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  tour: {
    title: string;
    destination: string;
    price: number;
  };
  travelers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand';
  createdAt: string;
}

export default function ManagerDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (!session?.user || (session.user as any).role !== 'manager') {
      router.push('/');
      return;
    }

    fetchData();
  }, [session, sessionStatus, router]);

  const fetchData = async () => {
    try {
      // Fetch users and bookings in parallel
      const [usersResponse, bookingsResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/admin/bookings')
      ]);

      const usersData = await usersResponse.json();
      const bookingsData = await bookingsResponse.json();

      if (usersData.success) {
        setUsers(usersData.data || []);
      }

      if (bookingsData.success) {
        setBookings(bookingsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    totalTravelers: bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.travelers, 0)
  };

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading || sessionStatus === 'loading') {
    return (
      <UsersLoading />
    );
  }

  if (!session || (session.user as any)?.role !== 'manager') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">You are not authorized to access this dashboard</h1>
          <p className="text-gray-700 mb-6">You do not have permissions to access this dashboard.</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Logout and return to the home page
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              href="/admin/bookings"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm sm:text-base"
            >
              Bookings Management
            </Link>
          </div>
        </div>

        {/* User Statistics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">User Statistics</h2>
          <Analytics
            active={userStats.active}
            total={userStats.total}
            inactive={userStats.inactive}
            pending={userStats.pending}
          />
        </div>

        {/* Booking Statistics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Booking Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Total Bookings</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{bookingStats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Confirmed Bookings</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{bookingStats.confirmed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Pending Bookings</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{bookingStats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{bookingStats.totalRevenue.toLocaleString()} Dollars</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Travelers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{bookingStats.totalTravelers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Cancelled Bookings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{bookingStats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <button
                onClick={() => router.push('/admin/bookings')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Show All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent bookings found</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer gap-3"
                    onClick={() => window.open(`/booking-confirmation/${booking._id}`, '_blank')}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{booking.tour.title}</p>
                        <p className="text-sm text-gray-500">{booking.user.name} • {booking.travelers} People</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="font-medium text-gray-900">{booking.totalAmount.toLocaleString()} Dollars</p>
                      <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

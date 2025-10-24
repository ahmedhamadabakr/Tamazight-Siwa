'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Analytics from '@/components/dashboard/analytics';
import { UsersLoading } from '@/components/dashboard/users-loading';


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

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
  };

  if (loading || sessionStatus === 'loading') {
    return (
      <UsersLoading />
    );
  }

  if (!session || session.user?.role !== 'manager') {
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
    <div>
      <h1 className="text-3xl font-bold mb-6">User Analytics</h1>

      {/* Statistics Cards - Responsive Grid */}
  <Analytics
          active={stats.active}
          total={stats.total}
          inactive={stats.inactive}
          pending={stats.pending}
        />
    </div>
    </DashboardLayout>
  );
}

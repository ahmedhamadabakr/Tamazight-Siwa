'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { BarChart3, Users, MapPin, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}
export function DashboardLayout({ children }: SidebarProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Get user role from localStorage or authentication system
    const getUserRole = async () => {
      try {
        // For demo purposes, set default role as general manager
        // In production, this should come from proper authentication
        if (!localStorage.getItem('userRole')) {
          localStorage.setItem('userRole', 'مدير عام');
        }

        const role = localStorage.getItem('userRole') || 'مدير عام';
        setUserRole(role);
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole('مدير عام'); // Default fallback
      }
    };

    getUserRole();
  }, []);

  const menuItems = [
    {
      href: '/dashboard',
      label: 'نظرة عامة',
      icon: BarChart3,
    },
    {
      href: '/dashboard/users',
      label: 'إدارة المستخدمين',
      icon: Users,
    },
    {
      href: '/dashboard/tours',
      label: 'إدارة الرحلات',
      icon: MapPin,
    },
  ];

  // Only show admin management for general managers (مدير عام)
  if (userRole === 'مدير عام') {
    menuItems.push({
      href: '/dashboard/admins',
      label: 'إدارة المشرفين',
      icon: Settings,
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TS</span>
            </div>
            <span className="font-bold text-xl text-foreground">لوحة التحكم</span>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-4 py-3 w-full text-right rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

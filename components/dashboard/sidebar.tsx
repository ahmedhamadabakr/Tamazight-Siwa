'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { handleSignOut } from '@/lib/auth-utils';
import {
  BarChart3,
  Users,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  Image,
  Star,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: SidebarProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('Admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'General Manager';
    setUserRole(storedRole);
  }, []);

  const menuItems = [
    { href: `/dashboard/${session?.user?.id}`, label: 'Overview', icon: BarChart3 },
    { href: `/dashboard/${session?.user?.id}/users`, label: 'Users Management', icon: Users },
    { href: `/dashboard/${session?.user?.id}/tours`, label: 'Tours Management', icon: MapPin },
    { href: `/dashboard/${session?.user?.id}/reviews`, label: 'Reviews Management', icon: Star },
    { href: `/dashboard/${session?.user?.id}/gallery`, label: 'Gallery Management', icon: Image },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Mobile Header */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white flex items-center justify-between px-4 shadow-sm transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''
          }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-semibold">
          {menuItems.find((item) => item.href === pathname)?.label ||
            'Dashboard'}
        </h1>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              TS
            </div>
            <div>
              <h2 className="font-semibold text-lg">Tamazight Siwa</h2>
              <p className="text-xs text-gray-500">Dashboard Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'
                    }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full font-semibold">
              {userRole.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userRole}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>

          <button
            onClick={() => handleSignOut('/')}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 py-2 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-64 pt-16 md:pt-0">
        <div className="p-6">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

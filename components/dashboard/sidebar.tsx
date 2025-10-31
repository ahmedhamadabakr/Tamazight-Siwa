'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  MapPin,
  LogOut,
  Menu,
  X,
  Image,
  Star,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔁 إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 🌫️ إضافة ظل عند التمرير
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🧠 جلب الدور من localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'General Manager';
    setUserRole(storedRole);
  }, []);

  // 🚫 Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
      // Add/remove padding to prevent layout shift when scrollbar disappears
      document.body.style.paddingRight = isMobileMenuOpen ? 
        `${window.innerWidth - document.documentElement.clientWidth}px` : '';
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [isMobileMenuOpen]);

  // 🧭 تسجيل خروج فعلي مع إعادة توجيه
  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force redirect
      router.push('/');
    }
  };

  // 🧩 عناصر القائمة الجانبية
  const menuItems = useMemo(() => {
    if (!session?.user?.id) return [];
    return [
      { href: `/dashboard/${session.user.id}`, label: 'Overview', icon: BarChart3 },
      { href: `/dashboard/${session.user.id}/users`, label: 'Users Management', icon: Users },
      { href: `/dashboard/${session.user.id}/tours`, label: 'Tours Management', icon: MapPin },
      { href: `/dashboard/${session.user.id}/reviews`, label: 'Reviews Management', icon: Star },
      { href: `/dashboard/${session.user.id}/gallery`, label: 'Gallery Management', icon: Image },
    ];
  }, [session]);

  // 🧱 لو المستخدم مش مسجل دخول → توجيه تلقائي
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // ⏳ أثناء تحميل الجلسة
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* ✅ Mobile Header */}
      {/* Mobile Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-16 bg-white flex items-center justify-between px-4 shadow-sm transition-all duration-300 ${
          isScrolled ? 'shadow-md' : ''
        } md:hidden`}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
            {menuItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
          </h1>
        </div>
        <div className="w-8"></div> {/* Spacer for balance */}
      </header>

      {/* ✅ Sidebar */}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0`}
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ✅ User Info + Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full font-semibold">
              {userRole?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {userRole || 'Loading...'}
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 py-2 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ✅ Main Content */}
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 md:ml-64">
        <div className="p-4 sm:p-6">{children}</div>
      </main>

      {/* ✅ Overlay for mobile */}
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

"use client"

import { useState, memo, useCallback, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, User, LogOut, Settings, Shield, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserRole = 'user' | 'manager' | 'admin';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
}

export const Navigation = memo(function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const user = session?.user as SessionUser | undefined;
  const userRole = user?.role;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const profileLink = user?.id
    ? user.role === 'manager' || user.role === 'admin' ? `/admin/dashboard` : `/user/${user.id}`
    : '/login';

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', active: pathname === '/' },
    { name: 'About Us', href: '/about', active: pathname === '/about' },
    { name: 'Tours & Experiences', href: '/tours', active: pathname.startsWith('/tours') },
    { name: 'Gallery', href: '/gallery', active: pathname === '/gallery' },
    { name: 'Contact', href: '/contact', active: pathname === '/contact' },
  ];

  // Handle sign out with useCallback for performance
  const handleSignOutClick = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
    setIsOpen(false);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Show skeleton while loading session
  if (status === 'loading') {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/98 backdrop-blur-lg border-b border-gray-200/80 shadow-lg'
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900">Tamazight Siwa</span>
                <span className="text-xs text-gray-500 -mt-1">Authentic Experiences</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-1">
                <Link href="/" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                  Home
                </Link>
                <Link href="/about" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                  About Us
                </Link>
                <Link href="/tours" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                  Tours & Experiences
                </Link>
                <Link href="/gallery" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                  Gallery
                </Link>
              </div>

              {/* Loading skeleton for auth buttons */}
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-white/98 backdrop-blur-lg border-b border-gray-200/80 shadow-lg'
      : 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors duration-300">Tamazight Siwa</span>
              <span className="text-xs text-gray-500 -mt-1">Authentic Experiences</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 transition-all duration-300 rounded-lg font-medium whitespace-nowrap ${item.active
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                  {item.active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {status === 'authenticated' && user ? (
              <div className="flex items-center space-x-4 ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {(userRole === 'manager' || userRole === 'admin') && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="w-full cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userRole === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/settings" className="w-full cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          System Settings
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={userRole === 'user' ? `/user/${user.id}` : profileLink} className="w-full cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        {userRole === 'user' ? 'My Profile' : 'Profile'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOutClick}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary hover:bg-gray-50">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-2 space-y-2">
            <div className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${item.active
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden mr-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email || ''}</p>
                  </div>
                </div>
                <div className="px-2 space-y-1">
                  {(userRole === 'manager' || userRole === 'admin') && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href={userRole === 'user' ? `/user/${user.id}` : profileLink}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {userRole === 'user' ? 'My Profile' : 'Profile'}
                  </Link>
                  <button
                    onClick={handleSignOutClick}
                    className="w-full flex items-center text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <div className="px-2 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                    onClick={closeMobileMenu}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}

            <div className="px-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">+20 123 456 789</span>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md font-semibold"
                onClick={closeMobileMenu}
              >
                Book Your Trip
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
});

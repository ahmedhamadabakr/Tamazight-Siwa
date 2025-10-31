'use client';

import { useState, Suspense, lazy } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { NavigationSkeleton } from "./NavigationSkeleton";
import Image from "next/image";

// Lazy load heavy components
const DropdownMenu = lazy(() => import("@/components/ui/dropdown-menu").then(mod => ({ default: mod.DropdownMenu })));
const DropdownMenuContent = lazy(() => import("@/components/ui/dropdown-menu").then(mod => ({ default: mod.DropdownMenuContent })));
const DropdownMenuItem = lazy(() => import("@/components/ui/dropdown-menu").then(mod => ({ default: mod.DropdownMenuItem })));
const DropdownMenuSeparator = lazy(() => import("@/components/ui/dropdown-menu").then(mod => ({ default: mod.DropdownMenuSeparator })));
const DropdownMenuTrigger = lazy(() => import("@/components/ui/dropdown-menu").then(mod => ({ default: mod.DropdownMenuTrigger })));

type UserRole = 'user' | 'manager' | 'admin';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
}

export function OptimizedNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;
  const userRole = user?.role;

  const profileLink = user?.id 
    ? user.role === 'manager' || user.role === 'admin' ? `/dashboard/${user.id}` : `/user/${user.id}`
    : '/login';

  const { logout } = useAuth(); // Use useAuth hook

  // Handle sign out
  const handleSignOutClick = async () => {
    try {
      await logout({ callbackUrl: '/' });
    } finally {
      setIsOpen(false);
    }
  };

  // Show skeleton while loading
  if (status === 'loading') {
    return <NavigationSkeleton />;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
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

            {status === 'authenticated' && user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Suspense fallback={
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                }>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            className="h-10 w-10 rounded-full object-cover"
                            loading="lazy"
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
                          <Link href={profileLink} className="w-full cursor-pointer">
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {userRole === 'user' && (
                        <DropdownMenuItem asChild>
                          <Link href={profileLink} className="w-full cursor-pointer">
                            Profile
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOutClick}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Suspense>
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
              onClick={() => setIsOpen(!isOpen)}
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
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/tours" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Tours & Experiences
              </Link>
              <Link 
                href="/gallery" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
            </div>

            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden mr-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                        loading="lazy"
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
                  <Link 
                    href={profileLink}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    {(userRole === 'manager' || userRole === 'admin') ? 'Dashboard' : 'Profile'}
                  </Link>
                  <button
                    onClick={handleSignOutClick}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
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
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/register" 
                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
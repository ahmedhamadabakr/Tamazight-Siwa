'use client';

import { useState, memo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import Image from "next/image";

type UserRole = 'user' | 'manager' | 'admin';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
}

// Preload critical routes
const preloadRoutes = ['/tours', '/gallery', '/about', '/login', '/register'];

export const FastNavigation = memo(function FastNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, status, update } = useSession();
  const { logout, subscribeToAuthChanges } = useAuth();
  const [localUser, setLocalUser] = useState<SessionUser | undefined>();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Keep local state in sync with session
  useEffect(() => {
    setLocalUser(session?.user as SessionUser | undefined);
  }, [session]);
  
  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(() => {
      // Force update the session when auth state changes
      update().then((updatedSession) => {
        // Clear local state if user is not authenticated
        if (!updatedSession) {
          setLocalUser(undefined);
        } else {
          setLocalUser(updatedSession.user as SessionUser | undefined);
        }
        // Close any open dropdowns
        setIsDropdownOpen(false);
        setIsOpen(false);
      });
    });
    
    return () => unsubscribe();
  }, [subscribeToAuthChanges, update]);
  
  const userRole = localUser?.role;

  const profileLink = localUser?.id 
    ? (localUser.role === 'manager' || localUser.role === 'admin') 
      ? `/dashboard/${localUser.id}` 
      : `/user/${localUser.id}`
    : '/login';

  // Preload routes on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      preloadRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    
    try {
      // Clear UI state immediately
      setLocalUser(undefined);
      setIsDropdownOpen(false);
      setIsOpen(false);
      
      // Clear all auth-related data from client storage
      if (typeof window !== 'undefined') {
        // Clear all auth-related data
        const authKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('next-auth.') || 
          key.startsWith('auth.') ||
          key.startsWith('token')
        );
        
        authKeys.forEach(key => localStorage.removeItem(key));
        sessionStorage.clear();
        
        // Clear any service worker caches that might contain auth data
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => caches.delete(cacheName));
          });
        }
      }
      
      // Perform the actual logout
      await logout({ 
        callbackUrl: '/',
        redirect: false // We'll handle the redirect manually
      });
      
      // Force a hard redirect with cache busting
      window.location.href = `/?logout=${Date.now()}`;
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect on error with cache busting
      window.location.href = `/?error=logout_failed&t=${Date.now()}`;
    }
  }, [isSigningOut, logout]);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Fast loading state  // Show skeleton while loading or signing out
  if (status === 'loading' || isSigningOut) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo - Always visible */}
            <Link href="/" className="flex items-center space-x-3">
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
                <Link href="/" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                  Home
                </Link>
                <Link href="/about" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                  About Us
                </Link>
                <Link href="/tours" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                  Tours
                </Link>
                <Link href="/gallery" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                  Gallery
                </Link>
              </div>

              {/* Loading skeleton */}
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors duration-200">Tamazight Siwa</span>
              <span className="text-xs text-gray-500 -mt-1">Authentic Experiences</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              <Link href="/" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                Home
              </Link>
              <Link href="/about" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                About Us
              </Link>
              <Link href="/tours" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                Tours
              </Link>
              <Link href="/gallery" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium">
                Gallery
              </Link>
            </div>

            {status === 'authenticated' && localUser ? (
              <div className="flex items-center space-x-4 ml-4">
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full p-0"
                    onClick={toggleDropdown}
                  >
                    {localUser.image ? (
                      <Image
                        src={localUser.image}
                        alt={localUser.name || 'User'}
                        className="h-10 w-10 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </Button>

                  {/* Custom dropdown for better performance */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{localUser.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{localUser.email || ''}</p>
                      </div>
                      
                      {(userRole === 'manager' || userRole === 'admin') && (
                        <Link 
                          href={profileLink} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      
                      {userRole === 'user' && (
                        <Link 
                          href={profileLink} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2 inline" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
          <div className="md:hidden py-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link 
                href="/tours" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Tours
              </Link>
              <Link 
                href="/gallery" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Gallery
              </Link>
            </div>

            {localUser ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden mr-3">
                    {localUser.image ? (
                      <Image
                        src={localUser.image}
                        alt={localUser.name || 'User'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{localUser.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{localUser.email || ''}</p>
                  </div>
                </div>
                <div className="px-2 space-y-1">
                  <Link 
                    href={profileLink}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                    onClick={closeMobileMenu}
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
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
});
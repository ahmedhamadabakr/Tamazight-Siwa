"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, User, LogOut, Settings, Shield } from "lucide-react";
import Image from "next/image";

type UserRole = "user" | "manager" | "admin";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
}

const NavigationComponent = memo(function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, status, update: updateSession } = useSession();
  const { logout, subscribeToAuthChanges } = useAuth();
  const pathname = usePathname();
  const [localUser, setLocalUser] = useState<SessionUser | null>(null);

  // Keep local user state in sync with session
  useEffect(() => {
    setLocalUser(session?.user as SessionUser | null);
  }, [session]);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(() => {
      // Force update the session when auth state changes
      updateSession();
      // Close any open dropdowns
      setIsOpen(false);
    });
    
    return () => unsubscribe();
  }, [subscribeToAuthChanges, updateSession]);

  const userRole = localUser?.role;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Tours & Experiences", href: "/tours" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact", href: "/contact" },
    ],
    []
  );

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    // Show loading state while checking auth status or during sign out
    if (status === 'loading' || isSigningOut) {
      setIsSigningOut(false);
    }
  }, [status, isSigningOut]);

  const profileLink = useMemo(() => {
    if (!localUser?.id) return '/login';
    return (userRole === 'manager' || userRole === 'admin') 
      ? `/dashboard/${localUser.id}` 
      : `/user/${localUser.id}`;
  }, [localUser?.id, userRole]);

  const isActive = useCallback(
    (href: string) => {
      if (!mounted) return false;
      return href === "/" ? pathname === href : pathname.startsWith(href);
    },
    [mounted, pathname]
  );

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    
    try {
      setIsOpen(false);
      await logout({ 
        callbackUrl: '/',
        redirect: true
      });
      
      // Reset local state
      setLocalUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect on error
      window.location.href = `/?error=logout_failed&t=${Date.now()}`;
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, logout]);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/98 backdrop-blur-lg border-b border-gray-200/80 shadow-lg"
      : "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
  }`;

  return (
    <nav className={navClasses} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" prefetch={false} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all">
              TS
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">
                Tamazight Siwa
              </span>
              <p className="text-xs text-gray-500 -mt-1">Authentic Experiences</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  className={`relative px-4 py-2 font-medium rounded-lg transition-all ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  {mounted && isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            {mounted && status === "authenticated" && localUser && !isSigningOut ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link href={profileLink} prefetch={false}>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 cursor-pointer">
                    <div className="relative">
                      {localUser.image ? (
                        <Image
                          src={localUser.image}
                          alt={localUser.name || "User"}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/30 transition-all"
                        />
                      ) : (
                        <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {localUser.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : mounted && status === "unauthenticated" ? (
              <div className="flex items-center space-x-3 ml-4">
                <Link href="/login" prefetch={false}>
                  <Button variant="ghost" className="text-gray-700 hover:text-primary hover:bg-gray-50">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" prefetch={false}>
                  <Button className="bg-primary hover:bg-primary/90 text-white">Sign up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-gray-700 hover:bg-gray-100"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mounted && isOpen && (
          <div className="md:hidden py-2 space-y-2 animate-fadeIn">
            <div className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {localUser && !isSigningOut ? (
              <>
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    {localUser.image ? (
                      <Image
                        src={localUser.image}
                        alt={localUser.name || "User"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{localUser.name || "User"}</p>
                      <p className="text-sm text-gray-600">{localUser.email || ""}</p>
                    </div>
                  </div>
                </div>

                <div className="px-2 space-y-2 border-t border-gray-200 pt-3">
                  {(userRole === "manager" || userRole === "admin" || userRole === "user") && (
                    <Link
                      href={profileLink}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100"
                    >
                      <Settings className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">
                      Dashboard
                      </span>
                    </Link>
                  )}

                  {userRole === "admin" && (
                    <Link
                      href="/admin/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100"
                    >
                      <Shield className="w-5 h-5 text-emerald-600 mr-3" />
                      <span className="font-medium text-gray-900">System Settings</span>
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex w-full items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 space-y-2 border-t border-gray-200 pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Sign up
                </Link>
              </div>
            )}

            <div className="px-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <Phone className="w-4 h-4 mr-2" />+201552624123
              </div>
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                Book Your Trip
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

export { NavigationComponent as Navigation };

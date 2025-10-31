'use client';

import { useSession, signOut as nextAuthSignOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';

// Create an event emitter for auth state changes
const authEventEmitter = {
  listeners: new Set<() => void>(),
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  emit() {
    this.listeners.forEach(callback => callback());
  },
} as const;

interface LogoutOptions {
  redirect?: boolean;
  callbackUrl?: string;
  allDevices?: boolean;
}

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: (options?: LogoutOptions) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  subscribeToAuthChanges: (callback: () => void) => () => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user as AuthUser | null;
  const isLoading = status === 'loading' || isLoggingOut;
  const isAuthenticated = status === 'authenticated' && !!user;

  // Auto-refresh session every 14 minutes (before 15-minute expiry)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, update]);

  const logout = useCallback(async (options: LogoutOptions = {}) => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    const { redirect = true, callbackUrl = '/', allDevices = false } = options;
    
    try {
      // First, clear any sensitive data from client-side storage
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

      // Emit logout event before starting the sign-out process
      authEventEmitter.emit();

      // Sign out from NextAuth
      await nextAuthSignOut({
        redirect: false,
        callbackUrl: allDevices ? `${callbackUrl}?signout=all` : callbackUrl
      });

      // If logging out from all devices, call the logout-all endpoint
      if (allDevices) {
        try {
          await fetch('/api/auth/logout-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout all devices error:', error);
          // Continue with normal logout even if this fails
        }
      }

      // Force a hard redirect to ensure all state is cleared
      if (typeof window !== 'undefined') {
        // Clear any remaining auth data
        document.cookie.split(';').forEach(c => {
          document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
        });
        
        // Use a full page reload to ensure all state is reset
        setTimeout(() => {
          window.location.href = allDevices 
            ? `${callbackUrl}?signout=all&t=${Date.now()}` 
            : `${callbackUrl}?t=${Date.now()}`;
        }, 100);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to home page with a cache-busting parameter
      if (typeof window !== 'undefined') {
        window.location.href = `${callbackUrl}?error=logout_failed&t=${Date.now()}`;
      }
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  const refreshSession = useCallback(async () => {
    try {
      await update();
    } catch (error) {
      console.error('Failed to refresh session:', error);
      throw error;
    }
  }, [update]);

  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user?.role) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user?.role]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.role) return false;

    // Define role hierarchy and permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'], // Admin has all permissions
      manager: [
        'view_dashboard',
        'manage_bookings',
        'view_users',
        'manage_tours',
        'view_analytics',
      ],
      user: [
        'view_profile',
        'make_booking',
        'view_bookings',
        'update_profile',
      ],
    };

    const userPermissions = rolePermissions[user.role] || [];
    
    // Admin has all permissions
    if (userPermissions.includes('*')) return true;
    
    return userPermissions.includes(permission);
  }, [user?.role]);

  const subscribeToAuthChanges = useCallback((callback: () => void) => {
    const unsubscribe = authEventEmitter.subscribe(callback);
    return unsubscribe;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshSession,
    hasRole,
    hasPermission,
    subscribeToAuthChanges,
  };
}
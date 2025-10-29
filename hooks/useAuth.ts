'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

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
    
    try {
      const { redirect = true, callbackUrl = '/', allDevices = false } = options;

      // Call our custom logout API
      const endpoint = allDevices ? '/api/auth/logout-all' : '/api/auth/logout';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Logout API failed:', await response.text());
      }

      // Sign out from NextAuth
      await signOut({
        redirect,
        callbackUrl,
      });

      // Force a hard refresh to clear any cached data
      if (typeof window !== 'undefined') {
        window.location.href = callbackUrl;
      }

    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback: still try to sign out from NextAuth
      try {
        await signOut({
          redirect: options.redirect !== false,
          callbackUrl: options.callbackUrl || '/',
        });
      } catch (fallbackError) {
        console.error('Fallback logout error:', fallbackError);
        // Last resort: redirect manually
        if (typeof window !== 'undefined') {
          window.location.href = options.callbackUrl || '/';
        }
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

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshSession,
    hasRole,
    hasPermission,
  };
}
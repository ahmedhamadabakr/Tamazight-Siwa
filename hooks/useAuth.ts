'use client';

import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  fullName?: string | null;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: (options?: { redirect?: boolean; callbackUrl?: string; allDevices?: boolean }) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  subscribeToAuthChanges: (callback: () => void) => () => void;
}

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  admin: ['admin', 'manager', 'user'],
  manager: ['manager', 'user'],
  user: ['user'],
};

// Permission mapping
const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_tours',
    'manage_bookings',
    'view_analytics',
    'manage_settings',
    'view_security_logs',
  ],
  manager: [
    'manage_tours',
    'manage_bookings',
    'view_analytics',
  ],
  user: [
    'view_tours',
    'create_booking',
    'view_own_bookings',
  ],
};

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [authChangeCallbacks, setAuthChangeCallbacks] = useState<(() => void)[]>([]);

  const user: AuthUser | null = useMemo(() => {
    if (!session?.user) return null;
    
    return {
      id: (session.user as any).id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: (session.user as any).role,
      fullName: (session.user as any).fullName,
    };
  }, [session?.user]);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // Notify subscribers when auth state changes
  useEffect(() => {
    authChangeCallbacks.forEach(callback => callback());
  }, [isAuthenticated, user?.id]); // إزالة authChangeCallbacks من dependencies

  const logout = useCallback(async (options?: { 
    redirect?: boolean; 
    callbackUrl?: string; 
    allDevices?: boolean 
  }) => {
    try {
      if (options?.allDevices) {
        // Call logout-all API endpoint
        await fetch('/api/auth/logout-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (options?.redirect === false) {
        await signOut({ redirect: false });
      } else {
        await signOut({ 
          callbackUrl: options?.callbackUrl || '/login',
        });
      }

      // If not redirecting, manually navigate
      if (options?.redirect === false) {
        router.push(options?.callbackUrl || '/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force redirect to login
      router.push('/login');
    }
  }, [router]);

  const refreshSession = useCallback(async () => {
    try {
      await update();
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }, [update]);

  const hasRole = useCallback((role: string | string[]) => {
    if (!user?.role) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    const userRole = user.role as keyof typeof ROLE_HIERARCHY;
    const allowedRoles = ROLE_HIERARCHY[userRole] || [];
    
    return roles.some(r => allowedRoles.includes(r));
  }, [user?.role]);

  const hasPermission = useCallback((permission: string) => {
    if (!user?.role) return false;
    
    const userRole = user.role as keyof typeof ROLE_PERMISSIONS;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    
    return permissions.includes(permission);
  }, [user?.role]);

  const subscribeToAuthChanges = useCallback((callback: () => void) => {
    setAuthChangeCallbacks(prev => [...prev, callback]);
    
    // Return unsubscribe function
    return () => {
      setAuthChangeCallbacks(prev => prev.filter(cb => cb !== callback));
    };
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
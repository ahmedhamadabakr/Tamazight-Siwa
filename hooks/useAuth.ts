'use client';

import { useCallback } from 'react';

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
  logout: (options?: { redirect?: boolean; callbackUrl?: string; allDevices?: boolean }) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  subscribeToAuthChanges: (callback: () => void) => () => void;
}

export function useAuth(): UseAuthReturn {
  const user: AuthUser = {
    id: 'public-user',
    name: 'Public User',
    email: null,
    image: null,
    role: 'admin',
  };

  const isLoading = false;
  const isAuthenticated = true;

  const logout = useCallback(async () => {
    // no-op
    return;
  }, []);

  const refreshSession = useCallback(async () => {
    // no-op
    return;
  }, []);

  const hasRole = useCallback((role: string | string[]) => {
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes('admin');
  }, []);

  const hasPermission = useCallback((_permission: string) => {
    return true;
  }, []);

  const subscribeToAuthChanges = useCallback((callback: () => void) => {
    // Immediately return unsubscribe no-op; no auth events
    return () => {};
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
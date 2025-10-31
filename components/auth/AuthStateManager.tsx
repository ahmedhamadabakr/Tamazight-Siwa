'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function AuthStateManager() {
  const { subscribeToAuthChanges, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This will be called whenever the auth state changes
    const handleAuthChange = () => {
      // Force a re-render of all components that depend on auth state
      router.refresh();
    };

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges(handleAuthChange);
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [router, subscribeToAuthChanges]);

  return null;
}

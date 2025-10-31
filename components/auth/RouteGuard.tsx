'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallbackUrl?: string;
  showLoading?: boolean;
}

interface RoleBasedComponentProps {
  children: ReactNode;
  allowedRoles: string | string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallbackUrl = '/login',
  showLoading = true 
}: ProtectedRouteProps) {
  const { status } = useSession();
  const { user, isLoading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || status === 'loading') return;

    // Not authenticated
    if (!user) {
      const currentUrl = window.location.pathname + window.location.search;
      const loginUrl = `${fallbackUrl}?callbackUrl=${encodeURIComponent(currentUrl)}`;
      router.replace(loginUrl);
      return;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      router.replace('/unauthorized');
      return;
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.replace('/unauthorized');
      return;
    }
  }, [user, isLoading, status, requiredRole, requiredPermission, hasRole, hasPermission, router, fallbackUrl]);

  // Show loading state
  if (isLoading || status === 'loading') {
    if (!showLoading) return null;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Check authorization
  if (requiredRole && !hasRole(requiredRole)) {
    return null; // Will redirect in useEffect
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'manager']}>
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'manager', 'user']}>
      {children}
    </ProtectedRoute>
  );
}

export function RoleBasedComponent({ children, allowedRoles, fallback = null }: RoleBasedComponentProps) {
  const { hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function PermissionBasedComponent({ 
  children, 
  requiredPermission, 
  fallback = null 
}: { 
  children: ReactNode; 
  requiredPermission: string; 
  fallback?: ReactNode; 
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallbackUrl?: string;
  showLoading?: boolean;
}

export function RouteGuard({
  children,
  requiredRole,
  requiredPermission,
  fallbackUrl = '/login',
  showLoading = true,
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check authentication
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = `${fallbackUrl}?callbackUrl=${encodeURIComponent(currentPath)}`;
      router.replace(loginUrl);
      return;
    }

    // Check role requirements
    if (requiredRole && !hasRole(requiredRole)) {
      router.replace('/unauthorized');
      return;
    }

    // Check permission requirements
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.replace('/unauthorized');
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requiredRole,
    requiredPermission,
    hasRole,
    hasPermission,
    router,
    fallbackUrl,
  ]);

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or authorized
  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requiredRole="admin">
      {children}
    </RouteGuard>
  );
}

export function ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requiredRole={['manager', 'admin']}>
      {children}
    </RouteGuard>
  );
}

export function UserRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requiredRole={['user', 'manager', 'admin']}>
      {children}
    </RouteGuard>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      {children}
    </RouteGuard>
  );
}
'use client';

import React, { ComponentType, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Role hierarchy - higher number means higher privilege
export const ROLE_HIERARCHY = {
  user: 1,
  manager: 2,
  admin: 3
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

export const UserRole = {
  USER: 'user' as const,
  MANAGER: 'manager' as const,
  ADMIN: 'admin' as const
};

interface WithAuthOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  loadingComponent?: ComponentType;
  unauthorizedComponent?: ComponentType<{ requiredRole: UserRole; currentRole?: UserRole }>;
  allowedRoles?: UserRole[];
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Default unauthorized component
const DefaultUnauthorizedComponent: React.FC<{ requiredRole: UserRole; currentRole?: UserRole }> = ({ 
  requiredRole, 
  currentRole 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="text-red-500 mb-4">
        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">
        You need <span className="font-medium text-red-600">{requiredRole}</span> role to access this page.
        {currentRole && (
          <span className="block mt-1">
            Your current role: <span className="font-medium">{currentRole}</span>
          </span>
        )}
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

/**
 * Check if user has required role or higher
 */
function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Check if user role is in allowed roles list
 */
function isRoleAllowed(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Higher-Order Component for authentication and authorization
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requiredRole = 'user',
    redirectTo = '/login',
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
    unauthorizedComponent: UnauthorizedComponent = DefaultUnauthorizedComponent,
    allowedRoles,
  } = options;

  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      if (status === 'loading') {
        return; // Still loading
      }

      if (status === 'unauthenticated') {
        // Not authenticated, redirect to login
        const currentPath = window.location.pathname;
        const loginUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        return;
      }

      if (status === 'authenticated' && session?.user) {
        const user = session.user as AuthUser;
        const userRole = user.role || 'user';

        // Check authorization
        let authorized = false;

        if (allowedRoles) {
          // Use specific allowed roles list
          authorized = isRoleAllowed(userRole, allowedRoles);
        } else {
          // Use role hierarchy
          authorized = hasRequiredRole(userRole, requiredRole);
        }

        setIsAuthorized(authorized);
      }
    }, [session, status, router]);

    // Show loading while checking authentication
    if (status === 'loading' || isAuthorized === null) {
      return <LoadingComponent />;
    }

    // Show unauthorized if user doesn't have required permissions
    if (!isAuthorized) {
      const currentRole = (session?.user as AuthUser)?.role;
      return <UnauthorizedComponent requiredRole={requiredRole} currentRole={currentRole} />;
    }

    // User is authenticated and authorized
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

/**
 * Hook to check if current user has specific role
 */
export function useRole(): {
  role: UserRole | null;
  hasRole: (requiredRole: UserRole) => boolean;
  isRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isUser: boolean;
} {
  const { data: session } = useSession();
  const userRole = (session?.user as AuthUser)?.role || null;

  return {
    role: userRole,
    hasRole: (requiredRole: UserRole) => {
      if (!userRole) return false;
      return hasRequiredRole(userRole, requiredRole);
    },
    isRole: (role: UserRole) => userRole === role,
    isAdmin: userRole === 'admin',
    isManager: userRole === 'manager' || userRole === 'admin',
    isUser: !!userRole,
  };
}

/**
 * Hook to check permissions
 */
export function usePermissions() {
  const { role, hasRole, isRole } = useRole();
  const { data: session, status } = useSession();

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user as AuthUser | null,
    role,
    hasRole,
    isRole,
    canAccess: (requiredRole: UserRole, allowedRoles?: UserRole[]) => {
      if (!role) return false;
      
      if (allowedRoles) {
        return isRoleAllowed(role, allowedRoles);
      }
      
      return hasRequiredRole(role, requiredRole);
    },
  };
}

// Convenience HOCs for specific roles
export const withAdminAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { requiredRole: 'admin' });

export const withManagerAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { requiredRole: 'manager' });

export const withUserAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { requiredRole: 'user' });

// Component-level permission checker
export const ProtectedComponent: React.FC<{
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ requiredRole = 'user', allowedRoles, fallback = null, children }) => {
  const { canAccess } = usePermissions();

  if (!canAccess(requiredRole, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
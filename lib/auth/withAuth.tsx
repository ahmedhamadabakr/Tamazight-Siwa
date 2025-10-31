'use client';

import React, { ComponentType } from 'react';

export type UserRole = 'user' | 'manager' | 'admin';

export const UserRole = {
  USER: 'user' as const,
  MANAGER: 'manager' as const,
  ADMIN: 'admin' as const,
};

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const Noop: React.FC<P> = (props) => <WrappedComponent {...props} />;
  Noop.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  return Noop;
}

export const withAdminAuth = withAuth;
export const withManagerAuth = withAuth;
export const withUserAuth = withAuth;

export function useRole() {
  return {
    role: 'admin' as UserRole,
    hasRole: () => true,
    isRole: () => true,
    isAdmin: true,
    isManager: true,
    isUser: true,
  };
}

export function usePermissions() {
  return {
    isAuthenticated: true,
    isLoading: false,
    user: { id: 'public-user', role: 'admin' as UserRole } as any,
    role: 'admin' as UserRole,
    hasRole: () => true,
    isRole: () => true,
    canAccess: () => true,
  };
}

export const ProtectedComponent: React.FC<{
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};
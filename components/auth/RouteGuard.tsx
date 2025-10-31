'use client';

import { ReactNode } from 'react';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallbackUrl?: string;
  showLoading?: boolean;
}

export function RouteGuard({ children }: RouteGuardProps) {
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ManagerRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function UserRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
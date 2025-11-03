// Authentication and Authorization utilities
export * from './withAuth';
export * from './permissions';

// Re-export commonly used components and hooks


// Convenience exports
export {
  withAuth,
  withAdminAuth,
  withManagerAuth,
  withUserAuth,
  useRole,
  usePermissions,
  ProtectedComponent,
} from './withAuth';

export {
  UserRole,
  Permission,
  hasRoleHierarchy,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getRolePermissions,
  canAccessResource,
  checkServerPermission,
  createPermissionMiddleware,
  requireAuth,
  RouteProtection,
  UIPermissions,
} from './permissions';

export type { AuthUser } from './permissions';
// Permissive no-op authorization utilities

export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export enum Permission {
  ANY = 'any',
}

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  image?: string;
}

export function hasRoleHierarchy(_userRole: UserRole, _requiredRole: UserRole): boolean {
  return true;
}

export function hasPermission(_userRole: UserRole, _permission: Permission): boolean {
  return true;
}

export function hasAllPermissions(_userRole: UserRole, _permissions: Permission[]): boolean {
  return true;
}

export function hasAnyPermission(_userRole: UserRole, _permissions: Permission[]): boolean {
  return true;
}

export function getRolePermissions(_role: UserRole): Permission[] {
  return [Permission.ANY];
}

export function canAccessResource(
  _userRole: UserRole,
  _userId: string,
  _resourceOwnerId: string,
  _requiredPermission?: Permission
): boolean {
  return true;
}

export async function checkServerPermission(
  _requiredRole?: UserRole,
  _requiredPermission?: Permission,
  _allowedRoles?: UserRole[]
): Promise<{
  authorized: boolean;
  user: AuthUser | null;
  error?: string;
}> {
  return {
    authorized: true,
    user: {
      id: 'public-user',
      role: UserRole.ADMIN,
      name: 'Public User',
    },
  };
}

export function createPermissionMiddleware(
  _requiredRole?: UserRole,
  _requiredPermission?: Permission,
  _allowedRoles?: UserRole[]
) {
  return async function permissionMiddleware() {
    return { id: 'public-user', role: UserRole.ADMIN } as AuthUser;
  };
}

export function requireAuth(
  _requiredRole?: UserRole,
  _requiredPermission?: Permission,
  _allowedRoles?: UserRole[]
) {
  return function decorator(
    _target: any,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      args.push({ user: { id: 'public-user', role: UserRole.ADMIN } as AuthUser });
      return method.apply(this, args);
    };
    return descriptor;
  };
}

export const RouteProtection = {
  adminOnly: () => createPermissionMiddleware(UserRole.ADMIN),
  managerOrAdmin: () => createPermissionMiddleware(UserRole.MANAGER),
  authenticated: () => createPermissionMiddleware(UserRole.USER),
  withPermission: (_permission: Permission) => createPermissionMiddleware(),
  withRoles: (_allowedRoles: UserRole[]) => createPermissionMiddleware(),
};

export const UIPermissions = {
  canViewAdminPanel: (_role: UserRole) => true,
  canViewManagerPanel: (_role: UserRole) => true,
  canManageUsers: (_role: UserRole) => true,
  canManageBookings: (_role: UserRole) => true,
  canViewReports: (_role: UserRole) => true,
  canManageSystem: (_role: UserRole) => true,
};
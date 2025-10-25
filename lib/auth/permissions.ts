import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/lib/auth';

// Define user roles and their hierarchy
export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

// Role hierarchy - higher number means higher privilege
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.MANAGER]: 2,
  [UserRole.ADMIN]: 3,
};

// Define permissions for different actions
export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  VIEW_BOOKINGS = 'view_bookings',
  CREATE_BOOKING = 'create_booking',
  CANCEL_BOOKING = 'cancel_booking',
  
  // Manager permissions
  VIEW_ALL_BOOKINGS = 'view_all_bookings',
  MANAGE_BOOKINGS = 'manage_bookings',
  VIEW_USERS = 'view_users',
  MANAGE_TOURS = 'manage_tours',
  VIEW_REPORTS = 'view_reports',
  
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  DELETE_USERS = 'delete_users',
  MANAGE_SYSTEM = 'manage_system',
  VIEW_SECURITY_LOGS = 'view_security_logs',
  MANAGE_ROLES = 'manage_roles',
}

// Define base permissions for each role
const USER_PERMISSIONS = [
  Permission.VIEW_PROFILE,
  Permission.EDIT_PROFILE,
  Permission.VIEW_BOOKINGS,
  Permission.CREATE_BOOKING,
  Permission.CANCEL_BOOKING,
];

const MANAGER_PERMISSIONS = [
  ...USER_PERMISSIONS,
  Permission.VIEW_ALL_BOOKINGS,
  Permission.MANAGE_BOOKINGS,
  Permission.VIEW_USERS,
  Permission.MANAGE_TOURS,
  Permission.VIEW_REPORTS,
];

const ADMIN_PERMISSIONS = [
  ...MANAGER_PERMISSIONS,
  Permission.MANAGE_USERS,
  Permission.DELETE_USERS,
  Permission.MANAGE_SYSTEM,
  Permission.VIEW_SECURITY_LOGS,
  Permission.MANAGE_ROLES,
];

// Map roles to their permissions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: USER_PERMISSIONS,
  [UserRole.MANAGER]: MANAGER_PERMISSIONS,
  [UserRole.ADMIN]: ADMIN_PERMISSIONS,
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

/**
 * Check if a role has higher or equal privilege than required role
 */
export function hasRoleHierarchy(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if user has multiple permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if user can access a resource based on ownership
 */
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId: string,
  requiredPermission?: Permission
): boolean {
  // Admin can access everything
  if (userRole === UserRole.ADMIN) {
    return true;
  }

  // Check if user owns the resource
  if (userId === resourceOwnerId) {
    return true;
  }

  // Check if user has specific permission for others' resources
  if (requiredPermission && hasPermission(userRole, requiredPermission)) {
    return true;
  }

  return false;
}

/**
 * Server-side permission checker
 */
export async function checkServerPermission(
  requiredRole?: UserRole,
  requiredPermission?: Permission,
  allowedRoles?: UserRole[]
): Promise<{
  authorized: boolean;
  user: AuthUser | null;
  error?: string;
}> {
  try {
    const session = await getServerSession(await getAuthOptions());

    if (!session?.user) {
      return {
        authorized: false,
        user: null,
        error: 'Not authenticated',
      };
    }

    const user = session.user as AuthUser;
    const userRole = user.role || UserRole.USER;

    // Check specific allowed roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return {
        authorized: false,
        user,
        error: `Role ${userRole} not in allowed roles: ${allowedRoles.join(', ')}`,
      };
    }

    // Check role hierarchy
    if (requiredRole && !hasRoleHierarchy(userRole, requiredRole)) {
      return {
        authorized: false,
        user,
        error: `Insufficient role. Required: ${requiredRole}, Current: ${userRole}`,
      };
    }

    // Check specific permission
    if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
      return {
        authorized: false,
        user,
        error: `Missing permission: ${requiredPermission}`,
      };
    }

    return {
      authorized: true,
      user,
    };
  } catch (error) {
    return {
      authorized: false,
      user: null,
      error: 'Permission check failed',
    };
  }
}

/**
 * Middleware helper for API routes
 */
export function createPermissionMiddleware(
  requiredRole?: UserRole,
  requiredPermission?: Permission,
  allowedRoles?: UserRole[]
) {
  return async function permissionMiddleware() {
    const result = await checkServerPermission(requiredRole, requiredPermission, allowedRoles);
    
    if (!result.authorized) {
      throw new Error(result.error || 'Unauthorized');
    }
    
    return result.user;
  };
}

/**
 * Decorator for API route handlers
 */
export function requireAuth(
  requiredRole?: UserRole,
  requiredPermission?: Permission,
  allowedRoles?: UserRole[]
) {
  return function decorator(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await checkServerPermission(requiredRole, requiredPermission, allowedRoles);
      
      if (!result.authorized) {
        return Response.json(
          {
            success: false,
            error: {
              code: 'INSUFFICIENT_PERMISSIONS',
              message: result.error || 'Unauthorized access',
            },
          },
          { status: 403 }
        );
      }

      // Add user to the context
      args.push({ user: result.user });
      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Route protection utilities
 */
export const RouteProtection = {
  // Admin only routes
  adminOnly: () => createPermissionMiddleware(UserRole.ADMIN),
  
  // Manager or admin routes
  managerOrAdmin: () => createPermissionMiddleware(UserRole.MANAGER),
  
  // Any authenticated user
  authenticated: () => createPermissionMiddleware(UserRole.USER),
  
  // Specific permissions
  withPermission: (permission: Permission) => 
    createPermissionMiddleware(undefined, permission),
  
  // Custom role check
  withRoles: (allowedRoles: UserRole[]) => 
    createPermissionMiddleware(undefined, undefined, allowedRoles),
};

/**
 * Permission checking for UI components
 */
export const UIPermissions = {
  canViewAdminPanel: (role: UserRole) => hasRoleHierarchy(role, UserRole.ADMIN),
  canViewManagerPanel: (role: UserRole) => hasRoleHierarchy(role, UserRole.MANAGER),
  canManageUsers: (role: UserRole) => hasPermission(role, Permission.MANAGE_USERS),
  canManageBookings: (role: UserRole) => hasPermission(role, Permission.MANAGE_BOOKINGS),
  canViewReports: (role: UserRole) => hasPermission(role, Permission.VIEW_REPORTS),
  canManageSystem: (role: UserRole) => hasPermission(role, Permission.MANAGE_SYSTEM),
};
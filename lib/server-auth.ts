import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

/**
 * Get server session with proper auth options
 * Use this instead of importing getServerSession directly
 */
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user is authenticated on server side
 */
export async function isAuthenticated() {
  const session = await getServerAuthSession();
  return !!session?.user;
}

/**
 * Check if user has required role on server side
 */
export async function hasServerRole(requiredRole: string | string[]) {
  const session = await getServerAuthSession();
  if (!session?.user) return false;
  
  const userRole = (session.user as any).role;
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // Role hierarchy
  const roleHierarchy: Record<string, string[]> = {
    admin: ['admin', 'manager', 'user'],
    manager: ['manager', 'user'],
    user: ['user'],
  };
  
  const allowedRoles = roleHierarchy[userRole] || [];
  return roles.some(role => allowedRoles.includes(role));
}

/**
 * Get current user from server session
 */
export async function getCurrentUser() {
  const session = await getServerAuthSession();
  return session?.user || null;
}
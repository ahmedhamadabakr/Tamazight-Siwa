/**
 * Security constants and configurations
 */

// Event types for security logging
export const SECURITY_EVENT_TYPES = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SESSION_TERMINATED: 'SESSION_TERMINATED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
} as const;

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  admin: ['admin', 'manager', 'user'],
  manager: ['manager', 'user'],
  user: ['user'],
} as const;

// Permission definitions
export const PERMISSIONS = {
  // User permissions
  VIEW_PROFILE: 'view_profile',
  UPDATE_PROFILE: 'update_profile',
  MAKE_BOOKING: 'make_booking',
  VIEW_BOOKINGS: 'view_bookings',
  CANCEL_BOOKING: 'cancel_booking',
  
  // Manager permissions
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_BOOKINGS: 'manage_bookings',
  VIEW_USERS: 'view_users',
  MANAGE_TOURS: 'manage_tours',
  VIEW_ANALYTICS: 'view_analytics',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_SECURITY_LOGS: 'view_security_logs',
  MANAGE_SYSTEM: 'manage_system',
  ACCESS_ADMIN_PANEL: 'access_admin_panel',
} as const;

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  admin: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],
  manager: [
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_TOURS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MAKE_BOOKING,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKING,
  ],
  user: [
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.MAKE_BOOKING,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKING,
  ],
} as const;

// Security thresholds
export const SECURITY_THRESHOLDS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 10 * 60 * 1000, // 10 minutes
  MAX_SESSIONS_PER_USER: 10,
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
  MAX_SECURITY_EVENTS_PER_USER: 1000,
  SECURITY_EVENT_RETENTION_DAYS: 90,
} as const;

// HTTP status codes for security responses
export const SECURITY_HTTP_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
  ACCOUNT_LOCKED: 423,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Cookie names
export const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken',
  SESSION_TOKEN: 'next-auth.session-token',
  CSRF_TOKEN: 'next-auth.csrf-token',
  CALLBACK_URL: 'next-auth.callback-url',
} as const;

// Security headers
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

// Rate limiting windows (in milliseconds)
export const RATE_LIMIT_WINDOWS = {
  LOGIN_ATTEMPTS: 15 * 60 * 1000, // 15 minutes
  TOKEN_REFRESH: 60 * 1000, // 1 minute
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  EMAIL_VERIFICATION: 5 * 60 * 1000, // 5 minutes
} as const;

// Default redirect URLs
export const DEFAULT_REDIRECTS = {
  LOGIN: '/login',
  LOGOUT: '/',
  UNAUTHORIZED: '/unauthorized',
  ADMIN_DASHBOARD: '/admin/dashboard',
  MANAGER_DASHBOARD: '/dashboard',
  USER_DASHBOARD: '/user',
} as const;
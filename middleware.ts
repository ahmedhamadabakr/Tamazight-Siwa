import { NextRequest, NextResponse } from 'next/server';



// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/tours',
  '/gallery',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-code',
  '/verify-token',
  '/unauthorized',
  '/test-auth',
  '/api/auth',
  // Static app assets that must remain public
  '/manifest.json',
  '/site.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
  '/apple-touch-icon.png',
  '/favicon-16.png',
  '/favicon-32.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.svg',
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

function getRequiredRole(pathname: string): string | null {
  // Admin routes that require admin role only
  if (pathname.startsWith('/admin/settings')) return 'admin';

  // Admin routes that allow manager access
  if (pathname.startsWith('/admin/bookings') || pathname.startsWith('/admin/dashboard')) return 'manager';

  // Other admin routes require admin role
  if (pathname.startsWith('/admin')) return 'admin';

  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') return 'manager';
  if (pathname.startsWith('/user')) return 'user';
  if (pathname === '/dashboard' || pathname === '/security') return 'user'; // Any authenticated user
  return null;
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, string[]> = {
    admin: ['admin', 'manager', 'user'],
    manager: ['manager', 'user'],
    user: ['user'],
  };

  return roleHierarchy[userRole]?.includes(requiredRole) || false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https: res.cloudinary.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live wss://ws.pusherapp.com https://fonts.googleapis.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // With database sessions, auth checks should be performed in server components/route handlers
  // using getServerSession(). Middleware remains for security headers and public asset handling.

  return response;
}

export const config = {
  matcher: [
    // Exclude Next.js internals and common static assets from middleware
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|site.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)',
  ],
};
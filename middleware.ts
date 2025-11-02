import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';



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

  // Get secret from environment
  const secret = process.env.NEXTAUTH_SECRET;

  // Retrieve token (let NextAuth detect cookie name automatically)
  const token = await getToken({
    req: request,
    secret,
  });



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
    "connect-src 'self' https://vercel.live wss://ws.pusherapp.com",
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

  // Skip auth checks for public routes
  if (isPublicRoute(pathname)) {
    return response;
  }

  // Check if route requires authentication
  const requiredRole = getRequiredRole(pathname);

  if (requiredRole && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const callbackUrl = `${pathname}${request.nextUrl.search || ''}`;
    url.searchParams.set('callbackUrl', callbackUrl);
    url.searchParams.set('error', 'authentication_required');
    return NextResponse.redirect(url);
  }

  if (requiredRole && token) {
    const userRole = token.role as string;
    console.log('Middleware - Checking role:', { userRole, requiredRole, hasAccess: hasRequiredRole(userRole, requiredRole) });

    if (!hasRequiredRole(userRole, requiredRole)) {
      console.log('Middleware - Access denied, redirecting to unauthorized');
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      url.searchParams.set('required', requiredRole);
      url.searchParams.set('current', userRole);
      return NextResponse.redirect(url);
    }

    console.log('Middleware - Access granted for:', pathname);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
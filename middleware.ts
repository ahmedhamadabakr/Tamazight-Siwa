import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { verifyAccessToken } from '@/lib/security/tokens';

// Define route patterns and their required roles
const ROUTE_PERMISSIONS = {
    // Admin routes - require admin role
    admin: {
        patterns: ['/admin', '/dashboard/admin'],
        requiredRole: 'admin',
        allowedRoles: ['admin']
    },

    // Manager routes - require manager or admin role
    manager: {
        patterns: ['/dashboard/manager', '/api/admin'],
        requiredRole: 'manager',
        allowedRoles: ['manager', 'admin']
    },

    // Protected user routes - require any authenticated user
    protected: {
        patterns: ['/dashboard', '/profile', '/bookings', '/api/bookings', '/api/users/me'],
        requiredRole: 'user',
        allowedRoles: ['user', 'manager', 'admin']
    },

    // API routes that need authentication
    apiProtected: {
        patterns: ['/api/auth/refresh', '/api/auth/logout'],
        requiredRole: 'user',
        allowedRoles: ['user', 'manager', 'admin']
    }
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
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
    '/api/register',
    '/api/auth/login',
    '/api/auth/verify-email',
    '/api/tours',
    '/api/gallery',
    '/api/reviews',
    '/_next',
    '/favicon.ico'
];

/**
 * Check if a route matches any of the given patterns
 */
function matchesPattern(pathname: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
        if (pattern.endsWith('*')) {
            return pathname.startsWith(pattern.slice(0, -1));
        }
        return pathname === pattern || pathname.startsWith(pattern + '/');
    });
}

/**
 * Check if user role has permission for the route
 */
function hasPermission(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    if (cfConnectingIP) {
        return cfConnectingIP;
    }

    return '127.0.0.1';
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const clientIP = getClientIP(request);

    // Skip middleware for public routes and static files
    if (PUBLIC_ROUTES.some(route =>
        pathname === route ||
        pathname.startsWith(route + '/') ||
        pathname.startsWith('/_next/') ||
        pathname.includes('.')
    )) {
        return NextResponse.next();
    }

    try {
        // Get session token from NextAuth
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        // Check if route requires authentication
        let requiredPermission = null;
        for (const [key, config] of Object.entries(ROUTE_PERMISSIONS)) {
            if (matchesPattern(pathname, config.patterns)) {
                requiredPermission = config;
                break;
            }
        }

        // If no specific permission required, allow access
        if (!requiredPermission) {
            return NextResponse.next();
        }

        // If authentication required but no token, redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            loginUrl.searchParams.set('error', 'authentication_required');

            return NextResponse.redirect(loginUrl);
        }

        // Validate token expiry and refresh if needed
        const now = Math.floor(Date.now() / 1000);
        if (token.exp && typeof token.exp === 'number' && token.exp < now) {
            // Token is expired, redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            loginUrl.searchParams.set('error', 'session_expired');

            return NextResponse.redirect(loginUrl);
        }

        // Check if user role has permission
        const userRole = token.role as string || 'user';
        if (!hasPermission(userRole, requiredPermission.allowedRoles)) {
            // For API routes, return 403
            if (pathname.startsWith('/api/')) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'INSUFFICIENT_PERMISSIONS',
                            message: 'You do not have permission to access this resource'
                        }
                    },
                    { status: 403 }
                );
            }

            // For web routes, redirect to unauthorized page
            const unauthorizedUrl = new URL('/unauthorized', request.url);
            unauthorizedUrl.searchParams.set('required', requiredPermission.requiredRole);
            unauthorizedUrl.searchParams.set('current', userRole);

            return NextResponse.redirect(unauthorizedUrl);
        }

        // Add security headers to response
        const response = NextResponse.next();

        // Security headers
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('X-XSS-Protection', '1; mode=block');

        // Content Security Policy
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

        // HSTS header for production
        if (process.env.NODE_ENV === 'production') {
            response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Add user info to headers for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            response.headers.set('X-User-Role', userRole);
            response.headers.set('X-User-ID', token.sub || '');
        }

        return response;

    } catch (error) {
        console.error('Middleware error:', error);

        // For API routes, return error response
        if (pathname.startsWith('/api/')) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'MIDDLEWARE_ERROR',
                        message: 'Authentication middleware error'
                    }
                },
                { status: 500 }
            );
        }

        // For web routes, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'middleware_error');
        return NextResponse.redirect(loginUrl);
    }
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
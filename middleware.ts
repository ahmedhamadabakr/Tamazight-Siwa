import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/user'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Handle role-based access
  if (token && token.role) {
    // Manager routes - only accessible by managers
    if (pathname.startsWith(`/dashboard/${token.id}`) && token.role !== 'manager') {
      return NextResponse.redirect(new URL('/user', request.url));
    }

    // User routes - only accessible by regular users
    if (pathname.startsWith(`/user/${token.id}`) && token.role !== 'user') {
      return NextResponse.redirect(new URL('/user', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*',
  ],
};

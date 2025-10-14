import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Define admin routes that require authentication
  const adminRoutes = ['/dashboard', '/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // If it's an admin route and user is not authenticated, redirect to login
  if (isAdminRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If it's an admin route and user is not an admin, redirect to home
  if (isAdminRoute && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};

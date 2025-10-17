import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/google/callback',
    '/auth/facebook/callback',
    '/onboarding/company-setup',
    '/', // Landing page
  ];

  // Static files and API routes that should be ignored
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to profile
  if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};

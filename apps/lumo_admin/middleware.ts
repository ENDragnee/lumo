// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// ✨ FIX: Added your custom login page to the public routes.
const publicPageRoutes = ['/', '/auth/login', '/landing'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isPublicPageRoute = publicPageRoutes.some(path => pathname === path);

  if (isPublicPageRoute) {
    return NextResponse.next();
  }

  // If the user is not authenticated and trying to access a protected page...
  if (!token && !isPublicPageRoute) {
    // ✨ FIX: Redirect to your actual custom login page at '/auth/login'.
    const signInUrl = new URL('/auth/login', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is authenticated, or the route is public, allow the request.
  return NextResponse.next();
}

// Your config matcher is perfect, no changes needed here.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|webmanifest|xml|txt)$).*)',
  ],
};

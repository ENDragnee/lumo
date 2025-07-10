// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Keep your public page routes here
const publicPageRoutes = ['/', '/landing', '/auth/signin', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // --- Interaction Tracking Block REMOVED ---
  // The old tracking logic is no longer needed here.
  // The 'useInteractionTracker' hook on the client-side page 
  // '/content/[contentId]/page.tsx' now handles this responsibility
  // with a more robust 'start'/'end' event system.

  // --- Authentication Logic (Unchanged) ---
  const isPublicPageRoute = publicPageRoutes.includes(pathname);

  if (isPublicPageRoute) {
    return NextResponse.next();
  }

  if (!token && !isPublicPageRoute) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Config Matcher (Unchanged)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|webmanifest|xml|txt)$).*)',
  ],
};

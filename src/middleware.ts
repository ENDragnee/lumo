// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Keep your public page routes here
const publicPageRoutes = ['/', '/landing', '/auth/signin', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl; // Use request.nextUrl for easier parsing

  // --- Interaction Tracking (No changes needed here) ---
  if (pathname.startsWith('/content')) {
    const contentId = request.nextUrl.searchParams.get('id');

    if (contentId && token?.sub) {
      try {
        // Use request.nextUrl.origin for base URL to ensure correct domain/port
        await fetch(new URL('/api/track-interaction', request.nextUrl.origin), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: token.sub,
            contentId,
          }),
          // Optional: Add signal for timeout/cancellation if needed
          // signal: AbortSignal.timeout(5000)
        });
      } catch (error) {
        console.error('Interaction tracking failed:', error);
        // Decide if you want to block the request or just log the error
        // For tracking, usually just logging is preferred.
      }
    }
  }

  // --- Authentication Logic ---

  // Check if the current path is a public *page* route
  const isPublicPageRoute = publicPageRoutes.includes(pathname);

  // If it's a public page, allow access directly
  if (isPublicPageRoute) {
    // Optional: Redirect logged-in users away from auth pages or landing pages they shouldn't see
    if (token && (pathname.startsWith('/auth/') || pathname === '/landing')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise, allow access to the public page
    return NextResponse.next();
  }

  // If it's NOT a public page route and the user is NOT logged in, redirect to signin
  if (!token && !isPublicPageRoute) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search); // Preserve query params
    return NextResponse.redirect(signInUrl);
  }

  // If none of the above conditions met, allow the request to proceed
  // (This covers logged-in users accessing protected routes)
  return NextResponse.next();
}

// --- Updated Config Matcher ---
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Anything containing a '.' (period) character, assumed to be a static file resource
     *   (e.g., images, fonts, CSS, JS files served from root or other paths)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|webmanifest|xml|txt)$).*)',
  ],
};
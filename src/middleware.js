// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/landing', '/auth/signin', '/auth/signup'];

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = new URL(request.url);

  // Track content views by calling the API route
  if (pathname.startsWith('/content')) {
    const contentId = new URL(request.url).searchParams.get('id');
    
    if (contentId && token?.sub) {
      try {
        await fetch(new URL('/api/track-interaction', request.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: token.sub,
            contentId
          })
        });
      } catch (error) {
        console.error('Interaction tracking failed:', error);
      }
    }
  }

  // Authentication logic
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token && !publicRoutes.includes(pathname)) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
};

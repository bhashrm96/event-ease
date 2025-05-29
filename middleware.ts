// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Restrict /users routes to ADMIN only
  if (pathname.startsWith('/users')) {
    if (!token || token.role !== 'ADMIN') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/sign-in';
      return NextResponse.redirect(loginUrl);
    }
  }
  
    if (pathname === '/my-events' || pathname === '/events/create' ||
  /^\/events\/[^/]+\/edit$/.test(pathname)) {
    if (!token) {
      // Not logged in → redirect to sign-in
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/sign-in';
      return NextResponse.redirect(loginUrl);
    }

    if (token.role === 'STAFF') {
      // Staff logged in → redirect to events
      const eventsUrl = req.nextUrl.clone();
      eventsUrl.pathname = '/events';
      return NextResponse.redirect(eventsUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/users/:path*',
    '/events/create',
    '/events/:id/edit',
    '/events/:id/rsvp',
  ],
};

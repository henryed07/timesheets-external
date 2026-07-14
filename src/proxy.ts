import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const PROTECTED_PREFIXES = ['/timesheets', '/profile', '/admin'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthRoute = AUTH_ONLY_ROUTES.includes(pathname);

  const session = await getSession();

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL('/timesheets', request.url));
  }

  if (pathname.startsWith('/admin') && session && session.role !== 'STAFF') {
    return NextResponse.redirect(new URL('/timesheets', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDash = pathname.startsWith('/admin/dashboard');
  const isApi = pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload') || pathname === '/api/auth/logout';
  if (isDash || isApi) {
    const token = request.cookies.get('edu_admin_token')?.value;
    if (!token) return isApi ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) : NextResponse.redirect(new URL('/admin', request.url));
    const session = await verifyToken(token);
    if (!session) {
      if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const r = NextResponse.redirect(new URL('/admin', request.url));
      r.cookies.delete('edu_admin_token');
      return r;
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/dashboard/:path*', '/api/admin/:path*', '/api/upload', '/api/auth/logout'] };

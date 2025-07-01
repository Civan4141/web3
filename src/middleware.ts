import { NextRequest, NextResponse } from 'next/server';

// Admin paneline erişim için middleware
export async function middleware(request: NextRequest) {
  // Sadece /admin ve alt path'ler için çalışsın
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminAuth = request.cookies.get('admin-auth');
    if (!adminAuth || adminAuth.value !== '1') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
  // Diğer path'ler için değişiklik yapma
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

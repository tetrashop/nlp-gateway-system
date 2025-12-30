import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // اگر درخواست به مسیر api/nlp است، بدون احراز هویت عبور بده
  if (request.nextUrl.pathname.startsWith('/api/nlp')) {
    return NextResponse.next()
  }

  // برای بقیه مسیرها، به صفحه لاگین هدایت کن
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

// تنظیم می‌کند که middleware فقط روی مسیرهای مشخص اجرا شود
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

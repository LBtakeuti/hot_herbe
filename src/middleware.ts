import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CSRFトークンの生成
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // セキュリティヘッダーの設定
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // 本番環境でのみHTST（HTTP Strict Transport Security）を有効化
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  // Content Security Policy（CSP）の設定
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.supabase.co;
    frame-src https://js.stripe.com https://checkout.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)

  // APIルートへのアクセス制御
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // CORS設定（必要に応じて特定のオリジンのみ許可）
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'http://localhost:3000',
      'https://hot-herbe.vercel.app', // 本番環境のURL
    ]
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Max-Age', '86400')
    }
    
    // レート制限の実装（簡易版）
    // 本番環境では、Redis等を使用してより堅牢な実装にすべき
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `rate_limit:${ip}:${Date.now()}`
    
    // Webhook用の特別な処理
    if (request.nextUrl.pathname === '/api/webhooks/stripe') {
      // Stripe Webhookは署名で検証するため、CSRFトークンは不要
      return response
    }
  }

  // 管理画面へのアクセス制御
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('adminAuth')
    
    // ログインページは除外
    if (request.nextUrl.pathname === '/admin/login') {
      return response
    }
    
    // 認証チェック
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // CSRFトークンの設定（POSTリクエストの場合）
  if (request.method === 'POST' && !request.nextUrl.pathname.startsWith('/api/webhooks')) {
    const csrfToken = request.cookies.get('csrf-token')
    const csrfHeader = request.headers.get('x-csrf-token')
    
    // トークンが存在しない場合は生成
    if (!csrfToken) {
      const newToken = generateCSRFToken()
      response.cookies.set('csrf-token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24時間
      })
    }
    
    // POSTリクエストでトークンの検証（API以外）
    if (!request.nextUrl.pathname.startsWith('/api/')) {
      if (csrfToken && csrfHeader && csrfToken.value !== csrfHeader) {
        return new NextResponse('Invalid CSRF token', { status: 403 })
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
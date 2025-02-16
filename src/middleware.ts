import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logError, logInfo } from './lib/logger'

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Log successful auth checks in development
    if (process.env.NODE_ENV === 'development') {
      logInfo('Auth check completed', {
        path: request.nextUrl.pathname,
        authenticated: !!session,
      })
    }

    // Auth Routes Protection
    const isAuthRoute = request.nextUrl.pathname.startsWith('/(auth)')
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protected Routes
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
  } catch (error) {
    logError(error as Error, {
      path: request.nextUrl.pathname,
      method: request.method,
    })

    // For API routes, return error response
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }

    // For page routes, redirect to error page
    return NextResponse.redirect(new URL('/error', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 
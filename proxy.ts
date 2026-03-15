import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session and get user
  let response = await updateSession(request)

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/study-planner',
    '/modules',
    '/calendar',
    '/subjects',
    '/focus-mode',
    '/settings',
  ]

  const pathname = request.nextUrl.pathname

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Get the auth session from the request cookies
    const authToken = request.cookies.get('sb-auth-token')?.value

    // If no auth token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

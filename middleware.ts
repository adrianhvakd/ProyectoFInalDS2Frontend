import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

const publicRoutes = [
  '/',
  '/services',
  '/auth/callback',
]

const authRoutes = [
  '/auth/login',
  '/auth/register',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  let role = 'user'
  let isActive = true

  if (user) {
    try {
      const { data: profile } = await supabase
        .from('user')
        .select('role, company_id, is_active')
        .eq('id', user.id)
        .single()

      if (profile) {
        role = profile?.role || 'user'
        isActive = profile?.is_active !== false
      }
    } catch (e) {
      console.log('Profile query failed, using default role')
    }
  }

  if (authRoutes.includes(pathname)) {
    if (user && isActive) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (role === 'operator') {
        return NextResponse.redirect(new URL('/operator', request.url))
      } else {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return await updateSession(request)
  }

  if (publicRoutes.includes(pathname)) {
    return await updateSession(request)
  }

  if (!user || !isActive) {
    const loginUrl = new URL('/auth/login', request.url)
    if (!isActive) {
      loginUrl.searchParams.set('error', 'Tu cuenta ha sido desactivada')
    }
    if (pathname.startsWith('/admin') || pathname.startsWith('/operator')) {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname.startsWith('/operator') && role !== 'operator' && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

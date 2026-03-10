'use server'

import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { LoginFormInputs } from './loginForm' 
import { RegisterFormInputs } from './registerForm'

async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}


export async function signup(data: RegisterFormInputs) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
        full_name: data.full_name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function login(data: LoginFormInputs, rememberMe: boolean = true) {
  const supabase = await createClient()

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  if (rememberMe) {
    const cookieStore = await cookies()
    cookieStore.set('sb-session-extended', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  const { data: { user } } = await supabase.auth.getUser()
  let role = 'user'
  
  if (user) {
    const { data: profile } = await supabase
      .from('user')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile) {
      role = profile.role || 'user'
    }
  }

  if (role === 'admin') {
    redirect('/admin')
  } else if (role === 'operator') {
    redirect('/operator')
  } else {
    redirect('/')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export type UserData = {
  username: string;
  full_name: string;
  role: string;
  email: string;
  company_id: number | null;
} | null;

export async function getUserData(): Promise<UserData> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  const { data: profile } = await supabase
    .from('user')
    .select('username, full_name, role, email, company_id')
    .eq('id', user.id)
    .single()
  
  if (profile) {
    return {
      username: profile.username || '',
      full_name: profile.full_name || '',
      role: profile.role || 'user',
      email: profile.email || user.email || '',
      company_id: profile.company_id,
    }
  }
  
  return {
    username: user.user_metadata?.username || '',
    full_name: user.user_metadata?.full_name || '',
    role: user.user_metadata?.role || 'user',
    email: user.email || '',
    company_id: null,
  }
}

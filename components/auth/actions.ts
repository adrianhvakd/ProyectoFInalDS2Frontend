'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { LoginFormInputs } from './loginForm' 
import { RegisterFormInputs } from './registerForm'


export async function signup(data: RegisterFormInputs) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
        full_name: data.full_name,
        role: 'operator',
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

  const { error } = await supabase.auth.signInWithPassword({
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

  redirect('/')
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
} | null;

export async function getUserData(): Promise<UserData> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return {
    username: user.user_metadata?.username || '',
    full_name: user.user_metadata?.full_name || '',
    role: user.user_metadata?.role || 'operator',
    email: user.email || '',
  }
}

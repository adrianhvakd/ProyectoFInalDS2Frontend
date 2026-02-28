'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

export async function login(data: LoginFormInputs) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
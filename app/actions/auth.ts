'use server'

import { redirect } from 'next/navigation'

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { createServerSupabaseClient } = await import('@/app/lib/supabase')
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return redirect('/')
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { createServerSupabaseClient } = await import('@/app/lib/supabase')
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    throw error
  }
  
  return redirect('/verify-email')
}

export async function signOut() {
  const { createServerSupabaseClient } = await import('@/app/lib/supabase')
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  return redirect('/login')
} 
'use server'

import { createClient } from '../../lib/server/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { AuthError, logError, logInfo } from '@/lib/logger'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const authError = new AuthError(
        error.message,
        'AUTH_SIGN_IN_ERROR',
        401,
        { email }
      )
      logError(authError)
      return { error: error.message }
    }

    logInfo('User signed in successfully', { email })
    revalidatePath('/')
    redirect('/dashboard')
  } catch (error) {
    logError(error as Error, { email })
    return {
      error: 'An unexpected error occurred. Please try again later.'
    }
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  try {
    await supabase.auth.signOut()
    logInfo('User signed out successfully')
    revalidatePath('/')
    redirect('/login')
  } catch (error) {
    logError(error as Error)
    throw new AuthError(
      'Failed to sign out',
      'AUTH_SIGN_OUT_ERROR',
      500
    )
  }
} 
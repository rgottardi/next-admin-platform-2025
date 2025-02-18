import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { Github } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectedFrom?: string }
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  const signIn = async () => {
    'use server'
    
    const supabase = createClient()
    const redirectTo = searchParams.redirectedFrom || '/dashboard'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?redirectTo=${redirectTo}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return redirect(data.url)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your admin dashboard
          </p>
        </div>
        <form action={signIn} className="mt-8 space-y-6">
          <Button
            type="submit"
            className="w-full"
            size="lg"
          >
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </form>
      </div>
    </div>
  )
} 
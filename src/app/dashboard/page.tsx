import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
        <p className="mt-4 text-gray-600">
          You are signed in as {session.user.email}
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard cards will go here */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">Quick Stats</h2>
            <p className="mt-2 text-gray-600">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
} 
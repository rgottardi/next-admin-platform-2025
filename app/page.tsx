'use client'

import { signOut } from '@/app/actions/auth'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold">Welcome to the Admin Platform</h1>
        <form action={signOut}>
          <button
            className="mt-6 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
            type="submit"
          >
            Sign Out
          </button>
        </form>
      </main>
    </div>
  )
} 
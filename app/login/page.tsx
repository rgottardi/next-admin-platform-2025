'use client'

import { useState } from 'react'
import { signInWithEmail } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string>('')
  
  async function handleSubmit(formData: FormData) {
    try {
      await signInWithEmail(formData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold">Welcome to Next Admin Platform</h1>
        <p className="mt-3 text-2xl">Sign in to your account</p>
        
        <form action={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-4">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-left text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-left text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="mt-4 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-black hover:underline">
            Sign up
          </a>
        </p>
      </main>
    </div>
  )
} 
import { type Metadata } from 'next'
import { createClient } from '../../lib/server/supabase'
import { type ReactNode } from 'react'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dashboard - Next.js Admin Platform',
  description: 'Admin dashboard overview',
}

export default async function DashboardPage(): Promise<ReactNode> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Welcome back!
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>You are logged in as {user?.email}</p>
        </div>
      </div>
    </div>
  )
} 
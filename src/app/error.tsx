'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log client-side errors to your error reporting service
    console.error('Client-side error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Something went wrong!
        </h2>
        <p className="mb-4 text-gray-600">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => reset()}
            variant="outline"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="default"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
} 
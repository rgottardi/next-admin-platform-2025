import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <h1 className="text-4xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-2 text-gray-600">
          There was a problem authenticating your account.
        </p>
        <div className="mt-4">
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  )
} 
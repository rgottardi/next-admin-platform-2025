export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold">Check Your Email</h1>
        <p className="mt-3 text-xl max-w-md">
          We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
        </p>
        <p className="mt-8 text-sm text-gray-600">
          Didn't receive the email?{' '}
          <a href="/signup" className="text-black hover:underline">
            Try signing up again
          </a>
        </p>
      </main>
    </div>
  )
} 
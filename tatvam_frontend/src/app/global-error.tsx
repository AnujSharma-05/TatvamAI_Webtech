'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h1 className="text-6xl font-bold text-red-600">500</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mt-4">Something went wrong!</h2>
            <p className="text-gray-600 mt-2">An unexpected error occurred.</p>
            <button
              onClick={reset}
              className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 
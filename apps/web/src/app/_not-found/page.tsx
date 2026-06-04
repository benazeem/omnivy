import React from 'react'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-secondary">The page you are looking for does not exist.</p>
      </div>
    </main>
  )
}

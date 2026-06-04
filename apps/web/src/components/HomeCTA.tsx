'use client'

import Link from 'next/link'
import { Download, MoveRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@omnivy/ui'

export default function HomeCTA() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated' && !!session?.user

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-start">
      <Button asChild className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/25 hover:scale-[1.02]">
        <Link href="/install" className="flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Install Extension
        </Link>
      </Button>

      {isAuthenticated ? (
        <Button asChild variant="outline" className="px-8 py-4 bg-white dark:bg-white/5 border-slate-200 dark:border-[var(--border-dim)] hover:border-brand-500 rounded-2xl font-bold hover:scale-[1.02]">
          <Link href="/profile" className="flex items-center justify-center gap-2">
            Open Profile
            <MoveRight className="w-5 h-5" />
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="px-8 py-4 bg-white dark:bg-white/5 border-slate-200 dark:border-[var(--border-dim)] hover:border-brand-500 rounded-2xl font-bold hover:scale-[1.02]">
          <Link href="/auth/signin" className="flex items-center justify-center gap-2">
            Sign in to Connect
            <MoveRight className="w-5 h-5" />
          </Link>
        </Button>
      )}
    </div>
  )
}

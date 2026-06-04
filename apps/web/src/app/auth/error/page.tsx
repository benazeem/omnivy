'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, ArrowLeft, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { ERROR_MESSAGES } from '@/constants/error'



function AuthErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error') || 'Default'
  const errorInfo = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.Default

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[var(--bg-primary)] relative overflow-hidden">
    
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl border border-[var(--border-color)] text-center">
 
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-display font-extrabold tracking-tight mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-secondary text-sm mb-8">
            {errorInfo.description}
          </p>
 
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-xl text-xs font-mono text-red-400 mb-8">
            Error Code: {errorCode}
          </div>
 
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] interactive"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-[var(--border-dim)] rounded-2xl font-bold text-sm text-secondary hover:text-brand-500 transition-all interactive"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}

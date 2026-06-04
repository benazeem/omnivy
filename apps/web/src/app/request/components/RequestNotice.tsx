'use client'

import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
import { Card } from '@omnivy/ui'

export function RequestNotice() {
  return (
    <Card className="p-5 rounded-2xl mb-8 border border-brand-500/15 bg-brand-500/5 shadow-none">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Please check upcoming integrations first so we do not duplicate
            something already planned.
          </p>
          <Link
            href="/future-improvements"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
          >
            View future improvements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  )
}

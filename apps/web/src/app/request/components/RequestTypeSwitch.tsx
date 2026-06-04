'use client'

import { Sparkles, Bug } from 'lucide-react'
import { Button, Card } from '@omnivy/ui'
import type { FeedbackType } from '@/types/request'

interface Props {
  type: FeedbackType
  onChange: (value: FeedbackType) => void
}

export function RequestTypeSwitch({ type, onChange }: Props) {
  return (
    <Card className="flex p-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-[var(--border-dim)] rounded-2xl mb-8 relative shadow-none">
      <Button
        onClick={() => onChange('feature')}
        variant={type === 'feature' ? 'default' : 'ghost'}
        className={`flex-1 justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all relative z-10 ${
          type === 'feature'
            ? 'text-white shadow-sm'
            : 'text-secondary hover:text-[var(--text-primary)]'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        Request Feature
      </Button>
      <Button
        onClick={() => onChange('bug')}
        variant={type === 'bug' ? 'destructive' : 'ghost'}
        className={`flex-1 justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all relative z-10 ${
          type === 'bug'
            ? 'text-white shadow-sm'
            : 'text-secondary hover:text-[var(--text-primary)]'
        }`}
      >
        <Bug className="w-4 h-4" />
        Report a Bug
      </Button>
    </Card>
  )
}

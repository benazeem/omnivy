'use client'

import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@omnivy/ui'
import type { FeedbackType } from '@/types/request'

interface Props {
  type: FeedbackType
  onReset: () => void
}

export function RequestSuccess({ type, onReset }: Props) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12 px-8 space-y-6"
    >
      <div className="flex justify-center">
        <div className="p-5 bg-emerald-500/10 rounded-full text-emerald-500">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold font-display">Thank you!</h3>
        <p className="text-secondary text-sm mt-2 max-w-sm mx-auto leading-relaxed">
          Your {type === 'feature' ? 'feature request' : 'bug report'} has been
          logged on GitHub. We appreciate your contribution to making Omnivy
          better.
        </p>
      </div>
      <Button
        onClick={onReset}
        variant="default"
        className="px-6 py-2.5 rounded-xl text-sm font-bold"
      >
        Submit Another
      </Button>
    </motion.div>
  )
}

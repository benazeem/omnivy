'use client'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Card } from '@omnivy/ui'
import { RequestHero } from './components/RequestHero'
import { RequestTypeSwitch } from './components/RequestTypeSwitch'
import { RequestNotice } from './components/RequestNotice'
import { RequestForm } from './components/RequestForm'
import { RequestSuccess } from './components/RequestSuccess'
import type { FeedbackType } from '@/types/request'

export default function RequestPage() {
  const [type, setType] = useState<FeedbackType>('feature')
  const [submitted, setSubmitted] = useState(false)

  const handleTypeChange = (value: FeedbackType) => {
    setType(value)
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen pt-16 pb-24 px-6 bg-[var(--bg-primary)]">
      <div className="max-w-2xl mx-auto">
        <RequestHero />

        <RequestTypeSwitch type={type} onChange={handleTypeChange} />

        {!submitted && <RequestNotice />}

        <Card className="glass-panel p-0 relative overflow-hidden border border-[var(--border-color)] dark:border-[var(--border-dim)] bg-[var(--bg-secondary)] dark:bg-white/5 shadow-none rounded-2xl">
          <AnimatePresence mode="wait">
            {submitted ? (
              <RequestSuccess
                key="success"
                type={type}
                onReset={() => setSubmitted(false)}
              />
            ) : (
              <RequestForm
                key="form"
                type={type}
                onSuccess={() => setSubmitted(true)}
              />
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

export function RequestHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10"
    >
      <div className="flex items-center justify-center mb-6">
        <div className="p-4 bg-brand-500/10 rounded-[24px] text-brand-600">
          <Sparkles className="w-10 h-10" />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4">
        Feature Requests & Bug Reports
      </h1>
      <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed">
        Help us improve Omnivy. Request new features or report issues directly
        to our GitHub tracker.
      </p>
    </motion.div>
  )
}

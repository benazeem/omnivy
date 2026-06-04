'use client'

import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import WorkStep from '../WorkStep'
import { WorkSteps } from '@/constants/home'

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-secondary)] border-y border-slate-200/50 dark:border-white/5">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Simple 3-Step Setup.
          </h2>
          <p className="text-lg text-secondary">
            Go from installation to your first cloud or vault clip in less
            than 60 seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12 relative">
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10 -translate-x-1/2 z-0 hidden md:block" />

          {WorkSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10"
            >
              <WorkStep
                title={step.title}
                description={step.description}
                icon={step.icon}
                step={step.step}
                isEven={index % 2 === 0}
              />
              {index < WorkSteps.length - 1 && (
                <div className="flex justify-center md:hidden my-4">
                  <ArrowDown className="w-6 h-6 text-brand-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

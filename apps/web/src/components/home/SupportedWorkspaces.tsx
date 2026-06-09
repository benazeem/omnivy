'use client'

import { motion } from 'motion/react'
import { Integrations } from '@/constants/home'

export function SupportedWorkspaces() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-slate-200/50 dark:border-white/5 bg-[var(--bg-secondary)]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-black uppercase tracking-wider mb-4">
            Supported Workspaces
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            One Clipper. <span className="gradient-text">Unified Sync.</span>
          </h2>
          <p className="text-lg text-secondary">
            Omnivy bridges the gap between your local markdown files,
            corporate workspaces, and secure backups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {Integrations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 sm:p-6 rounded-3xl bg-[var(--bg-main)] border border-slate-200 dark:border-white/5 ${item.border} transition-all duration-300 flex flex-col justify-between space-y-4 min-h-[230px] sm:min-h-[250px] lg:min-h-[270px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`max-w-full px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase border leading-tight ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-extrabold text-lg sm:text-xl text-[var(--text-primary)]">
                  {item.name}
                </h4>
                <span className="text-xs sm:text-sm text-brand-500 font-bold block mb-2 leading-snug">
                  {item.type}
                </span>
                <p className="text-sm text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

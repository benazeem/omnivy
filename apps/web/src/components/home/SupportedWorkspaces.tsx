'use client'

import { motion } from 'motion/react'
import { Integrations } from '@/constants/home'

export function SupportedWorkspaces() {
  return (
    <section className="py-20 px-6 border-t border-slate-200/50 dark:border-white/5 bg-[var(--bg-secondary)]">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-black uppercase tracking-wider mb-4">
            Supported Workspaces
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            One Clipper. <span className="gradient-text">Unified Sync.</span>
          </h2>
          <p className="text-lg text-secondary">
            Omnivy bridges the gap between your local markdown files,
            corporate workspaces, and secure backups.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Integrations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl bg-[var(--bg-main)] border border-slate-200 dark:border-white/5 ${item.border} transition-all duration-300 flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-extrabold text-lg text-[var(--text-primary)]">
                  {item.name}
                </h4>
                <span className="text-[11px] text-brand-500 font-bold block mb-2">
                  {item.type}
                </span>
                <p className="text-xs text-secondary leading-relaxed">
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

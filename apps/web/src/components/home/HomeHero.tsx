'use client'

import { motion } from 'motion/react'
import dynamic from 'next/dynamic'
import HomeCTA from '../HomeCTA'

const ThreeScene = dynamic(
  () => import('../ThreeScene').then((mod) => mod.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center w-full h-96 rounded-lg border border-white/5 bg-white/5"
        aria-hidden="true"
      >
        <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    ),
  },
)

export function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-6">
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Local Obsidian, Notion & Cloud Markdown
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[1.1] mb-6">
            Clip the web to <br />
            <span className="gradient-text">your notes</span>.
          </h1>

          <p className="text-lg md:text-xl text-secondary max-w-lg mb-10 leading-relaxed">
            Omnivy captures articles, docs, GitHub files, discussions, and
            useful page metadata, then saves clean Markdown to Obsidian,
            Notion, Google Drive, OneDrive, or Dropbox.
          </p>

          <HomeCTA />
 
          <div className="mt-10 pt-6 border-t border-slate-200/50 dark:border-white/5 flex flex-wrap items-center gap-4"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
          aria-hidden="true"
        >
          <div className="relative z-10 p-4">
            <ThreeScene />
          </div> 
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-[40px] border border-white/5 blur-sm" />
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import Link from 'next/link'
import { Download, MoveRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@omnivy/ui'
import { ThreeScene } from './ThreeScene'

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Obsidian · Notion · Drive · OneDrive · Dropbox
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[1.1] mb-6">
            Clip the web to <br />
            <span className="gradient-text">every workspace</span>.
          </h1>

          <p className="text-lg md:text-xl text-secondary max-w-lg mb-10 leading-relaxed">
            Omnivy captures the active page from Chrome, extracts clean
            Markdown, and saves it to a local Obsidian vault or a connected
            Notion, Google Drive, OneDrive, or Dropbox destination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/20 hover:scale-[1.02]">
              <Link href="/install" className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Install Extension
              </Link>
            </Button>

            <Button asChild variant="outline" className="px-8 py-4 bg-white dark:bg-white/5 border-slate-200 dark:border-[var(--border-dim)] hover:border-brand-500 rounded-2xl font-bold hover:scale-[1.02]">
              <Link href="/auth/signin" className="flex items-center justify-center gap-2">
                Sign in & Connect
                <MoveRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-secondary">
            <span>Works with</span>
            <span className="font-bold">Windows</span>
            <span className="font-bold">macOS</span>
            <span className="font-bold">Linux</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
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

export default Hero

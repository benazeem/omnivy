import { Download, Chrome, Shield, CheckCircle2, Zap, Clock3, BadgeInfo } from 'lucide-react'
import Link from 'next/link'
import { ChromeExtensionStats } from '@/types/webStore'

export function InstallHero({ chromeStats }: { chromeStats: ChromeExtensionStats }) {
  const updatedLabel = chromeStats.lastUpdated
    ? new Date(chromeStats.lastUpdated).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not available'

  return (
    <div className="space-y-8 z-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Latest Version Available
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight">
          Knowledge capture, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">
            simplified.
          </span>
        </h1>
        <p className="mt-6 text-lg text-secondary max-w-xl leading-relaxed">
          Install the Omnivy Chrome extension to capture web content, extract
          clean Markdown, and save it to Obsidian or a connected cloud
          workspace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <a
          href={chromeStats.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 interactive"
        >
          <Chrome className="w-5 h-5" />
          Add to Chrome
          <span className="px-2 py-0.5 rounded-lg bg-black/20 text-xs">Free</span>
        </a>
        <Link
          href="/documentation"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all interactive"
        >
          Read Documentation
        </Link>
      </div>

      <div className="pt-8 border-t border-[var(--border-color)] space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
              <BadgeInfo className="w-3.5 h-3.5" />
              Live Chrome Web Store data
            </div>
            <h2 className="text-xl font-bold tracking-tight">{chromeStats.name}</h2>
          </div>
          <a
            href={chromeStats.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            Open listing
          </a>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)]/80 p-4">
          <img
            src={chromeStats.icon}
            alt={chromeStats.name}
            className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-color)] bg-white"
          />
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl font-black tracking-tight">{chromeStats.rating}</span>
              <span className="text-sm text-secondary">out of 5</span>
            </div>
            <p className="text-sm text-secondary truncate">
              {chromeStats.reviews} review{chromeStats.reviews === '1' ? '' : 's'} • {chromeStats.users} user{chromeStats.users === '1' ? '' : 's'}
            </p>
            <p className="text-xs text-secondary flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5" />
              Last updated: {updatedLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Shield className="w-4 h-4 text-emerald-500" />
            Privacy First
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Free account for cloud targets
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Zap className="w-4 h-4 text-emerald-500" />
            Instant Sync
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Download className="w-4 h-4 text-emerald-500" />
            Lightweight
          </div>
        </div>
      </div>
    </div>
  )
}

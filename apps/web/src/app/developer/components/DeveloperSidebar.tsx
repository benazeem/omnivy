import { currentFocus } from '@/constants/developer'

export function DeveloperSidebar() {
  return (
    <aside className="glass-panel p-5 sm:p-6 md:p-8 xl:p-6 2xl:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-start sm:items-center xl:items-start 2xl:items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex shrink-0 items-center justify-center text-white font-display text-2xl sm:text-3xl font-black shadow-lg shadow-brand-500/20">
          AM
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">
            GitHub Presence
          </p>
          <p className="text-sm text-secondary mt-1 break-words">
            github.com/benazeem
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold leading-tight">Location</p>
          <p className="mt-2 font-bold">Delhi</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold leading-tight">Focus</p>
          <p className="mt-2 font-bold">Product engineering</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Current Focus
        </h2>
        <div className="flex flex-wrap gap-2">
          {currentFocus.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm xl:text-xs 2xl:text-sm font-bold bg-white/5 border border-[var(--border-color)] text-secondary leading-tight"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

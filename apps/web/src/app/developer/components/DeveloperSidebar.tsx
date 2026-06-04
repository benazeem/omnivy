import { currentFocus } from '@/constants/developer'

export function DeveloperSidebar() {
  return (
    <aside className="glass-panel p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-display text-3xl font-black shadow-lg shadow-brand-500/20">
          AM
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">
            GitHub Presence
          </p>
          <p className="text-sm text-secondary mt-1">
            github.com/benazeem
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Location</p>
          <p className="mt-2 font-bold">Delhi</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Focus</p>
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
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-[var(--border-color)] text-secondary"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

import Link from 'next/link'

export function InstallPreview() {
  return (
    <div className="relative z-10 lg:pl-10">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 p-4 border border-[var(--border-color)] shadow-2xl overflow-hidden group">
    
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
 
        <div className="bg-[var(--bg-popover)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl w-[320px] mx-auto transform transition-transform group-hover:scale-[1.02] duration-500">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center overflow-hidden">
                <img
                  src="/icon.ico"
                  alt=""
                  className="w-4 h-4 object-contain invert"
                />
              </div>
              <span className="font-bold text-sm">Omnivy</span>
            </div>
          </div>
           
          <div className="p-4 space-y-4">
            <div>
              <div className="text-xl font-black leading-tight mb-2">The Future of AI and Agentic Coding</div>
              <div className="flex items-center gap-1 text-[10px] text-brand-500 font-mono uppercase">
                <Link href="#" className="pointer-events-none">github.com/deepmind</Link>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-muted)] rounded-xl text-xs font-mono text-secondary h-32 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-muted)]" />
              # The Future of AI...
              <br /><br />
              Recent advancements in large language models have paved the way for autonomous agents...
            </div>
          </div>
 
          <div className="p-3 bg-[var(--bg-muted)] border-t border-[var(--border-color)] flex justify-between items-center">
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded bg-purple-500/20" />
              <div className="w-6 h-6 rounded bg-emerald-500/20" />
              <div className="w-6 h-6 rounded bg-blue-500/20" />
              <div className="w-6 h-6 rounded bg-neutral-800/20" />
            </div>
            <div className="px-4 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold">
              Save
            </div>
          </div>
        </div>
         
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full" />
      </div>
      
      <p className="text-center text-xs text-secondary mt-6">
        *Local Obsidian clipping requires no account. Cloud targets require a free account to manage provider connections.
      </p>
    </div>
  )
}

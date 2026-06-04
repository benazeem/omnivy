import { Globe, Layers } from 'lucide-react'

export function DeveloperWhyBuilt() {
  return (
    <section className="p-8 md:p-10 rounded-3xl bg-brand-500/5 border border-brand-500/20">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div>
          <h2 className="text-2xl font-display font-extrabold tracking-tight mb-3">
            Why I Built Omnivy
          </h2>
          <p className="text-sm text-secondary leading-relaxed">
            Omnivy reflects the kind of software I like building: direct, private,
            and high leverage. It connects the browser with knowledge workflows
            without adding unnecessary friction or background complexity.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm mb-2">
              <Globe className="w-4 h-4 text-brand-500" />
              Browser-first workflow
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Optimized for fast capture, navigation, and sharing across the tools
              people already use.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm mb-2">
              <Layers className="w-4 h-4 text-brand-500" />
              Connected systems
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Built to move cleanly between local vaults, cloud storage, and
              structured workspaces.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

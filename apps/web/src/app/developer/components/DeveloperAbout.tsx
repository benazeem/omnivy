import { Heart, Briefcase, Settings } from 'lucide-react'

export function DeveloperAbout() {
  return (
    <div className="space-y-5 p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <h2 className="text-2xl font-display font-extrabold tracking-tight">About Me</h2>
      <p className="text-sm text-secondary leading-relaxed">
        I build clean, fast, and privacy-conscious products that feel polished
        from the first interaction. My work spans browser extensions, ecommerce
        systems, SaaS platforms, and internal tooling with a focus on strong UX,
        maintainable architecture, and practical performance.
      </p>
      <p className="text-sm text-secondary leading-relaxed">
        I care about reducing friction: direct actions, readable interfaces,
        accessible navigation, and delivery that performs well on real devices.
      </p>

      <div className="border-t border-[var(--border-color)] pt-5 space-y-3">
        <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm">
          <Heart className="w-4 h-4 text-rose-500" />
          Privacy First
        </div>
        <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm">
          <Briefcase className="w-4 h-4 text-blue-500" />
          Production Mindset
        </div>
        <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm">
          <Settings className="w-4 h-4 text-brand-500" />
          System Thinking
        </div>
      </div>
    </div>
  )
}

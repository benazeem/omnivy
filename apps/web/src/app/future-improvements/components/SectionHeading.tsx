import type { ReactNode } from 'react'

export function SectionHeading({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 shrink-0">{icon}</div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-secondary max-w-2xl">{description}</p>
      </div>
    </div>
  )
}

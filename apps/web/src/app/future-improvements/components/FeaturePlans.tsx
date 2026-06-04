import { ListChecks } from 'lucide-react'
import { Card } from '@omnivy/ui'
import { productPlans } from '@/constants/roadmap'
import { SectionHeading } from './SectionHeading'

export function FeaturePlans() {
  return (
    <Card className="glass-panel p-8 rounded-[28px] border border-[var(--border-dim)]">
      <SectionHeading
        icon={<ListChecks className="w-5 h-5" />}
        title="Feature plans"
        description="These are product improvements focused on settings clarity, speed, and onboarding."
      />
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {productPlans.map((item) => (
          <div key={item.title} className="p-5 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-main)]/80 space-y-3">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-secondary leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

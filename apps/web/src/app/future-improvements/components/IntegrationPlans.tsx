import { PlugZap } from 'lucide-react'
import { Card } from '@omnivy/ui'
import { upcomingIntegrations } from '@/constants/roadmap'
import { SectionHeading } from './SectionHeading'

export function IntegrationPlans() {
  return (
    <Card className="glass-panel p-8 rounded-[28px] border border-[var(--border-dim)]">
      <SectionHeading
        icon={<PlugZap className="w-5 h-5" />}
        title="Upcoming integrations"
        description="Provider support is still expanding. These are the integration directions we expect to work on next."
      />
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {upcomingIntegrations.map((item) => (
          <div key={item.title} className="p-5 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-main)]/80 space-y-3">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-secondary leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

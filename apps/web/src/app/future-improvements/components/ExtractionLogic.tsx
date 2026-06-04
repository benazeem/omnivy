import { Megaphone, CircleDot } from 'lucide-react'
import { Card } from '@omnivy/ui'
import { extractionLogic } from '@/constants/roadmap'
import { SectionHeading } from './SectionHeading'

export function ExtractionLogic() {
  return (
    <Card className="glass-panel p-8 rounded-[28px] border border-[var(--border-dim)]">
      <SectionHeading
        icon={<Megaphone className="w-5 h-5" />}
        title="Website extraction logic"
        description="A short list of parsing and extraction improvements planned for the content capture pipeline."
      />
      <div className="mt-8 space-y-3">
        {extractionLogic.map((item) => (
          <div key={item} className="flex items-start gap-3 p-4 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-main)]/80">
            <CircleDot className="w-4 h-4 text-brand-600 mt-1 shrink-0" />
            <p className="text-sm text-secondary leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

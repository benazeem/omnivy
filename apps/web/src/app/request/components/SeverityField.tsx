'use client'

import { Button } from '@omnivy/ui'
import { SEVERITIES } from '@/constants/request'
import { severityConfig } from '@/constants'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SeverityField({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-wider text-secondary">
        Severity
      </label>
      <div className="grid grid-cols-3 gap-3">
        {SEVERITIES.map((sev) => {
          const isActive = value === sev
          const cfg = severityConfig[sev]
          return (
            <Button
              key={sev}
              type="button"
              onClick={() => onChange(sev)}
              variant="outline"
              className={`py-2.5 px-4 rounded-xl text-xs font-bold capitalize transition-all border ${
                isActive
                  ? `${cfg.bg} ${cfg.color}`
                  : 'bg-transparent border-[var(--border-color)] dark:border-[var(--border-dim)] text-secondary hover:border-brand-500/30 hover:bg-brand-500/5'
              }`}
            >
              {sev}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

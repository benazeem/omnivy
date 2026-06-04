'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omnivy/ui'
import { FEATURE_CATEGORIES } from '@/constants/request'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function FeatureCategoryField({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="request-category"
        className="text-xs font-black uppercase tracking-wider text-secondary"
      >
        Category
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="request-category"
          className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] dark:bg-white/5 dark:border-[var(--border-dim)] rounded-xl px-4 py-2.5 text-sm focus:ring-0 focus:outline-none focus:border-brand-500/50 transition-colors"
        >
          <SelectValue placeholder="Choose a category" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--bg-secondary)] dark:bg-[#0f172a] border border-[var(--border-color)] dark:border-[var(--border-dim)] rounded-xl shadow-xl p-1.5">
          {FEATURE_CATEGORIES.map((cat) => (
            <SelectItem
              key={cat.value}
              value={cat.value}
              className="text-sm rounded-lg px-3 py-2 cursor-pointer text-[var(--text-primary)] hover:bg-brand-500/10 focus:bg-brand-500/10 focus:text-[var(--text-primary)] data-[state=checked]:text-brand-600 data-[state=checked]:font-semibold"
            >
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

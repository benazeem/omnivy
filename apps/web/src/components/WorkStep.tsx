'use client'

import * as Icons from 'lucide-react' 
import { WorkStepProps } from '../types'

function WorkStep({ title, description, icon, step, isEven }: WorkStepProps) {
  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1)
  const IconComponent = (Icons as any)[iconName] || Icons.Circle

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className={`flex-1 flex ${isEven ? 'justify-start' : 'justify-end'} hidden md:flex`}>
        <div className={`max-w-md ${isEven ? 'text-left' : 'text-right'}`}>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
          <p className="text-secondary leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-display font-black text-2xl z-10 shadow-xl shadow-brand-600/20">
          {step}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-brand-600 animate-ping opacity-20" />
      </div>
      <div className={`flex-1 flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
        <div className="md:hidden">
          <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
          <p className="text-secondary leading-relaxed">{description}</p>
        </div>
        <div className="hidden md:flex p-6 rounded-3xl bg-secondary border border-slate-200 dark:border-[var(--border-dim)] group-hover:border-brand-500/50 transition-colors shadow-sm">
          <IconComponent className="w-10 h-10 text-brand-500" />
        </div>
      </div>
    </div>
  )
}

export default WorkStep
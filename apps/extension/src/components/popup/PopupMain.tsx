import { Globe, Layout } from 'lucide-react'
import PropertyEditor from '@/components/PropertyEditor'
import { Textarea } from '@omnivy/ui'
import type { PopupMainProps } from '@/types/popup'


const PopupMain = ({ properties, setProperties, propertyList, onAddProperty }: PopupMainProps) => {
  return (
    <main className="flex-grow overflow-y-auto custom-scrollbar">
      <div className="px-5 py-6">
         <Textarea 
           value={properties.title}
           onChange={(e) => setProperties({...properties, title: e.target.value})}
           placeholder="Clip title"
           aria-label="Clip title"
           title="Clip title"
           className="w-full bg-transparent border-none outline-none text-2xl font-display font-black leading-tight tracking-tight resize-none focus:text-brand-500 transition-colors"
           rows={2}
         />
         <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            <Globe size={10} />
            {properties.source ? new URL(properties.source).hostname : 'No URL'}
         </div>
      </div>

      <div className="border-t border-[var(--border-dim)] bg-white/5">
        <PropertyEditor properties={propertyList} onAddProperty={onAddProperty} />
      </div>

      <div className="px-5 py-6 border-t border-[var(--border-dim)] space-y-3">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
               <Layout size={10} /> Content Preview
            </h4>
         </div>
         <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-[11px] font-mono leading-relaxed text-[var(--text-muted)] max-h-[300px] overflow-y-auto custom-scrollbar relative">
            <div className="whitespace-pre-wrap">{properties.content || 'Capturing article content...'}</div>
         </div>
      </div>
    </main>
  )
}

export default PopupMain

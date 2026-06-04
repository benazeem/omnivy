import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { PropertyEditorProps } from '@/types'



const PropertyEditor: React.FC<PropertyEditorProps> = ({ properties, onAddProperty }) => {
  return (
    <div className="space-y-1 py-2">
      <div className="px-4 py-1 flex items-center justify-between group">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Properties</span>
        <button
          type="button"
          onClick={onAddProperty}
          className="text-[10px] font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          <Plus size={12} />
          Add Property
        </button>
      </div>
      
      <div className="space-y-px">
        {properties.map((prop) => (
          <div key={prop.id} className="flex items-center gap-2 group px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="w-24 flex items-center gap-2 flex-shrink-0">
              <span className="text-[var(--text-muted)]">{prop.icon}</span>
              {prop.labelEditable ? (
                <input
                  type="text"
                  value={prop.label}
                  onChange={(e) => prop.onLabelChange?.(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-medium text-[var(--text-muted)] focus:text-brand-600 transition-colors"
                  placeholder="Property"
                />
              ) : (
                <span className="text-xs font-medium text-[var(--text-muted)]">{prop.label}</span>
              )}
            </div>
            <div className="flex-grow">
              <input
                type="text"
                value={prop.value}
                onChange={(e) => prop.onValueChange?.(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs font-medium focus:text-brand-600 transition-colors"
                placeholder={`Enter ${prop.label}...`}
              />
            </div>
            {prop.labelEditable && prop.onRemove && (
              <button
                type="button"
                onClick={prop.onRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-500"
                aria-label={`Remove property ${prop.label || ''}`}
                title="Remove property"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PropertyEditor

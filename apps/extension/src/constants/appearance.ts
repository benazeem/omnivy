import type { AccentColor, FontFamily, FontSize, UIDensity } from '@/types' 
  

export const accentColors: { value: AccentColor; label: string; color: string }[] = [
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'violet', label: 'Violet', color: '#8b5cf6' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
]

export const fontSizeOptions: { value: FontSize; label: string; size: string }[] = [
  { value: 'text-sm', label: 'Small', size: '13px' },
  { value: 'text-base', label: 'Medium', size: '15px' },
  { value: 'text-lg', label: 'Large', size: '17px' },
  { value: 'text-xl', label: 'X-Large', size: '19px' },
]

export const fontFamilyOptions: { value: FontFamily; label: string; class: string }[] = [
  { value: 'sans', label: 'Sans Serif', class: 'font-sans' },
  { value: 'serif', label: 'Serif', class: 'font-serif' },
  { value: 'mono', label: 'Monospace', class: 'font-mono' },
]

export const densityOptions: { value: UIDensity; label: string; desc: string }[] = [
  { value: 'compact', label: 'Compact', desc: 'Maximised content' },
  { value: 'comfortable', label: 'Comfortable', desc: 'Balanced padding' },
  { value: 'spacious', label: 'Spacious', desc: 'Room to breathe' },
]

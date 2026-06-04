export const FEATURE_CATEGORIES = [
  { value: 'general', label: 'General Extension Feature' },
  { value: 'notion', label: 'Notion Integration' },
  { value: 'obsidian', label: 'Obsidian Integration' },
  { value: 'cloud', label: 'Cloud Storage Providers' },
  { value: 'ui', label: 'UI / Customization' },
]

export const SEVERITIES = ['low', 'medium', 'high'] as const

export const DEFAULT_FORM = {
  title: '',
  description: '',
  category: 'general',
  severity: 'low' as const,
  email: '',
}

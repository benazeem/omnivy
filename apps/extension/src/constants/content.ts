 import type { SupportedSite } from '@/types/content'
 
export const FUTURE_KNOWLEDGE_INTEGRATIONS = [
  { name: 'AI chat workspaces', status: 'planned' as const },
  { name: 'YouTube transcripts', status: 'planned' as const },
] as const

export const GENERIC_SITE: SupportedSite = {
  key: 'generic',
  name: 'Generic Website',
  hosts: [],
  category: 'blog',
}

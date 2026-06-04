export type SiteCategory =
  | 'blog'
  | 'docs'
  | 'developer'
  | 'ai'
  | 'research'
  | 'news'
  | 'forum'
  | 'learning'
  | 'video'
  | 'social'
  | 'reading'
  | 'product'
  | 'notes'

export interface SupportedSite {
  key: string
  name: string
  hosts: string[]
  category: SiteCategory
  official?: boolean
  extractionPriority?: number
}

export type KnowledgePlatform =
  | 'generic'
  | 'github-file'
  | 'github-issue'
  | 'stackoverflow'
  | 'notion'

export interface KnowledgeExtractionResult {
  title?: string
  description?: string
  author?: string
  tags?: string[]
  markdown?: string
  links?: string[]
  site?: string
}

import { RoadmapItem } from '@/types'

export const upcomingIntegrations: RoadmapItem[] = [
  {
    title: 'More Notion destinations',
    description: 'Smarter database routing, richer block mapping, and better saved clip templates for Notion workflows.',
  },
  {
    title: 'Additional cloud targets',
    description: 'Expand the shared connection model so more provider-specific sync paths can be added without changing the extension UX.',
  },
  {
    title: 'Improved clip metadata',
    description: 'More automatic title, tag, and source enrichment before clips are handed off to the destination provider.',
  },
]

export const productPlans: RoadmapItem[] = [
  {
    title: 'Sharper settings surfaces',
    description: 'Make connected accounts, user info, and recent activity easier to review at a glance inside the extension.',
  },
  {
    title: 'Faster clipping flows',
    description: 'Reduce the number of clicks between selecting content and sending it into Obsidian or a cloud integration.',
  },
  {
    title: 'More helpful onboarding',
    description: 'Add clearer setup guidance so new users understand what is supported before they file requests.',
  },
  {
    title: 'Share Content as Link',
    description: 'Allow users to instantly generate an OpenGraph-enriched URL for their clips, perfect for sharing on social media or team chats.',
  },
]

export const extractionLogic = [
  'Implementation of AI Chat parsers (ChatGPT, Claude, Perplexity) to perfectly map assistant and user roles.',
  'Dedicated YouTube transcript extraction to save video timestamps alongside description metadata.',
  'Better article detection for noisy pages and content-heavy dashboards.',
  'Improved fallback parsing when a page structure changes unexpectedly.',
]

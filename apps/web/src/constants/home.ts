import { FAQItem } from '@/types'

export const Features = [
  {
    title: 'Local Obsidian Capture',
    description: [
      'Save Markdown notes through the Obsidian URI flow',
      'Use your configured local vault name from extension settings',
      'No web account required for local Obsidian clipping',
    ],
    icon: 'Cpu',
  },
  {
    title: 'Notion Workspace Save',
    description: [
      'Connect Notion securely from the web integrations page',
      'Load available destinations into the extension popup',
      'Send title, source, tags, and Markdown content from the active page',
    ],
    icon: 'Layers',
  },
  {
    title: 'Cloud Markdown Uploads',
    description: [
      'Secure integrations with Google Drive, OneDrive, and Dropbox',
      'Choose provider folders from the extension popup',
      'Upload clean .md clips with fallback Omnivy Web Clips destinations',
    ],
    icon: 'Database',
  },
  {
    title: 'Account-Backed Security',
    description: [
      'Omnivy cloud encrypts provider OAuth tokens at rest',
      'Extension uses short-lived access tokens with refresh rotation',
      'Sign in on the web — popup and settings stay authenticated',
    ],
    icon: 'ShieldCheck',
  },
  {
    title: 'Universal Cross-Platform',
    description: [
      'Works anywhere Chromium extensions can run',
      'Unsupported browser system pages are detected clearly',
      'Popup and context menu flows share the same save pipeline',
    ],
    icon: 'Globe',
  },
  {
    title: 'Intelligent Content Parsing',
    description: [
      'Custom extractors for GitHub files, issues, and pull requests',
      'Structured parsers for Stack Overflow, forums, Notion, AI chats, and video pages',
      'Generic fallback removes clutter and preserves readable Markdown',
    ],
    icon: 'Sparkles',
  },
]

export const Integrations = [
  {
    name: 'Obsidian',
    type: 'Local Markdown Note',
    description:
      'Create a Markdown note in a configured local vault through obsidian://new.',
    gradient: 'from-purple-500/10 to-indigo-500/10',
    border: 'hover:border-purple-500/30',
    badge: 'Local',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  },
  {
    name: 'Notion',
    type: 'Workspace Destination',
    description:
      'Save clips into connected Notion destinations with title, URL, tags, and Markdown content.',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    border: 'hover:border-amber-500/30',
    badge: 'Full Database Sync',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  },
  {
    name: 'Google Drive',
    type: 'Cloud Markdown Upload',
    description:
      'Upload .md clips to selected Drive folders or the Omnivy Web Clips fallback.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'hover:border-emerald-500/30',
    badge: 'Cloud Backup',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  },
  {
    name: 'Microsoft OneDrive',
    type: 'Cloud Markdown Upload',
    description:
      'Upload .md clips through Microsoft Graph using selected folders when available.',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'hover:border-blue-500/30',
    badge: 'Cloud Sync',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  },
  {
    name: 'Dropbox',
    type: 'Cloud Markdown Upload',
    description:
      'Upload .md clips to selected Dropbox folder paths or the Omnivy Web Clips fallback.',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    border: 'hover:border-indigo-500/30',
    badge: 'Fast Cloud Sync',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  },
]

export const WorkSteps = [
  {
    title: 'Add the Browser Extension',
    description:
      'Install the lightweight extension from the Chrome Web Store with one click.',
    icon: 'Chrome',
    step: 1,
  },
  {
    title: 'Connect Your Workspace',
    description:
      'Add your Obsidian vault name or connect Notion, Google Drive, OneDrive, or Dropbox.',
    icon: 'Settings',
    step: 2,
  },
  {
    title: 'Clip Instantly',
    description:
      'Open the popup, review extracted fields, choose a target, and save the Markdown clip.',
    icon: 'Zap',
    step: 3,
  },
]

export const faqItems: FAQItem[] = [
  {
    question: 'What does Omnivy clip into?',
    answer:
      'Omnivy clips articles, docs, GitHub files and threads, Stack Overflow discussions, forums, public Notion pages, AI conversations, and video metadata into Obsidian, Notion, Google Drive, OneDrive, or Dropbox.',
  },
  {
    question: 'Does Omnivy store my clipped content on your servers?',
    answer:
      'No. Clipped content is saved locally or to your connected destination provider. The service focuses on secure authentication and routing, not content hosting.',
  },
  {
    question: 'How do I report a bug or request a feature?',
    answer:
      'Check the future improvements page first, then use the request page to submit a new feature or bug report with enough detail to avoid duplicates.',
  },
]

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

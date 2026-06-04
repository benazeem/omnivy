import { Code2, Store, TerminalSquare } from 'lucide-react'
import { DeveloperTrack, DeveloperProject } from '@/types'



export const resumeTracks: DeveloperTrack[] = [
  {
    title: 'Frontend',
    icon: Code2,
    summary:
      'Interface-focused work for modern product experiences, fast rendering, and polished user journeys.',
    highlights: ['React', 'TypeScript', 'Accessibility', 'Performance'],
  },
  {
    title: 'Frontend + Shopify',
    icon: Store,
    summary:
      'Ecommerce work centered on Shopify Hydrogen, GraphQL, and headless storefront architecture.',
    highlights: ['Shopify Hydrogen', 'GraphQL', 'Headless Commerce', 'SEO'],
  },
  {
    title: 'Fullstack',
    icon: TerminalSquare,
    summary:
      'End-to-end delivery for SaaS platforms, auth flows, APIs, and cloud-backed product systems.',
    highlights: ['Node.js', 'Express.js', 'MongoDB', 'AWS'],
  },
]

export const featuredProjects: DeveloperProject[] = [
  {
    name: 'Omnivy',
    href: 'https://github.com/benazeem/omnivy',
    description:
      'Browser extension and companion platform for capturing, processing, and syncing web content into Obsidian-based note workflows.',
  },
  {
    name: 'MS Signature Scents',
    href: 'https://github.com/benazeem/MS-Signature',
    description:
      'Production ecommerce platform built with Next.js, TypeScript, Prisma, Supabase, Sanity CMS, and Razorpay.',
  },
  {
    name: 'Cintegrate',
    href: 'https://github.com/benazeem/Cintegrate-frontend',
    description:
      'AI-powered SaaS frontend for structured video creation workflows with authentication and dashboard systems.',
  },
  {
    name: 'Home Inventory',
    href: 'https://github.com/benazeem/Home-Inventory',
    description:
      'A digital pantry and household tracker that helps users monitor products before they expire.',
  },
]

export const techStack = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Express.js',
  'MongoDB',
  'PostgreSQL',
  'Redux Toolkit',
  'AWS',
  'Docker',
]

export const currentFocus = [
  'Shopify Hydrogen',
  'GraphQL',
  'Headless ecommerce architecture',
  'Scalable frontend systems',
]

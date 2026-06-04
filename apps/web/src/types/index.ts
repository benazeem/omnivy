export type OSType = 'windows' | 'linux' | 'apple' | null

export type OSDATAType = Array<{
  name: string
  value: OSType
  icon: string
  color: string
}>

export type FormData = {
  os: OSType
  hostLocation: string
  manifestLocation: string
  step: number
}

export type FeedbackType = 'feature' | 'bug'

export interface WorkStepProps {
  title: string
  description: string
  icon: string
  step: number
  isEven?: boolean
}

export interface FeatureCardProps {
  title: string
  description: Array<string>
  icon: string
  index: number
}

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export * from './auth'
export * from './api'
export * from './extension'

export interface FAQItem {
  question: string
  answer: string
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  updatedAt: string
  user: {
    name: string | null
    image: string | null
  }
}

export interface DeveloperTrack {
  title: string
  icon: any
  summary: string
  highlights: string[]
}

export interface DeveloperProject {
  name: string
  href: string
  description: string
}

export interface RoadmapItem {
  title: string
  description: string
}

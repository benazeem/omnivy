export type FeedbackType = 'feature' | 'bug'

export type Severity = 'low' | 'medium' | 'high'

export interface FeedbackFormData {
  title: string
  description: string
  category: string
  severity: Severity
  email: string
}

export interface ChromeExtensionStats {
  extensionId: string
  name: string
  rating: string
  reviews: string
  users: string
  icon: string
  lastUpdated: string | null
  sourceUrl: string
  reviewsUrl: string
  fetchedAt: string
}

export interface ChromeExtensionReview {
  id: string
  rating: number
  comment: string
  author: string
  updatedAt?: string
  helpfulText?: string
}

export interface ChromeExtensionReviewsResult {
  reviews: ChromeExtensionReview[]
  source: 'chrome-web-store' | 'fallback'
  reviewsUrl: string
}

export type ChromeExtensionStatsRow = {
  extension_id: string
  name: string
  rating: string
  reviews: string
  users: string
  icon: string
  last_updated: Date | null
  source_url: string
  fetched_at: Date
}

export type ChromeExtensionReviewRow = {
  extension_id: string
  review_id: string
  rating: number
  comment: string
  author: string
  helpful_text: string | null
  review_updated_at: string | null
  source: 'chrome-web-store' | 'fallback'
  source_url: string
  fetched_at: Date
}

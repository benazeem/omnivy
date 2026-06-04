
export interface ChromeExtensionReview {
  id: string
  rating: number
  comment: string
  author: string
  updatedAt?: string
  helpfulText?: string
}

export interface ReviewsResponse {
  reviews: ChromeExtensionReview[]
  source: 'chrome-web-store' | 'fallback'
  reviewsUrl: string
}
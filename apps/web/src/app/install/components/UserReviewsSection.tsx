'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MessageSquare, Star } from 'lucide-react'
import { ReviewsResponse } from '@/types/install'


function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300 dark:text-white/20'}`}
        />
      ))}
    </div>
  )
}

export function UserReviewsSection({
  totalReviews,
  averageRating,
  reviewsUrl,
}: {
  totalReviews: string
  averageRating: string
  reviewsUrl: string
}) {
  const [reviewState, setReviewState] = useState<ReviewsResponse>({
    reviews: [],
    source: 'fallback',
    reviewsUrl,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadReviews() {
      setIsLoading(true)
      try {
        const response = await fetch('/api/chrome-extension/reviews', {
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('Unable to load reviews')

        const data = (await response.json()) as ReviewsResponse
        void fetch(data.reviewsUrl, {
          mode: 'no-cors',
          cache: 'no-store',
        }).catch(() => {
           // Chrome Web Store is not browser-readable from this origin; this
          // probe only makes the official reviews request visible in DevTools.
        })

        if (active) {
          setReviewState({
            reviews: data.reviews || [],
            source: data.source || 'fallback',
            reviewsUrl: data.reviewsUrl || reviewsUrl,
          })
        }
      } catch {
        if (active) {
          setReviewState((current) => ({
            ...current,
            reviewsUrl: current.reviewsUrl || reviewsUrl,
          }))
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadReviews()
    return () => {
      active = false
    }
  }, [reviewsUrl])

  const reviews = reviewState.reviews
  const activeReviewsUrl = reviewState.reviewsUrl || reviewsUrl
  const isFallback = reviewState.source === 'fallback'

  return (
    <section className="pt-16 border-t border-[var(--border-color)]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-black tracking-tight">
              {averageRating}
            </span>
            <div className="pb-1 space-y-1">
              <StarDisplay rating={Math.round(Number(averageRating))} />
              <p className="text-xs text-secondary">
                {totalReviews} review{totalReviews !== '1' ? 's' : ''} on the
                Chrome Web Store
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-4">
            What users are saying
          </h2>
        </div>
        <a
          href={activeReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-bold text-[var(--text-main)] transition hover:border-brand-500 hover:text-brand-500"
        >
          Open all reviews
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/80"
            />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <>
          {isFallback && (
            <p className="mb-4 text-xs text-secondary">
              Chrome Web Store did not expose review text to the page request,
              so this fallback appears until live review text is available.
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/80 p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <StarDisplay rating={review.rating} />
                  {review.updatedAt && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {new Date(review.updatedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <p className="line-clamp-5 text-sm leading-relaxed text-secondary">
                  {review.comment}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
                  {review.author || 'Chrome Web Store user'}
                </div>
                {review.helpfulText && (
                  <p className="mt-2 text-[11px] text-secondary">
                    {review.helpfulText}
                  </p>
                )}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/80 p-6 text-sm text-secondary">
          Review text could not be loaded from Chrome Web Store. Open the
          official reviews page to read every review.
        </div>
      )}
    </section>
  )
}

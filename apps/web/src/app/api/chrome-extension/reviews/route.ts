import { NextResponse } from 'next/server'
import { getChromeExtensionReviewsResult } from '@/lib/chromeWebStore'

export async function GET() {
  const result = await getChromeExtensionReviewsResult()

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  })
}

import { NextResponse } from 'next/server'
import {
  refreshChromeExtensionReviews,
  refreshChromeExtensionStats,
} from '@/lib/chromeWebStore'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const [stats, reviews] = await Promise.all([
      refreshChromeExtensionStats(),
      refreshChromeExtensionReviews(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        stats,
        reviews,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to refresh Chrome Web Store stats'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { refreshChromeExtensionStats } from '@/lib/chromeWebStore'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const stats = await refreshChromeExtensionStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to refresh Chrome Web Store stats'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
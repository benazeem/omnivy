import { NextResponse } from 'next/server'
import { getChromeExtensionStats } from '@/lib/chromeWebStore'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params
    const stats = await getChromeExtensionStats(id)
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load Chrome Web Store stats'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
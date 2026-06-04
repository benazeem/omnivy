import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { GoogleDriveProvider } from "@/lib/oauth/GoogleDriveProvider"
import { OneDriveProvider } from "@/lib/oauth/OneDriveProvider"
import { DropboxProvider } from "@/lib/oauth/DropboxProvider"
import { NotionProvider } from "@/lib/oauth/NotionProvider"
import crypto from "node:crypto"
import { isOriginAllowed } from "@/lib/extensionAuth"

const PROVIDERS: Record<string, any> = {
  gdrive: new GoogleDriveProvider(),
  onedrive: new OneDriveProvider(),
  dropbox: new DropboxProvider(),
  notion: new NotionProvider(),
}

export async function GET(
  request: Request,
  props: { params: Promise<{ provider: string }> }
) {
  const params = await props.params
  const providerName = params.provider

  try { 
    const origin = request.headers.get("origin")
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 })
    }
     const session = await getSessionWithFallback()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const providerClient = PROVIDERS[providerName]
    if (!providerClient) {
      return NextResponse.json(
        { error: `Provider ${providerName} is not supported.` },
        { status: 404 }
      )
    }

     const state = crypto.randomBytes(16).toString("hex")

     const authUrl = providerClient.getAuthUrl(state)
 
    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error(`OAuth Initiation Critical Failure for ${providerName}:`, error)
    return NextResponse.json(
      { error: "Failed to initiate OAuth authorization flow." },
      { status: 500 }
    )
  }
}

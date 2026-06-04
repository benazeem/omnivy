import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { db } from "@/lib/database"
import { isOriginAllowed } from "@/lib/extensionAuth"

export async function POST(
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

    const validProviders = ["gdrive", "onedrive", "dropbox", "notion"]
    if (!validProviders.includes(providerName)) {
      return NextResponse.json(
        { error: `Provider ${providerName} is not supported.` },
        { status: 400 }
      )
    }
 
    const connection = await db.providerConnection.findUnique({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: providerName,
        },
      },
    })

    if (!connection) {
      return NextResponse.json(
        { error: `Provider ${providerName} is not connected.` },
        { status: 404 }
      )
    }
 
    await db.encryptedToken.deleteMany({
      where: { connectionId: connection.id },
    })
 
    await db.providerConnection.delete({
      where: { id: connection.id },
    })
 
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "oauth_disconnect",
        details: { provider: providerName },
      },
    })

    return NextResponse.json({ success: true, disconnected: providerName })
  } catch (error: any) {
    console.error(`Disconnect failure for ${providerName}:`, error)
    return NextResponse.json(
      { error: "Failed to disconnect provider." },
      { status: 500 }
    )
  }
}

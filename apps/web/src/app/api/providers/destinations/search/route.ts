import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { db } from "@/lib/database"
import { decrypt } from "@/lib/encryption"

export async function GET(req: Request) {
  const session = await getSessionWithFallback()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const provider = searchParams.get("provider")
  const query = searchParams.get("query") || ""

  if (!provider) {
    return NextResponse.json({ error: "Provider required" }, { status: 400 })
  }

  const connection = await db.providerConnection.findUnique({
    where: { userId_provider: { userId: session.user.id, provider } },
    include: { encryptedToken: true },
  })

  if (!connection || !connection.encryptedToken) {
    return NextResponse.json({ error: "Provider not connected" }, { status: 404 })
  }

  const token = decrypt(
    connection.encryptedToken.encryptedAccessToken,
    connection.encryptedToken.iv,
    connection.encryptedToken.tag
  )

  if (provider === "notion") { 
    const res = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query ? query : undefined,
        sort: { direction: "descending", timestamp: "last_edited_time" },
        page_size: 50,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Notion search failed: ${await res.text()}` }, { status: 500 })
    }

    const data = await res.json()
    const results = (data.results || []).map((item: any) => ({
      resourceId: item.id,
      resourceType: `notion_${item.object}`,  
      name:
        item.title?.[0]?.plain_text ||
        item.properties?.title?.title?.[0]?.plain_text ||
        item.properties?.Name?.title?.[0]?.plain_text ||
        "Untitled",
      metadata: { url: item.url },
    }))

    return NextResponse.json({ results })
  }

  return NextResponse.json({ error: "Provider search not implemented" }, { status: 501 })
}

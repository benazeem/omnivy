import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { db } from "@/lib/database"
import { isOriginAllowed } from "@/lib/extensionAuth"

export async function GET(request: Request) {
  try { 
    const origin = request.headers.get("origin")
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 })
    }

    const session = await getSessionWithFallback()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    const connections = await db.providerConnection.findMany({
      where: { userId: session.user.id },
      select: {
        provider: true,
        status: true,
        scopes: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, connections })
  } catch (error: any) {
    console.error("Provider connections status retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve provider connections status." },
      { status: 500 }
    )
  }
}

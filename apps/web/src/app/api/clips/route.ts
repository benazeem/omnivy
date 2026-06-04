import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { db } from "@/lib/database"
import { isOriginAllowed } from "@/lib/extensionAuth"

export async function GET(req: Request) {
  try {
    const origin = req.headers.get("origin")
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 })
    }
    const session = await getSessionWithFallback()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50)
    const status = searchParams.get("status") 
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { userId: session.user.id }
    if (status) {
      where.status = status
    }

    const [clips, total] = await Promise.all([
      db.clip.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          url: true,
          tags: true,
          status: true,
          metadata: true,
          createdAt: true,
        },
      }),
      db.clip.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      clips,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Clips retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve clips history." },
      { status: 500 }
    )
  }
}

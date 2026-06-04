import { NextResponse } from "next/server"
import { isOriginAllowed } from "@/lib/extensionAuth"
import {
  extensionOptionsResponse,
  withExtensionCors,
} from "@/lib/extensionCors"
import { getSessionWithFallback } from "@/auth"
import type { AuthMeResponse } from "@/types/auth"

export async function OPTIONS(req: Request) {
  return extensionOptionsResponse(req) ?? new NextResponse(null, { status: 405 })
}

export async function GET(req: Request) {
  try {
    const origin = req.headers.get("origin")
    if (origin && !isOriginAllowed(origin)) {
      return withExtensionCors(
        req,
        NextResponse.json({ error: "Forbidden origin" }, { status: 403 }),
      )
    }

    const session = await getSessionWithFallback()
    if (!session?.user?.id) {
      return withExtensionCors(
        req,
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      )
    }

    const body: AuthMeResponse = {
      user: {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      },
    }
    return withExtensionCors(req, NextResponse.json(body))
  } catch (error) {
    console.error("[auth/me] Error:", error)
    return withExtensionCors(
      req,
      NextResponse.json({ error: "Failed to fetch user" }, { status: 500 }),
    )
  }
}

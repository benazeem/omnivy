import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { isOriginAllowed } from "@/lib/extensionAuth"
import {
  extensionOptionsResponse,
  withExtensionCors,
} from "@/lib/extensionCors"
import type { WebSessionResponse } from "@/types/auth"

export async function OPTIONS(req: Request) {
  return extensionOptionsResponse(req) ?? new NextResponse(null, { status: 405 })
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin")
  if (origin && !isOriginAllowed(origin)) {
    return withExtensionCors(
      req,
      NextResponse.json({ error: "Forbidden origin" }, { status: 403 }),
    )
  }

  const session = await auth()
  const body: WebSessionResponse = { active: !!session?.user?.id }
  return withExtensionCors(req, NextResponse.json(body))
}

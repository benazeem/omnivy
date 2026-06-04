import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { isOriginAllowed } from "@/lib/extensionAuth"
import {
  extensionOptionsResponse,
  withExtensionCors,
} from "@/lib/extensionCors"
import {
  ALLOWED_EXTENSION_SCOPES,
  filterScopes,
  issueTokenPair,
  type ExtensionScope,
} from "@/lib/extensionTokens"
import type { TokenPairResponse } from "@/types/auth"

export async function OPTIONS(req: Request) {
  return extensionOptionsResponse(req) ?? new NextResponse(null, { status: 405 })
}

export async function POST(req: Request) {
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

    const reqBody = await req.json().catch(() => ({}))
    const requestedScopes: string[] = Array.isArray(reqBody?.scopes)
      ? reqBody.scopes
      : ["clip:create"]

    const scopes = filterScopes(requestedScopes)
    if (scopes.length === 0) {
      return withExtensionCors(
        req,
        NextResponse.json(
          { error: "No valid scopes requested" },
          { status: 400 },
        ),
      )
    }

    const effectiveScopes: ExtensionScope[] =
      scopes.length > 0 ? scopes : [...ALLOWED_EXTENSION_SCOPES]

    const tokens = await issueTokenPair(session.user.id, effectiveScopes)

    const body: TokenPairResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresIn: tokens.refreshExpiresIn,
    }
    return withExtensionCors(req, NextResponse.json(body))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : ""
    console.error("Extension token issuance failure:", {
      message: errorMessage,
      stack: errorStack,
      userId: (error as any)?.userId,
    })
    
    const message =
      errorMessage.includes("EXTENSION_JWT_SECRET")
        ? "Server misconfiguration"
        : "Failed to issue extension token"
    
    return withExtensionCors(
      req,
      NextResponse.json({ error: message }, { status: 500 }),
    )
  }
}

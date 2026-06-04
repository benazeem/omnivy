import { NextResponse } from "next/server"
import { isOriginAllowed } from "@/lib/extensionAuth"
import {
  extensionOptionsResponse,
  withExtensionCors,
} from "@/lib/extensionCors"
import {
  ALLOWED_EXTENSION_SCOPES,
  filterScopes,
  getBearerToken,
  issueTokenPair,
  verifyRefreshToken,
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

    const reqBody = await req.json().catch(() => ({}))
    const refreshToken =
      (typeof reqBody?.refreshToken === "string" ? reqBody.refreshToken : null) ||
      getBearerToken(req)

    if (!refreshToken) {
      return withExtensionCors(
        req,
        NextResponse.json(
          { error: "Refresh token required" },
          { status: 400 },
        ),
      )
    }

    const payload = await verifyRefreshToken(refreshToken)
    if (!payload?.sub) {
      return withExtensionCors(
        req,
        NextResponse.json(
          { error: "Invalid or expired refresh token" },
          { status: 401 },
        ),
      )
    }

    const requestedScopes: string[] = Array.isArray(reqBody?.scopes)
      ? reqBody.scopes
      : [...ALLOWED_EXTENSION_SCOPES]

    const scopes = filterScopes(requestedScopes)
    const effectiveScopes: ExtensionScope[] =
      scopes.length > 0 ? scopes : [...ALLOWED_EXTENSION_SCOPES]

    const tokens = await issueTokenPair(payload.sub, effectiveScopes)

    const body: TokenPairResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresIn: tokens.refreshExpiresIn,
    }
    return withExtensionCors(req, NextResponse.json(body))
  } catch (error) {
    console.error("[auth/refresh] Error:", error)
    return withExtensionCors(
      req,
      NextResponse.json(
        { error: "Failed to refresh session" },
        { status: 500 },
      ),
    )
  }
}

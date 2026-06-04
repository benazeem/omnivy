import { SignJWT, jwtVerify } from "jose"
import { db } from "./database"
import type {
  ExtensionAccessPayload,
  ExtensionRefreshPayload,
  ExtensionScope,
} from "../types/extension"

export {
  ALLOWED_EXTENSION_SCOPES,
  type ExtensionScope,
  type ExtensionAccessPayload,
  type ExtensionRefreshPayload,
} from "../types/extension"

const SECRET = process.env.EXTENSION_JWT_SECRET
const ACCESS_TTL = parseInt(process.env.EXTENSION_ACCESS_TTL || "900", 10)
const REFRESH_TTL = parseInt(process.env.EXTENSION_REFRESH_TTL || "2592000", 10)
const MAX_ACCESS_TTL = parseInt(process.env.EXTENSION_TOKEN_MAX_TTL || "1800", 10)

function getSecretKey(): Uint8Array {
  if (!SECRET) throw new Error("Missing EXTENSION_JWT_SECRET")
  return new TextEncoder().encode(SECRET)
}

export function filterScopes(requested: string[]): ExtensionScope[] {
  const allowed = ["clip:create", "providers:status", "clips:read"] as const
  return requested.filter((s): s is ExtensionScope =>
    (allowed as readonly string[]).includes(s),
  )
}

export async function getUserTokenVersion(userId: string): Promise<number> {
  try {
    if (!userId) {
      console.warn("[Token] Missing userId for token version lookup")
      return 0
    }
    const user = await db.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { extensionTokenVersion: true },
    })
    return user?.extensionTokenVersion ?? 0
  } catch (error) {
    console.error("[Token] Failed to fetch user token version:", error)
    return 0
  }
}

export async function isTokenVersionValid(
  userId: string,
  tokenVersion: number | undefined,
): Promise<boolean> {
  try {
    const current = await getUserTokenVersion(userId)
    return tokenVersion === current
  } catch (error) {
    console.error("[Token] Token version validation error:", error)
     return true
  }
}

export async function issueTokenPair(
  userId: string,
  scopes: ExtensionScope[],
  accessTtlSeconds = ACCESS_TTL,
): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}> {
  const tv = await getUserTokenVersion(userId)
  const ttl = Math.min(accessTtlSeconds, MAX_ACCESS_TTL)
  const now = Math.floor(Date.now() / 1000)
  const key = getSecretKey()

  const accessToken = await new SignJWT({
    sub: userId,
    scope: scopes,
    type: "access",
    plan: "free",
    tv,
  } satisfies ExtensionAccessPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + ttl)
    .sign(key)

  const refreshToken = await new SignJWT({
    sub: userId,
    type: "refresh",
    tv,
  } satisfies ExtensionRefreshPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + REFRESH_TTL)
    .sign(key)

  return {
    accessToken,
    refreshToken,
    expiresIn: ttl,
    refreshExpiresIn: REFRESH_TTL,
  }
}

export async function verifyAccessToken(
  token: string,
): Promise<ExtensionAccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (payload.type !== "access" || !payload.sub) return null
    const valid = await isTokenVersionValid(
      payload.sub as string,
      payload.tv as number | undefined,
    )
    if (!valid) return null
    return payload as ExtensionAccessPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<ExtensionRefreshPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (payload.type !== "refresh" || !payload.sub) return null
    const valid = await isTokenVersionValid(
      payload.sub as string,
      payload.tv as number | undefined,
    )
    if (!valid) return null
    return payload as ExtensionRefreshPayload
  } catch {
    return null
  }
}

export function getBearerToken(req: Request): string | null {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return auth.slice(7).trim() || null
}

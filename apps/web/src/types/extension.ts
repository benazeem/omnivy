import type { JWTPayload } from "jose"

export const ALLOWED_EXTENSION_SCOPES = [
  "clip:create",
  "providers:status",
  "clips:read",
] as const

export type ExtensionScope = (typeof ALLOWED_EXTENSION_SCOPES)[number]

export interface ExtensionAccessPayload extends JWTPayload {
  sub: string
  scope?: string[]
  type: "access"
  plan?: string
  tv?: number
}

export interface ExtensionRefreshPayload extends JWTPayload {
  sub: string
  type: "refresh"
  tv?: number
}

import { getSiteUrl } from "./site"

export function getAllowedExtensionOrigins(): string[] {
  const raw = process.env.EXTENSION_ALLOWED_ORIGINS || ""
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}

export function getTrustedOrigins(): string[] {
  const allowed = getAllowedExtensionOrigins()
    const appUrl = getSiteUrl()
  if (appUrl) {
    allowed.push(appUrl)
  }
  
  return Array.from(new Set(allowed))
}

export function isOriginAllowed(origin: string | null | undefined): boolean {
  if (!origin) return true  
  
  if (process.env.NODE_ENV === "development" && origin.startsWith("chrome-extension://")) {
    return true
  }

  const trusted = getTrustedOrigins()
  return trusted.includes(origin)
}


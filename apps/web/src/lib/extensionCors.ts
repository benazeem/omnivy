import { NextResponse } from "next/server"
import { isOriginAllowed } from "./extensionAuth"

export function extensionCorsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin
    headers["Access-Control-Allow-Credentials"] = "true"
  }

  return headers
}

export function extensionOptionsResponse(req: Request): NextResponse | null {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: extensionCorsHeaders(req.headers.get("origin")),
    })
  }
  return null
}

export function withExtensionCors(
  req: Request,
  response: NextResponse,
): NextResponse {
  const cors = extensionCorsHeaders(req.headers.get("origin"))
  for (const [key, value] of Object.entries(cors)) {
    response.headers.set(key, value)
  }
  return response
}

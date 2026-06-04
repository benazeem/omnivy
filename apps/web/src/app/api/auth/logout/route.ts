import { NextResponse } from "next/server"
import { auth, signOut } from "@/auth"
import { db } from "@/lib/database"
import { isOriginAllowed } from "@/lib/extensionAuth"
import {
  extensionOptionsResponse,
  withExtensionCors,
} from "@/lib/extensionCors"
import type { LogoutResponse } from "@/types/auth"

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
 
    const session = await auth()
    
    if (session?.user?.id) {
      const userId = session.user.id
       
      await db.providerConnection.updateMany({
        where: { userId },
        data: { status: "revoked" },
      })
    }
 
    await signOut({ redirect: false })

    const body: LogoutResponse = { success: true }
     
    if (origin && isOriginAllowed(origin)) {
      return withExtensionCors(req, NextResponse.json(body))
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 },
    )
  }
}

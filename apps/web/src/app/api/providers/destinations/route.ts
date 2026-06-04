import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { db } from "@/lib/database"

export async function GET(req: Request) {
  const session = await getSessionWithFallback()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const provider = searchParams.get("provider")

  const where: any = { userId: session.user.id }
  if (provider) {
    where.provider = provider
  }

  const destinations = await db.providerDestination.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ destinations })
}

export async function POST(req: Request) {
  const session = await getSessionWithFallback()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { provider, resourceId, resourceType, name, metadata } = body

  if (!provider || !resourceId || !resourceType || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const dest = await db.providerDestination.upsert({
    where: {
      userId_provider_resourceId: {
        userId: session.user.id,
        provider,
        resourceId,
      },
    },
    update: {
      resourceType,
      name,
      metadata,
    },
    create: {
      userId: session.user.id,
      provider,
      resourceId,
      resourceType,
      name,
      metadata,
    },
  })

  return NextResponse.json({ success: true, destination: dest })
}

export async function DELETE(req: Request) {
  const session = await getSessionWithFallback()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { provider, resourceId } = body

  if (!provider || !resourceId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  await db.providerDestination.delete({
    where: {
      userId_provider_resourceId: {
        userId: session.user.id,
        provider,
        resourceId,
      },
    },
  })

  return NextResponse.json({ success: true })
}

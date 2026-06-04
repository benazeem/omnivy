import { NextResponse } from 'next/server'
import { getSessionWithFallback } from '@/auth'
import { db } from '@/lib/database'
import { isOriginAllowed } from '@/lib/extensionAuth'
import { decrypt, encrypt } from '@/lib/encryption'
import { GoogleDriveProvider } from '@/lib/oauth/GoogleDriveProvider'
import { OneDriveProvider } from '@/lib/oauth/OneDriveProvider'
import { DropboxProvider } from '@/lib/oauth/DropboxProvider'
import { NotionProvider } from '@/lib/oauth/NotionProvider'
import { ClipSaveSchema } from '@/lib/validation/schemas'

const PROVIDERS = {
  gdrive: new GoogleDriveProvider(),
  onedrive: new OneDriveProvider(),
  dropbox: new DropboxProvider(),
  notion: new NotionProvider(),
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin')
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 })
    }

    const session = await getSessionWithFallback()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('payload for saving to cloud', body)
    const parsed = ClipSaveSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid Payload', details: parsed.error.format() },
        { status: 400 },
      )
    }

    const {
      title,
      content,
      url,
      tags,
      provider: providerName,
      folderId,
    } = parsed.data
    console.log(
      {
        content,
        url,
        tags,
        provider: providerName,
        folderId,
      },
      'saving payload',
    )

    const connection = await db.providerConnection.findUnique({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: providerName,
        },
      },
      include: { encryptedToken: true },
    })

    if (!connection || !connection.encryptedToken) {
      return NextResponse.json(
        { error: `Provider ${providerName} is not connected.` },
        { status: 404 },
      )
    }

    const providerClient = PROVIDERS[providerName]
    const decryptedAccessToken = decrypt(
      connection.encryptedToken.encryptedAccessToken,
      connection.encryptedToken.iv,
      connection.encryptedToken.tag,
    )
 
    let result: any = null
    let syncError: any = null
    try {
      result = await providerClient.saveClip(decryptedAccessToken, {
        title,
        content,
        url,
        tags,
        folderId,
      })
    } catch (err: any) { 
      if (connection.encryptedToken.encryptedRefreshToken) {
        let decryptedRefreshToken = ''
        const parts = connection.encryptedToken.encryptedRefreshToken.split(':')

        if (parts.length === 3) {
          const [rIv, rTag, rData] = parts
          decryptedRefreshToken = decrypt(rData, rIv, rTag)
        } else {
          try {
            decryptedRefreshToken = decrypt(
              connection.encryptedToken.encryptedRefreshToken,
              connection.encryptedToken.iv,
              connection.encryptedToken.tag,
            )
          } catch (e) {
            throw new Error(
              `Token encryption data is corrupted. Please reconnect ${providerName} in Settings.`,
            )
          }
        }

        const freshTokens = await providerClient.refreshToken(
          decryptedRefreshToken,
        )
 
        const {
          encryptedData: encAccess,
          iv,
          tag,
        } = encrypt(freshTokens.accessToken)
        let encRefresh = connection.encryptedToken.encryptedRefreshToken 
        if (freshTokens.refreshToken) {
          const r = encrypt(freshTokens.refreshToken)
          encRefresh = `${r.iv}:${r.tag}:${r.encryptedData}`
        }
 
        await db.encryptedToken.update({
          where: { connectionId: connection.id },
          data: {
            encryptedAccessToken: encAccess,
            encryptedRefreshToken: encRefresh,
            iv,
            tag,
            expiresAt: freshTokens.expiresAt,
          },
        })
 
        try {
          result = await providerClient.saveClip(freshTokens.accessToken, {
            title,
            content,
            url,
            tags,
            folderId,
          })
        } catch (retryErr) {
          syncError = retryErr
        }
      } else {
        syncError = err
      }
    }
 
    await db.clip.create({
      data: {
        userId: session.user.id,
        title,
        content,
        url,
        tags,
        status: syncError ? 'failed' : 'synced',
        metadata: syncError
          ? { error: syncError.message }
          : { remoteId: result?.remoteId },
      },
    })
 
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'clip_save',
        details: {
          provider: providerName,
          remoteId: result?.remoteId,
          success: !syncError,
          error: syncError?.message,
        },
      },
    })

    if (syncError) {
      if (providerName === 'onedrive') {
        return NextResponse.json({
          success: true,
          localSaved: true,
          syncError: syncError.message,
          message: 'Saved locally, but OneDrive sync failed.'
        })
      }
      throw syncError
    }

    return NextResponse.json({ success: true, remoteId: result.remoteId })
  } catch (error: any) {
    console.error('Critical Web Sync Failure:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process web clipping request.' },
      { status: 500 },
    )
  }
}

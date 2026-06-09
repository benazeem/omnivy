import { NextResponse } from 'next/server'
import { getSessionWithFallback } from '@/auth'
import { db } from '@/lib/database'
import { decrypt, encrypt } from '@/lib/encryption'
import { isOriginAllowed } from '@/lib/extensionAuth'
import { GoogleDriveProvider } from '@/lib/oauth/GoogleDriveProvider'
import { OneDriveProvider } from '@/lib/oauth/OneDriveProvider'
import { DropboxProvider } from '@/lib/oauth/DropboxProvider'
import { NotionProvider } from '@/lib/oauth/NotionProvider'

const PROVIDERS = {
  gdrive: new GoogleDriveProvider(),
  onedrive: new OneDriveProvider(),
  dropbox: new DropboxProvider(),
  notion: new NotionProvider(),
}

type ProviderName = keyof typeof PROVIDERS

function isProvider(value: string | null): value is ProviderName {
  return value === 'gdrive' || value === 'onedrive' || value === 'dropbox' || value === 'notion'
}

export async function GET(request: Request) {
  try {
    const origin = request.headers.get('origin')
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 })
    }

    const session = await getSessionWithFallback()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')
    if (!isProvider(provider)) {
      return NextResponse.json({ error: 'Supported provider required' }, { status: 400 })
    }

    const connection = await db.providerConnection.findUnique({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider,
        },
      },
      include: { encryptedToken: true },
    })

    if (!connection || connection.status !== 'active' || !connection.encryptedToken) {
      return NextResponse.json({ error: 'Provider not connected' }, { status: 404 })
    }

    const token = connection.encryptedToken
    let accessToken = decrypt(
      token.encryptedAccessToken,
      token.iv,
      token.tag,
    )

    try {
      return NextResponse.json(await fetchProviderUserInfo(provider, accessToken))
    } catch (initialError) {
      if (!token.encryptedRefreshToken) throw initialError

      let refreshToken = ''
      const refreshParts = token.encryptedRefreshToken.split(':')
      if (refreshParts.length === 3) {
        const [iv, tag, encryptedData] = refreshParts
        refreshToken = decrypt(encryptedData, iv, tag)
      } else {
        refreshToken = decrypt(token.encryptedRefreshToken, token.iv, token.tag)
      }

      const refreshed = await PROVIDERS[provider].refreshToken(refreshToken)
      const encryptedAccess = encrypt(refreshed.accessToken)
      let encryptedRefresh = token.encryptedRefreshToken

      if (refreshed.refreshToken) {
        const nextRefresh = encrypt(refreshed.refreshToken)
        encryptedRefresh = `${nextRefresh.iv}:${nextRefresh.tag}:${nextRefresh.encryptedData}`
      }

      await db.encryptedToken.update({
        where: { connectionId: connection.id },
        data: {
          encryptedAccessToken: encryptedAccess.encryptedData,
          encryptedRefreshToken: encryptedRefresh,
          iv: encryptedAccess.iv,
          tag: encryptedAccess.tag,
          expiresAt: refreshed.expiresAt,
        },
      })

      accessToken = refreshed.accessToken
      return NextResponse.json(await fetchProviderUserInfo(provider, accessToken))
    }
  } catch (error) {
    console.error('Provider userinfo retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve provider user info.' },
      { status: 500 },
    )
  }
}

async function fetchProviderUserInfo(provider: ProviderName, accessToken: string) {
  if (provider === 'gdrive') return fetchGoogleDriveUserInfo(accessToken)
  if (provider === 'onedrive') return fetchOneDriveUserInfo(accessToken)
  if (provider === 'dropbox') return fetchDropboxUserInfo(accessToken)
  return fetchNotionUserInfo(accessToken)
}

async function fetchGoogleDriveUserInfo(accessToken: string) {
  const res = await fetch(
    'https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress,photoLink,permissionId)',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )

  if (!res.ok) {
    throw new Error(`Google Drive userinfo failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const user = data.user || {}
  return {
    id: user.permissionId || '',
    name: user.displayName || '',
    email: user.emailAddress || '',
    picture: user.photoLink || null,
  }
}

async function fetchOneDriveUserInfo(accessToken: string) {
  const meRes = await fetch('https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (meRes.ok) {
    const data = await meRes.json()
    return {
      id: data.id || '',
      name: data.displayName || '',
      displayName: data.displayName || '',
      email: data.mail || data.userPrincipalName || '',
      mail: data.mail || data.userPrincipalName || '',
      picture: null,
    }
  }

  const driveRes = await fetch('https://graph.microsoft.com/v1.0/me/drive?$select=id,owner', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!driveRes.ok) {
    throw new Error(`OneDrive userinfo failed: ${driveRes.status} ${await driveRes.text()}`)
  }

  const data = await driveRes.json()
  const owner = data.owner?.user || {}
  return {
    id: owner.id || data.id || '',
    name: owner.displayName || '',
    displayName: owner.displayName || '',
    email: owner.email || '',
    mail: owner.email || '',
    picture: null,
  }
}

async function fetchDropboxUserInfo(accessToken: string) {
  const res = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    throw new Error(`Dropbox userinfo failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  return {
    id: data.account_id || '',
    account_id: data.account_id || '',
    name: data.name?.display_name || data.name?.familiar_name || '',
    email: data.email || '',
    picture: data.profile_photo_url || null,
    profile_photo_url: data.profile_photo_url || null,
  }
}

async function fetchNotionUserInfo(accessToken: string) {
  const res = await fetch('https://api.notion.com/v1/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  if (!res.ok) {
    throw new Error(`Notion userinfo failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  return {
    id: data.id || '',
    name: data.name || data.bot?.owner?.user?.name || 'Notion workspace',
    displayName: data.name || data.bot?.owner?.user?.name || 'Notion workspace',
    email: data.person?.email || data.bot?.owner?.user?.person?.email || '',
    mail: data.person?.email || data.bot?.owner?.user?.person?.email || '',
    picture: data.avatar_url || data.bot?.owner?.user?.avatar_url || null,
  }
}

import {
  BaseOAuthProvider,
  OAuthTokenPayload,
  ClipPayload,
} from './BaseOAuthProvider'
import { sanitizeFilename } from '../utils'
import { getSiteUrl } from '../site'

export class OneDriveProvider implements BaseOAuthProvider {
  private clientId = process.env.ONEDRIVE_CLIENT_ID || ''
  private clientSecret = process.env.ONEDRIVE_CLIENT_SECRET || ''
  private get redirectUri(): string {
    return `${getSiteUrl()}/api/providers/callback/onedrive`
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'files.readwrite offline_access',
      state,
    })
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<OAuthTokenPayload> {
    const tokenUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/token`

    const body = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    })

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(
        `[OneDrive] Token exchange failed (${res.status}):`,
        errorBody,
      )
      throw new Error(
        `OneDrive Token exchange failed (${res.status}): ${errorBody}`,
      )
    }
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: (data.scope || '').split(' '),
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenPayload> {
    const res = await fetch(
      `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      },
    )

    if (!res.ok) {
      throw new Error(`OneDrive Token refresh failed: ${await res.text()}`)
    }
    const data = await res.json()

    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: (data.scope || '').split(' '),
    }
  }

  async saveClip(
    accessToken: string,
    payload: ClipPayload,
  ): Promise<{ success: boolean; remoteId: string }> {
    const sanitizedTitle = sanitizeFilename(payload.title)
    const filename = `${sanitizedTitle}.md`

    const fileContent = `---
title: "${payload.title}"
source: "${payload.url || 'Web Clipper'}"
tags: [${payload.tags?.map((t) => `"${t}"`).join(', ') || ''}]
created_at: "${new Date().toISOString()}"
---

${payload.content}`

    const uploadToPath = async (onedrivePath: string): Promise<string> => {
      const url = `https://graph.microsoft.com/v1.0/me${onedrivePath}`
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/plain',
        },
        body: fileContent,
      })

      if (!res.ok) {
        throw new Error(
          `OneDrive upload failed to ${onedrivePath}: ${await res.text()}`,
        )
      }
      const data = await res.json()
      return data.id
    }

    const omnivyPath = `/drive/root:/Omnivy Web Clips/${filename}:/content`

    if (payload.folderId) {
      try {
        const folderRes = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${payload.folderId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        )

        if (folderRes.ok) {
          const folderData = await folderRes.json()
          let parentPath = ''

          if (folderData.parentReference?.path) {
            const parts = folderData.parentReference.path.split(':/')
            if (parts.length > 1) {
              parentPath = parts[1]
            } else {
              const driveRootParts =
                folderData.parentReference.path.split('/drive/root:')
              if (driveRootParts.length > 1) {
                parentPath = driveRootParts[1]
              }
            }
          }

          const targetFolderPath = parentPath
            ? `${parentPath}/${folderData.name}`
            : folderData.name

          const targetPath = `/drive/root:/${targetFolderPath}/${filename}:/content`
          console.log(
            `[OneDrive] Attempting upload to resolved path: ${targetPath}`,
          )

          const remoteId = await uploadToPath(targetPath)
          return { success: true, remoteId }
        } else {
          console.warn(
            `[OneDrive] Failed to resolve folder ID ${payload.folderId}, status: ${folderRes.status}. Falling back to /Omnivy Web Clips.`,
          )
        }
      } catch (err) {
        console.warn(
          `[OneDrive] Error resolving folder ${payload.folderId}. Falling back to /Omnivy Web Clips.`,
          err,
        )
      }
    }

    console.log(`[OneDrive] Uploading to fallback path: ${omnivyPath}`)
    const remoteId = await uploadToPath(omnivyPath)
    return { success: true, remoteId }
  }
}

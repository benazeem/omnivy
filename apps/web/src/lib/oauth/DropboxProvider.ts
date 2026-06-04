import {
  BaseOAuthProvider,
  OAuthTokenPayload,
  ClipPayload,
} from './BaseOAuthProvider'
import { sanitizeFilename } from '../utils'

export class DropboxProvider implements BaseOAuthProvider {
  private clientId = process.env.DROPBOX_CLIENT_ID || ''
  private clientSecret = process.env.DROPBOX_CLIENT_SECRET || ''
  private redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/providers/callback/dropbox`

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      token_access_type: 'offline',
      state,
    })
    return `https://www.dropbox.com/oauth2/authorize?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<OAuthTokenPayload> {
    const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!res.ok) {
      throw new Error(`Dropbox Token exchange failed: ${await res.text()}`)
    }
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: [],
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenPayload> {
    const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!res.ok) {
      throw new Error(`Dropbox Token refresh failed: ${await res.text()}`)
    }
    const data = await res.json()

    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: [],
    }
  }

  async saveClip(
    accessToken: string,
    payload: ClipPayload,
  ): Promise<{ success: boolean; remoteId: string }> {
    const sanitizedTitle = sanitizeFilename(payload.title)

    let path = `/Omnivy Web Clips/${sanitizedTitle}.md`
    if (payload.folderId) { 
      path = `${payload.folderId}/${sanitizedTitle}.md`
    } else { 
      try {
        const metaRes = await fetch('https://api.dropboxapi.com/2/files/get_metadata', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/Omnivy Web Clips', include_deleted: false }),
        })

        if (!metaRes.ok) { 
          const createRes = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: '/Omnivy Web Clips', autorename: false }),
          })

          if (!createRes.ok) {
            console.warn('[Dropbox] Failed to create /Omnivy Web Clips folder:', await createRes.text())
          }
        }
      } catch (err) {
        console.warn('[Dropbox] Error ensuring /Omnivy Web Clips folder exists:', err)
      }
    }

    const fileContent = `---
title: "${payload.title}"
source: "${payload.url || 'Web Clipper'}"
tags: [${payload.tags?.map((t) => `"${t}"`).join(', ') || ''}]
created_at: "${new Date().toISOString()}"
---

${payload.content}`

    const dropboxArgs = {
      path,
      mode: 'overwrite',
      autorename: true,
      mute: false,
    }

    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify(dropboxArgs),
        'Content-Type': 'application/octet-stream',
      },
      body: fileContent,
    })

    if (!res.ok) {
      throw new Error(`Dropbox upload failed: ${await res.text()}`)
    }
    const file = await res.json()

    return { success: true, remoteId: file.id }
  }
}

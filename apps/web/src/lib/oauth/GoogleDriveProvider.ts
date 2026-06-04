import { BaseOAuthProvider, OAuthTokenPayload, ClipPayload } from "./BaseOAuthProvider"
import { sanitizeFilename } from "../utils"

export class GoogleDriveProvider implements BaseOAuthProvider {
  private clientId = process.env.GOOGLE_CLIENT_ID || ""
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET || ""
  private redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/providers/callback/gdrive`

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly",
      access_type: "offline",
      prompt: "consent",
      state,
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<OAuthTokenPayload> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!res.ok) {
      throw new Error(`Google code exchange failed: ${await res.text()}`)
    }
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: (data.scope || "").split(" "),
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenPayload> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })

    if (!res.ok) {
      throw new Error(`Google token refresh failed: ${await res.text()}`)
    }
    const data = await res.json()

    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: (data.scope || "").split(" "),
    }
  }

  async saveClip(
    accessToken: string,
    payload: ClipPayload
  ): Promise<{ success: boolean; remoteId: string }> {
    const fileMetadata: any = {
      name: `${sanitizeFilename(payload.title)}.md`,
      mimeType: "text/markdown",
    }

    if (payload.folderId) {
      fileMetadata.parents = [payload.folderId]
    } else {
      try {
        const folderId = await this.getOrCreateFolder(accessToken, "Omnivy Web Clips")
        fileMetadata.parents = [folderId]
      } catch (err) {
        console.warn("[Google Drive] Failed to get/create 'Omnivy Web Clips' folder, saving to root:", err)
      }
    }

    const fileContent = `---
title: "${payload.title}"
source: "${payload.url || "Web Clipper"}"
tags: [${payload.tags?.map((t) => `"${t}"`).join(", ") || ""}]
created_at: "${new Date().toISOString()}"
---

${payload.content}`

    const boundary = "omnivy_gdrive_upload_boundary"
    const delimiter = `\r\n--${boundary}\r\n`
    const closeDelimiter = `\r\n--${boundary}--`

    const body =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(fileMetadata) +
      delimiter +
      "Content-Type: text/markdown\r\n\r\n" +
      fileContent +
      closeDelimiter

    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    )

    if (!res.ok) {
      throw new Error(`Google Drive write operation failed: ${await res.text()}`)
    }
    const file = await res.json()

    return { success: true, remoteId: file.id }
  }

  private async getOrCreateFolder(accessToken: string, folderName: string): Promise<string> {
    const query = encodeURIComponent(`name='${folderName}' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false`)
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (searchRes.ok) {
      const searchData = await searchRes.json()
      if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id
      }
    }

    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: ["root"],
      }),
    })

    if (!createRes.ok) {
      throw new Error(`Failed to create Google Drive folder '${folderName}': ${await createRes.text()}`)
    }

    const createData = await createRes.json()
    return createData.id
  }
}

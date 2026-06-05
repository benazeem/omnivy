import { getSiteUrl } from "../site"
import { BaseOAuthProvider, OAuthTokenPayload, ClipPayload } from "./BaseOAuthProvider"

export class NotionProvider implements BaseOAuthProvider {
  private clientId = process.env.NOTION_CLIENT_ID || ""
  private clientSecret = process.env.NOTION_CLIENT_SECRET || ""
 private get redirectUri(): string {
     return `${getSiteUrl()}/api/providers/callback/notion`}

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      owner: "user",
      state,
    })
    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<OAuthTokenPayload> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")
    const res = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
      }),
    })

    if (!res.ok) {
      throw new Error(`Notion Access Token exchange failed: ${await res.text()}`)
    }
    const data = await res.json()

    return {
      accessToken: data.access_token, 
      expiresAt: undefined,
      scopes: [],
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenPayload> { 
    return { accessToken: refreshToken, scopes: [] }
  }

  async saveClip(
    accessToken: string,
    payload: ClipPayload
  ): Promise<{ success: boolean; remoteId: string }> {
    const destinationId = payload.folderId
    if (!destinationId) {
      throw new Error("Configuration Error: No Notion destination selected.")
    }

    let resourceType = "notion_database"
    let resourceId = destinationId
 
    if (destinationId.includes(":")) {
      const parts = destinationId.split(":")
      resourceType = parts[0]
      resourceId = parts.slice(1).join(":")
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    }

    let body: any = {}

    if (resourceType === "notion_page") {
 
      body = {
        parent: { page_id: resourceId },
        properties: {
          title: {
            title: [{ text: { content: payload.title } }],
          },
        },
      }
    } else { 
      const dbRes = await fetch(`https://api.notion.com/v1/databases/${resourceId}`, {
        headers,
      })
      if (!dbRes.ok) {
        throw new Error(`Failed to fetch Notion database schema: ${await dbRes.text()}`)
      }
      const dbData = await dbRes.json()
      const props = dbData.properties

      const safeProperties: any = {}
 
      const titlePropKey = Object.keys(props).find(k => props[k].type === "title")
      if (titlePropKey) {
        safeProperties[titlePropKey] = {
          title: [{ text: { content: payload.title } }],
        }
      }
 
      if (payload.url) {
        const urlPropKey = Object.keys(props).find(k => props[k].type === "url")
        if (urlPropKey) {
          safeProperties[urlPropKey] = { url: payload.url }
        }
      }
 
      if (payload.tags && payload.tags.length > 0) {
        const tagsPropKey = Object.keys(props).find(k => props[k].type === "multi_select")
        if (tagsPropKey) {
          safeProperties[tagsPropKey] = {
            multi_select: payload.tags.map(t => ({ name: t }))
          }
        }
      }

      body = {
        parent: { database_id: resourceId },
        properties: safeProperties,
      }
    }
 
    body.children = [
      {
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [{ text: { content: payload.title } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              text: {
                content: payload.content.slice(0, 2000),  
              },
            },
          ],
        },
      },
    ]

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`Notion save failed: ${await res.text()}`)
    }
    const page = await res.json()

    return { success: true, remoteId: page.id }
  }
}

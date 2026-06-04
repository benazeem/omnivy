export interface OAuthTokenPayload {
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  scopes: string[]
}

export interface ClipPayload {
  title: string
  content: string
  url?: string
  tags?: string[]
  folderId?: string
}

export interface BaseOAuthProvider {
   
  getAuthUrl(state: string): string

  exchangeCode(code: string): Promise<OAuthTokenPayload>

  refreshToken(refreshToken: string): Promise<OAuthTokenPayload>

  saveClip(
    accessToken: string,
    payload: ClipPayload
  ): Promise<{ success: boolean; remoteId: string }>
}

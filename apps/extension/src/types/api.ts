export interface ApiResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

export interface ClipPayload {
  title: string
  content: string
  url?: string
  tags?: string[]
  provider: 'gdrive' | 'onedrive' | 'dropbox' | 'notion'
  folderId?: string
  fromUI?: boolean
}

export interface ProviderConnection {
  provider: string
  status: string
  scopes: string[]
  updatedAt: string
}

export interface ClipRecord {
  id: string
  title: string
  url: string | null
  tags: string[]
  status: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface PaginatedClips {
  clips: ClipRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface StoredTokens {
  accessToken: string | null
  refreshToken: string | null
  accessExpiresAt: number | null
}

export interface ApiErrorResponse {
  error: string
}

export interface ProviderConnection {
  provider: string
  status: string
  scopes: string[]
  updatedAt: string
}

export interface ProviderStatusResponse {
  connections: ProviderConnection[]
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

export interface ClipsListResponse {
  clips: ClipRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

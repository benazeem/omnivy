 
import {
  clearAuthSession,
  clearAuthTokens,
  ensureAuthenticated,
  fetchInitialTokensFromWebSession,
  getAccessToken,
} from '@/services/auth/sessionAuth'
import type {
  ApiResponse,
  ClipPayload,
  PaginatedClips,
  ProviderConnection,
} from '@/types/api'

import { API_BASE_URL } from '@/config/api'

export type { ClipPayload } from '@/types/api'
 
export async function clearExtensionToken(): Promise<void> {
  return clearAuthTokens()
}

export async function fetchExtensionToken(
  _scopes: string[] = ['clip:create'],
): Promise<{ token: string | null; expiresIn: number | null }> {
  void _scopes
  const ok = await fetchInitialTokensFromWebSession()
  if (!ok) {
    await clearAuthSession()
    return { token: null, expiresIn: null }
  }
  const token = await getAccessToken()
  return { token, expiresIn: token ? 900 : null }
}

async function getSessionToken(): Promise<string | null> {
  const session = await ensureAuthenticated()
  if (!session.authenticated) return null
  return getAccessToken()
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  let token = await getSessionToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (!res.ok) {
      if (res.status === 401) {
       
        const session = await ensureAuthenticated()
        if (session.authenticated) {
          token = await getAccessToken()
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
            const retry = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
              credentials: 'include',
            })
            if (retry.ok) {
              const data = await retry.json()
              return { success: true, data }
            }
            const errData = await retry.json().catch(() => ({}))
            return {
              success: false,
              error:
                errData.error ||
                `API Error: ${retry.status} ${retry.statusText}`,
            }
          }
        }
      }

      const errorData = await res.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || `API Error: ${res.status} ${res.statusText}`,
      }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Network error. Please check your connection.'
    return { success: false, error: message }
  }
}

export async function saveClipToCloud(
  payload: ClipPayload,
): Promise<ApiResponse<{ remoteId: string }>> {
  return apiRequest('/api/clip/save', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getProviderStatus(): Promise<
  ApiResponse<{ connections: ProviderConnection[] }>
> {
  return apiRequest('/api/providers/status')
}

export async function getClipsHistory(
  page = 1,
  limit = 20,
  status?: string,
): Promise<ApiResponse<PaginatedClips>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  if (status) params.set('status', status)
  return apiRequest(`/api/clips?${params.toString()}`)
}

export async function checkAuthStatus(): Promise<boolean> {
  const session = await ensureAuthenticated()
  return session.authenticated
}

export async function loadFoldersFromProviders(
  provider?: string,
): Promise<
  ApiResponse<{
    folders: Record<string, unknown[]>
  }>
> {
  const url = provider
    ? `/api/providers/folders?provider=${provider}`
    : '/api/providers/folders'
  return apiRequest(url)
}

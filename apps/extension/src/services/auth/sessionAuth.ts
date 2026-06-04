 
import type {
  AuthMeResponse,
  AuthSession,
  AuthUser,
  TokenPairResponse,
} from '@/types/auth'
import type { StoredTokens } from '@/types/api'
import { API_BASE_URL } from '@/config/api'

const STORAGE_ACCESS_KEY = 'omnivy_access_token'
const STORAGE_REFRESH_KEY = 'omnivy_refresh_token'
const STORAGE_ACCESS_EXPIRY = 'omnivy_access_token_expiry'

const DEFAULT_SCOPES = ['clip:create', 'providers:status', 'clips:read'] as const
 
export const CLOUD_CACHE_KEYS = [
  'googleDriveConnection',
  'oneDriveConnection',
  'dropboxConnection',
  'notionConnection',
  'googleDriveFolders',
  'oneDriveFolders',
  'dropboxFolders',
  'notionFolders',
  'googleDriveUserInfo',
  'oneDriveUserInfo',
  'dropboxUserInfo',
  'notionUserInfo',
] as const

async function getStoredTokens(): Promise<StoredTokens> {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      [STORAGE_ACCESS_KEY, STORAGE_REFRESH_KEY, STORAGE_ACCESS_EXPIRY],
      (result) => {
        resolve({
          accessToken: result[STORAGE_ACCESS_KEY] || null,
          refreshToken: result[STORAGE_REFRESH_KEY] || null,
          accessExpiresAt: result[STORAGE_ACCESS_EXPIRY] || null,
        })
      },
    )
  })
}

async function setStoredTokens(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number,
): Promise<void> {
  const accessExpiresAt = Date.now() + expiresInSeconds * 1000
  return new Promise((resolve) => {
    chrome.storage.local.set(
      {
        [STORAGE_ACCESS_KEY]: accessToken,
        [STORAGE_REFRESH_KEY]: refreshToken,
        [STORAGE_ACCESS_EXPIRY]: accessExpiresAt,
        omnivy_extension_token: accessToken,
        omnivy_extension_token_expiry: accessExpiresAt,
      },
      resolve,
    )
  })
}

export async function clearAuthTokens(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(
      [
        STORAGE_ACCESS_KEY,
        STORAGE_REFRESH_KEY,
        STORAGE_ACCESS_EXPIRY,
        'omnivy_extension_token',
        'omnivy_extension_token_expiry',
      ],
      resolve,
    )
  })
}
 
export async function clearCloudConnectionCache(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      {
        googleDriveConnection: false,
        oneDriveConnection: false,
        dropboxConnection: false,
        notionConnection: false,
        googleDriveFolders: [],
        oneDriveFolders: [],
        dropboxFolders: [],
        notionFolders: [],
        googleDriveUserInfo: null,
        oneDriveUserInfo: null,
        dropboxUserInfo: null,
        notionUserInfo: null,
      },
      resolve,
    )
  })
}
 
export async function clearAuthSession(): Promise<void> {
  await clearAuthTokens()
  await clearCloudConnectionCache()
  try {
    chrome.runtime.sendMessage({ type: 'AUTH_SESSION_CLEARED' })
  } catch {
    /* no listeners */
  }
}

export async function getAccessToken(): Promise<string | null> {
  const stored = await getStoredTokens()
  return stored.accessToken
}

function isAccessTokenFresh(expiresAt: number | null): boolean {
  if (!expiresAt) return false
  return expiresAt - Date.now() > 60_000
}

async function fetchMe(accessToken: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return null
    const data = (await res.json()) as AuthMeResponse
    if (!data?.user?.id) return null
    return {
      id: data.user.id,
      name: data.user.name ?? null,
      email: data.user.email ?? null,
      image: data.user.image ?? null,
    }
  } catch {
    return null
  }
}

async function refreshTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken,
        scopes: [...DEFAULT_SCOPES],
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as TokenPairResponse
    const access = data.accessToken || data.token
    const refresh = data.refreshToken
    if (!access || !refresh || !data.expiresIn) return null
    await setStoredTokens(access, refresh, data.expiresIn)
    return {
      accessToken: access,
      refreshToken: refresh,
      expiresIn: data.expiresIn,
    }
  } catch {
    return null
  }
}

export async function fetchInitialTokensFromWebSession(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/extension/token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scopes: [...DEFAULT_SCOPES] }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as TokenPairResponse
    const access = data.accessToken || data.token
    const refresh = data.refreshToken
    if (!access || !refresh || !data.expiresIn) return false
    await setStoredTokens(access, refresh, data.expiresIn)
    return true
  } catch {
    return false
  }
}

export async function ensureAuthenticated(): Promise<AuthSession> {
  const stored = await getStoredTokens()

  if (stored.accessToken && isAccessTokenFresh(stored.accessExpiresAt)) {
    const user = await fetchMe(stored.accessToken)
    if (user) return { authenticated: true, user }
  }

  if (stored.refreshToken) {
    const refreshed = await refreshTokens(stored.refreshToken)
    if (refreshed) {
      const user = await fetchMe(refreshed.accessToken)
      if (user) return { authenticated: true, user }
    }
  }

  const issued = await fetchInitialTokensFromWebSession()
  if (issued) {
    const tokens = await getStoredTokens()
    if (tokens.accessToken) {
      const user = await fetchMe(tokens.accessToken)
      if (user) return { authenticated: true, user }
    }
  }
 
  return { authenticated: false, user: null }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
     
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        await clearAuthSession() 
        try {
          chrome.runtime.sendMessage({ type: 'LOGOUT' })
        } catch {
          /* no listeners */
        }
      }
    } else { 
      await clearAuthSession()
      try {
        chrome.runtime.sendMessage({ type: 'LOGOUT' })
      } catch {
        /* no listeners */
      }
    }
  } catch { 
    await clearAuthSession()
    try {
      chrome.runtime.sendMessage({ type: 'LOGOUT' })
    } catch {
      /* no listeners */
    }
  }
}

export function getSignInUrl(): string {
  return `${API_BASE_URL}/auth/signin?callbackUrl=${encodeURIComponent(`${API_BASE_URL}/profile`)}`
}

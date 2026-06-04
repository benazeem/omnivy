import { handleMessage } from './message-handler'
import { initContextMenu, handleContextMenuClick } from './context-menu'
import {
  loadFoldersFromProviders,
  getProviderStatus,
} from '@/services/api/saasClient'
import { clearCloudConnectionCache } from '@/services/auth/sessionAuth'
import { checkAuthStatus } from '@/services/api/saasClient'
import type { Folder, RawFolderNode } from '@/types'

let startupComplete = false

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function tryObtainExtensionToken(): Promise<boolean> {
  try {
    const ok = await checkAuthStatus()
    if (ok) {
      console.log('[Extension Auth] Server-side session active')
      return true
    }
  } catch (err) {
    console.warn('[Extension Auth] Error checking auth status:', err)
  }
  
  try {
    await clearCloudConnectionCache()
  } catch (err) {
    console.error('[Extension Auth] Failed to clear cloud cache:', err)
  }
  console.log('[Extension Auth] No valid server-side session; cleared cloud connection cache')
  return false
}


function normalizeFolders(rawFolders: RawFolderNode[] = []): Folder[] {
  return rawFolders.map((folder) => ({
    id: folder.id || '',
    name: folder.name || 'Untitled',
    path: folder.path || folder.path_display || `/${folder.name || 'Untitled'}`,
    folders: normalizeFolders(folder.folders || []),
  }))
}

export async function loadFoldersAsync(maxRetries = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const statusRes = await getProviderStatus()
      if (statusRes.success && statusRes.data?.connections) {
        const connections = statusRes.data.connections

        const gdriveConn = connections.find(
          (c) => c.provider === 'gdrive' && c.status === 'active',
        )
        const onedriveConn = connections.find(
          (c) => c.provider === 'onedrive' && c.status === 'active',
        )
        const dropboxConn = connections.find(
          (c) => c.provider === 'dropbox' && c.status === 'active',
        )
        const notionConn = connections.find(
          (c) => c.provider === 'notion' && c.status === 'active',
        )

        await chrome.storage.local.set({
          googleDriveConnection: !!gdriveConn,
          oneDriveConnection: !!onedriveConn,
          dropboxConnection: !!dropboxConn,
          notionConnection: !!notionConn,
        })

        console.log('[Extension] Synced provider connection statuses')
      }
 
      const result = await loadFoldersFromProviders()
      if (result.success && result.data?.folders) {
        const folders = result.data.folders as Record<string, RawFolderNode[]>
        if (folders.gdrive) {
          await chrome.storage.local.set({
            googleDriveFolders: normalizeFolders(folders.gdrive),
          })
        }
        if (folders.onedrive) {
          await chrome.storage.local.set({
            oneDriveFolders: normalizeFolders(folders.onedrive),
          })
        }
        if (folders.dropbox) {
          await chrome.storage.local.set({
            dropboxFolders: normalizeFolders(folders.dropbox),
          })
        }
        if (folders.notion) {
          await chrome.storage.local.set({
            notionFolders: normalizeFolders(folders.notion),
          })
        }
        console.log('[Extension] Loaded folders from all providers')
      }
      
      // If we made it here, success, so break out of retry loop
      return
    } catch (error) {
      console.warn(`[Extension] Failed to load folders (Attempt ${attempt}/${maxRetries}):`, error)
      if (attempt < maxRetries) {
        await delay(1000 * attempt) // Linear backoff
      } else {
        console.error('[Extension] Exhausted retries loading folders.')
      }
    }
  }
}

export async function runStartupSync(): Promise<void> {
  if (startupComplete) return
  startupComplete = true

  try {
    const authed = await tryObtainExtensionToken()
    if (!authed) return
 
    await loadFoldersAsync()
  } catch (err) {
    console.warn('[Extension] Startup sync failed:', err)
  }
}

export function resetStartupFlag(): void {
  startupComplete = false
}

export { handleMessage, initContextMenu, handleContextMenuClick }

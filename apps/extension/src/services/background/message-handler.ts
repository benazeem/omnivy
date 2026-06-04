import errorMessage from '@/utils/errorMessage'
import { store } from '@/store'
import {
  saveClipToCloud,
  getProviderStatus,
  loadFoldersFromProviders,
} from '../api/saasClient'
import {
  clearCloudConnectionCache,
  ensureAuthenticated,
  getAccessToken,
} from '../auth/sessionAuth'
import { API_BASE_URL } from '@/config/api'
import type { CloudStatusResponse, ProviderFolders, ProviderUserInfo, RawFolder } from '@/types'



function normalizeFolders(rawFolders: RawFolder[]): RawFolder[] {
  return (rawFolders || []).map((f: RawFolder) => ({
    id: f.id || '',
    name: f.name || 'Untitled',
    path: f.path || f.path_display || `/${f.name || 'Untitled'}`,
    folders: normalizeFolders(f.folders || []),
  }))
}

async function fetchProviderUserInfo(provider: string): Promise<ProviderUserInfo | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/providers/userinfo?provider=${provider}`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!res.ok) return null
    return (await res.json()) as ProviderUserInfo
  } catch {
    return null
  }
}

async function persistProviderUserInfo(provider: string) {
  const info = await fetchProviderUserInfo(provider)
  if (!info) return

  if (provider === 'gdrive') {
    await chrome.storage.local.set({
      googleDriveUserInfo: {
        id: info.id || '',
        name: info.name || '',
        email: info.email || '',
        picture: info.picture || null,
      },
    })
  }
  if (provider === 'onedrive') {
    await chrome.storage.local.set({
      oneDriveUserInfo: {
        id: info.id || '',
        name: info.displayName || info.name || '',
        email: info.mail || info.email || '',
        picture: info.picture || null,
      },
    })
  }
  if (provider === 'dropbox') {
    await chrome.storage.local.set({
      dropboxUserInfo: {
        id: info.account_id || info.id || '',
        name: info.name || '',
        email: info.email || '',
        picture: info.profile_photo_url || info.picture || null,
      },
    })
  }
  if (provider === 'notion') {
    await chrome.storage.local.set({
      notionUserInfo: {
        id: info.id || '',
        name: info.name || info.displayName || '',
        email: info.email || info.mail || '',
        picture: info.picture || null,
      },
    })
  }
}

type ExtensionMessage =
  | {
      type: 'SAVE_OBSIDIAN_FILE'
      payload: { content: string; path: string; vault?: string }
    }
  | { type: 'GET_VAULTS' }
  | {
      type: 'SAVE_TO_CLOUD'
      payload: {
        title: string
        content: string
        url?: string
        tags?: string[]
        provider: 'gdrive' | 'onedrive' | 'dropbox' | 'notion'
        folderId?: string
        fromUI?: boolean
      }
  }
  | { type: 'GET_CLOUD_STATUS' }
  | { type: 'LOAD_PROVIDER_FOLDERS' }
  | { type: 'LOGOUT' }

export async function handleMessage(
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
): Promise<void> {
  try {
    let response

    switch (message.type) {
      case 'SAVE_OBSIDIAN_FILE':
        response = await saveMarkdown(message.payload)
        break

      case 'GET_VAULTS': {
        const state = store.getState()
        response = { success: true, data: state.obsidianVault.vaultNames }
        break
      }

      case 'SAVE_TO_CLOUD': {
        if (!message.payload.folderId) {
          try {
            const session = await ensureAuthenticated()
            if (session.authenticated) {
              const token = await getAccessToken()
              if (token) {
                const resp = await fetch(`${API_BASE_URL}/api/providers/destinations?provider=${message.payload.provider}`, {
                  method: 'GET',
                  headers: { Authorization: `Bearer ${token}` },
                })
                if (resp.ok) {
                  const json = (await resp.json()) as { destinations?: Array<{ name?: string; resourceType?: string; resourceId?: string }> }
                  const dests = json.destinations || []
                  const omnivy = dests.find((d) => d.name === 'Omnivy Web Clips' && d.resourceType === 'folder')
                  if (omnivy && omnivy.resourceId) {
                    message.payload.folderId = omnivy.resourceId
                  }
                }
              }
            }
          } catch (err) {
            console.warn('[Background] Failed to lookup Omnivy destination', err)
          }
        }

        try {
          const result = await saveClipToCloud(message.payload)
          response = result
        } catch (error) {
          console.error('[Background] Failed to execute saveClipToCloud:', error)
          response = { success: false, error: errorMessage(error) }
        }
        break
      }

      case 'GET_CLOUD_STATUS': {
        const session = await ensureAuthenticated()
        if (!session.authenticated) {
          response = { success: true, data: { connections: [] } }
          break
        }

        const cached = await chrome.storage.local.get([
          'googleDriveConnection',
          'oneDriveConnection',
          'dropboxConnection',
          'notionConnection',
        ])

        const cachedConnections: Array<{ provider: string; status: string }> = []
        if (cached.googleDriveConnection) cachedConnections.push({ provider: 'gdrive', status: 'active' })
        if (cached.oneDriveConnection) cachedConnections.push({ provider: 'onedrive', status: 'active' })
        if (cached.dropboxConnection) cachedConnections.push({ provider: 'dropbox', status: 'active' })
        if (cached.notionConnection) cachedConnections.push({ provider: 'notion', status: 'active' })

        try {
          const freshRes = (await getProviderStatus()) as CloudStatusResponse
          if (freshRes.success && freshRes.data?.connections) {
            const connections = freshRes.data.connections
            const gdriveConn = connections.find((c) => c.provider === 'gdrive' && c.status === 'active')
            const onedriveConn = connections.find((c) => c.provider === 'onedrive' && c.status === 'active')
            const dropboxConn = connections.find((c) => c.provider === 'dropbox' && c.status === 'active')
            const notionConn = connections.find((c) => c.provider === 'notion' && c.status === 'active')

            await chrome.storage.local.set({
              googleDriveConnection: !!gdriveConn,
              oneDriveConnection: !!onedriveConn,
              dropboxConnection: !!dropboxConn,
              notionConnection: !!notionConn,
            })

            await Promise.all([
              gdriveConn ? persistProviderUserInfo('gdrive') : Promise.resolve(),
              onedriveConn ? persistProviderUserInfo('onedrive') : Promise.resolve(),
              dropboxConn ? persistProviderUserInfo('dropbox') : Promise.resolve(),
              notionConn ? persistProviderUserInfo('notion') : Promise.resolve(),
            ])

            const cachedFolders = await chrome.storage.local.get([
              'googleDriveFolders',
              'oneDriveFolders',
              'dropboxFolders',
              'notionFolders',
            ])

            const needsFolderFetch =
              (gdriveConn && (!cachedFolders.googleDriveFolders || cachedFolders.googleDriveFolders.length === 0)) ||
              (onedriveConn && (!cachedFolders.oneDriveFolders || cachedFolders.oneDriveFolders.length === 0)) ||
              (dropboxConn && (!cachedFolders.dropboxFolders || cachedFolders.dropboxFolders.length === 0)) ||
              (notionConn && (!cachedFolders.notionFolders || cachedFolders.notionFolders.length === 0))

            if (needsFolderFetch) {
              console.log('[Background] Fresh connections found with empty folder lists. Refreshing folders...')
              const folderResult = await loadFoldersFromProviders()
              if (folderResult.success && folderResult.data?.folders) {
                const folders = folderResult.data.folders as ProviderFolders
                if (folders.gdrive) {
                  await chrome.storage.local.set({ googleDriveFolders: normalizeFolders(folders.gdrive as RawFolder[]) })
                  await persistProviderUserInfo('gdrive')
                }
                if (folders.onedrive) {
                  await chrome.storage.local.set({ oneDriveFolders: normalizeFolders(folders.onedrive as RawFolder[]) })
                  await persistProviderUserInfo('onedrive')
                }
                if (folders.dropbox) {
                  await chrome.storage.local.set({ dropboxFolders: normalizeFolders(folders.dropbox as RawFolder[]) })
                  await persistProviderUserInfo('dropbox')
                }
                if (folders.notion) {
                  await chrome.storage.local.set({ notionFolders: normalizeFolders(folders.notion as RawFolder[]) })
                  await persistProviderUserInfo('notion')
                }
              }
            }

            response = {
              success: true,
              data: {
                connections: connections.filter(
                  (connection) => connection.status === 'active',
                ),
              },
            }
            break
          }
        } catch (err) {
          console.warn('[Background] Failed to refresh provider status:', err)
        }

        response = { success: true, data: { connections: cachedConnections } }
        break
      }

      case 'LOAD_PROVIDER_FOLDERS': {
        try {
          const result = await loadFoldersFromProviders()
          if (result.success && result.data?.folders) {
            const folders = result.data.folders as ProviderFolders
            if (folders.gdrive) {
              await chrome.storage.local.set({ googleDriveFolders: normalizeFolders(folders.gdrive as RawFolder[]) })
              await persistProviderUserInfo('gdrive')
            }
            if (folders.onedrive) {
              await chrome.storage.local.set({ oneDriveFolders: normalizeFolders(folders.onedrive as RawFolder[]) })
              await persistProviderUserInfo('onedrive')
            }
            if (folders.dropbox) {
              await chrome.storage.local.set({ dropboxFolders: normalizeFolders(folders.dropbox as RawFolder[]) })
              await persistProviderUserInfo('dropbox')
            }
            if (folders.notion) {
              await chrome.storage.local.set({ notionFolders: normalizeFolders(folders.notion as RawFolder[]) })
              await persistProviderUserInfo('notion')
            }
          }
          response = result
        } catch (error) {
          console.error('[Background] Error loading folders from providers:', error)
          response = { success: false, error: errorMessage(error) }
        }
        break
      }

      case 'LOGOUT': {
        await clearCloudConnectionCache()
        response = { success: true }
        break
      }

      default:
        response = { success: false, error: 'Unknown message type' }
    }

    sendResponse(response)
  } catch (error) {
    sendResponse({ success: false, error: errorMessage(error) })
  }
}

async function saveMarkdown(payload: {
  content: string
  path: string
  vault?: string
}) {
  const state = store.getState()
  const vaultName = payload.vault || state.obsidianVault.vaultNames[0]

  if (!vaultName) {
    return {
      success: false,
      error: 'No vault configured. Please set a vault name in settings.',
    }
  }

  const encodedVault = encodeURIComponent(vaultName)
  const encodedFile = encodeURIComponent(payload.path)
  const encodedContent = encodeURIComponent(payload.content)

  const obsidianUri = `obsidian://new?vault=${encodedVault}&file=${encodedFile}&content=${encodedContent}`

  chrome.tabs.create({ url: obsidianUri })
  return { success: true }
}

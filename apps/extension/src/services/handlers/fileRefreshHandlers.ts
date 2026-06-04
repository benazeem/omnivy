import { setDropboxFolders } from '@/features/dropboxSlice'
import { setGoogleDriveFolders } from '@/features/googleDriveSlice'
import { setOneDriveFolders } from '@/features/oneDriveSlice'
import { showNotification } from '@/features/notificationSlice'
import { loadFoldersFromProviders } from '@/services/api/saasClient'
import type { AppDispatch } from '@/store'
import type { Folder, RefreshableCloudServiceId } from '@/types'

type RawFolderNode = {
  id?: string
  name?: string
  path?: string
  path_display?: string
  parentReference?: { path?: string }
  folders?: RawFolderNode[]
}

function normalizeFolders(rawFolders: RawFolderNode[] = []): Folder[] {
  return rawFolders.map((folder) => ({
    id: folder.id || '',
    name: folder.name || 'Untitled',
    path:
      folder.path ||
      folder.path_display ||
      folder.parentReference?.path ||
      `/${folder.name || 'Untitled'}`,
    folders: normalizeFolders(folder.folders || []),
  }))
}

export default async function refreshCloudFiles(
  cloud: RefreshableCloudServiceId,
  dispatch: AppDispatch, 
) {
  try {
    const displayNames: Record<RefreshableCloudServiceId, string> = {
      gdrive: 'Google Drive',
      onedrive: 'OneDrive',
      dropbox: 'Dropbox',
    }

    const res = await loadFoldersFromProviders(cloud)
    if (!res.success || !res.data?.folders) {
      throw new Error(res.error || 'Failed to fetch folders from server')
    }

    const rawFolders =
      (res.data.folders as Record<string, RawFolderNode[]>)[cloud] || []
    const folders = normalizeFolders(rawFolders)

    if (cloud === 'gdrive') {
      dispatch(setGoogleDriveFolders(folders))
      await chrome.storage.local.set({ googleDriveFolders: folders })
    } else if (cloud === 'onedrive') {
      dispatch(setOneDriveFolders(folders))
      await chrome.storage.local.set({ oneDriveFolders: folders })
    } else {
      dispatch(setDropboxFolders(folders))
      await chrome.storage.local.set({ dropboxFolders: folders })
    }

    dispatch(
      showNotification({
        message: `${displayNames[cloud]} folders refreshed successfully`,
        type: 'info',
      })
    )
    return true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    dispatch(
      showNotification({
        message: `Failed to refresh folders: ${message}`,
        type: 'error',
      })
    )
    return false
  }
}

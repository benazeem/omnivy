import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@omnivy/ui'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux' 
import CloudConnector from './CloudConnector'
import CloudServiceCard from './CloudServiceCard'
import type { CloudService } from './CloudServiceCard'
import { API_BASE_URL } from '@/config/api'
import { setDropboxConnected } from '@/features/dropboxSlice'
import { setGoogleDriveConnected } from '@/features/googleDriveSlice'
import { setNotionConnected } from '@/features/notionSlice'
import { setOneDriveConnected } from '@/features/oneDriveSlice'
import { useCloudAutoRefresh } from '@/hooks/useCloudAutoRefresh'
import { usePrefersDarkMode } from '@/hooks/usePrefersDarkMode'
import handleCloudFileRefresh from '@/services/handlers/fileRefreshHandlers'
import type { AppDispatch, RootState } from '@/store'
import type { CloudServiceId, RefreshableCloudServiceId } from '@/types'
import { brandConfig } from '@/constants/connector'

const CONNECTION_STORAGE_KEYS = [
  'googleDriveConnection',
  'oneDriveConnection',
  'dropboxConnection',
  'notionConnection',
]

function CloudManager() {
  const [activeCloud, setActiveCloud] = useState<CloudServiceId | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    let isMounted = true

    const syncConnectionStatus = () => {
      chrome.storage.local.get(CONNECTION_STORAGE_KEYS, (result) => {
        const error = chrome.runtime.lastError
        if (error) {
          console.error(
            'Failed to read cloud connection status:',
            error.message,
          )
          return
        }

        if (!isMounted) return

        dispatch(setGoogleDriveConnected(!!result.googleDriveConnection))
        dispatch(setOneDriveConnected(!!result.oneDriveConnection))
        dispatch(setDropboxConnected(!!result.dropboxConnection))
        dispatch(setNotionConnected(!!result.notionConnection))
      })
    }

    syncConnectionStatus()

    chrome.runtime.sendMessage({ type: 'GET_CLOUD_STATUS' }, () => {
      const error = chrome.runtime.lastError
      if (error) {
        console.error(
          'Failed to refresh cloud connection status:',
          error.message,
        )
        return
      }

      syncConnectionStatus()
    })

    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange
    }) => {
      if (CONNECTION_STORAGE_KEYS.some((key) => changes[key] !== undefined)) {
        syncConnectionStatus()
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      isMounted = false
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [dispatch])

  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const systemPrefersDarkMode = usePrefersDarkMode()
  const isDark =
    uiTheme === 'system'
      ? systemPrefersDarkMode
      : uiTheme === 'dark' || uiTheme === 'amoled'

  const localGDrive = useSelector(
    (state: RootState) => state.googleDrive.connected,
  )
  const localOneDrive = useSelector(
    (state: RootState) => state.onedrive.connected,
  )
  const localDropbox = useSelector(
    (state: RootState) => state.dropbox.connected,
  )
  const notionConnected = useSelector(
    (state: RootState) => state.notion.connected,
  )
  const localGDriveUser = useSelector(
    (state: RootState) => state.googleDrive.userInfo,
  )
  const localOneDriveUser = useSelector(
    (state: RootState) => state.onedrive.userInfo,
  )
  const localDropboxUser = useSelector(
    (state: RootState) => state.dropbox.userInfo,
  )
  const localNotionUser = useSelector(
    (state: RootState) => state.notion.userInfo,
  )
  const googleDriveFolders = useSelector(
    (state: RootState) => state.googleDrive.folders || [],
  )
  const oneDriveFolders = useSelector(
    (state: RootState) => state.onedrive.folders || [],
  )
  const dropboxFolders = useSelector(
    (state: RootState) => state.dropbox.folders || [],
  )
  const googleDriveLoading = useSelector(
    (state: RootState) => state.googleDrive.loading,
  )
  const oneDriveLoading = useSelector(
    (state: RootState) => state.onedrive.loading,
  )
  const dropboxLoading = useSelector(
    (state: RootState) => state.dropbox.loading,
  )
  const notionLoading = useSelector((state: RootState) => state.notion.loading)

  useCloudAutoRefresh(
    'gdrive',
    localGDrive,
    googleDriveLoading,
    googleDriveFolders.length,
    dispatch,
  )
  useCloudAutoRefresh(
    'onedrive',
    localOneDrive,
    oneDriveLoading,
    oneDriveFolders.length,
    dispatch,
  )
  useCloudAutoRefresh(
    'dropbox',
    localDropbox,
    dropboxLoading,
    dropboxFolders.length,
    dispatch,
  )

  const anyLoading =
    googleDriveLoading || oneDriveLoading || dropboxLoading || notionLoading

  const services = useMemo<CloudService[]>(
    () => [
      {
        id: 'gdrive',
        ...brandConfig.gdrive,
        connected: localGDrive,
        userInfo: localGDriveUser,
        loading: googleDriveLoading, 
      },
      {
        id: 'onedrive',
        ...brandConfig.onedrive,
        connected: localOneDrive,
        userInfo: localOneDriveUser,
        loading: oneDriveLoading, 
      },
      {
        id: 'dropbox',
        ...brandConfig.dropbox,
        connected: localDropbox,
        userInfo: localDropboxUser,
        loading: dropboxLoading, 
      },
      {
        id: 'notion',
        ...brandConfig.notion,
        icon: isDark
          ? (brandConfig.notion.darkIcon ?? brandConfig.notion.icon)
          : brandConfig.notion.icon,
        connected: notionConnected,
        userInfo: localNotionUser,
        loading: notionLoading,  
      },
    ],
    [
      dropboxLoading,
      googleDriveLoading,
      isDark,
      localDropbox,
      localDropboxUser,
      localGDrive,
      localGDriveUser,
      localNotionUser,
      localOneDrive,
      localOneDriveUser,
      notionConnected,
      notionLoading,
      oneDriveLoading,
    ],
  )

  const handleManage = useCallback(() => {
    window.open(
      `${API_BASE_URL}/settings/integrations`,
      '_blank',
      'noopener,noreferrer',
    )
  }, [])

  const handleServiceClick = useCallback(
    (serviceId: CloudServiceId) => {
      if (serviceId === 'notion') {
        handleManage()
      } else {
        setActiveCloud(serviceId)
      }
    },
    [handleManage],
  )

  const handleRefresh = useCallback(
    (serviceId: RefreshableCloudServiceId) => {
      void handleCloudFileRefresh(serviceId, dispatch)
    },
    [dispatch],
  )

  return (
    <div className="space-y-4" aria-label="Cloud Management">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[var(--text-muted)]">
            Connect third-party workspaces. Click a service to sync folders
            locally.
          </p>
          <Button
            size="sm"
            onClick={handleManage}
            className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold py-1"
          >
            Manage Cloud
          </Button>
        </div>

        {anyLoading && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] px-1">
            <Loader2 size={12} className="animate-spin shrink-0" />
            Checking connection states...
          </div>
        )}

        {services.map((service) => (
          <CloudServiceCard
            key={service.id}
            service={service}
            onManage={handleManage}
            onOpen={handleServiceClick}
            onRefresh={handleRefresh}
          />
        ))}
      </div>

      {activeCloud && (
        <CloudConnector cloud={activeCloud} setCloud={setActiveCloud} />
      )}
    </div>
  )
}

export default CloudManager

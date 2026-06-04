import { useEffect, useRef } from 'react'
import handleCloudFileRefresh from '@/services/handlers/fileRefreshHandlers'
import type { AppDispatch } from '@/store'
import type { RefreshableCloudServiceId } from '@/types'

export const useCloudAutoRefresh = (
  serviceId: RefreshableCloudServiceId,
  connected: boolean,
  loading: boolean,
  folderCount: number,
  dispatch: AppDispatch,
) => {
  const refreshLock = useRef(false)

  useEffect(() => {
    if (!connected) {
      refreshLock.current = false
      return
    }

    if (loading || folderCount > 0 || refreshLock.current) {
      return
    }

    refreshLock.current = true
    void handleCloudFileRefresh(serviceId, dispatch).finally(() => {
      refreshLock.current = false
    })
  }, [connected, dispatch, folderCount, loading, serviceId])
}

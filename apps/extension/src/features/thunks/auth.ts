import {
  ensureAuthenticated,
  logout as clearSession,
} from '@/services/auth/sessionAuth'
import { setAuthLoading, setAuthSession, clearAuth } from '../authSlice'
import { setGoogleDriveConnected, setGoogleDriveFolders } from '../googleDriveSlice'
import { setOneDriveConnected, setOneDriveFolders } from '../oneDriveSlice'
import { setDropboxConnected, setDropboxFolders } from '../dropboxSlice'
import { setNotionConnected, setNotionFolders } from '../notionSlice'
import type { AppDispatch } from '@/store'

export function resetCloudIntegrations() {
  return (dispatch: AppDispatch) => {
    dispatch(setGoogleDriveConnected(false))
    dispatch(setGoogleDriveFolders([]))
    dispatch(setOneDriveConnected(false))
    dispatch(setOneDriveFolders([]))
    dispatch(setDropboxConnected(false))
    dispatch(setDropboxFolders([]))
    dispatch(setNotionConnected(false))
    dispatch(setNotionFolders([]))
  }
}

export function bootstrapAuth() {
  return async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true))
    const session = await ensureAuthenticated()
    dispatch(
      setAuthSession({
        authenticated: session.authenticated,
        user: session.user,
      }),
    )
    return session
  }
}

export function signOutExtension() {
  return async (dispatch: AppDispatch) => {
    await clearSession()
    dispatch(resetCloudIntegrations())
    dispatch(clearAuth())
  }
}

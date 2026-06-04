import {
  loadDropboxState,
  loadGoogleDriveState,
  loadObsidianState,
  loadOneDriveState,
  loadUIState,
  loadBehaviorState,
  loadInterpreterState,
  loadNotionState,
} from '@/features'
import { type AppDispatch } from '@/store'

export const initializeStates = async (dispatch: AppDispatch) => {
  try {
    await Promise.all([
      dispatch(loadObsidianState()).unwrap(),
      dispatch(loadGoogleDriveState()).unwrap(),
      dispatch(loadOneDriveState()).unwrap(),
      dispatch(loadDropboxState()).unwrap(),
      dispatch(loadUIState()).unwrap(),
      dispatch(loadBehaviorState()).unwrap(),
      dispatch(loadInterpreterState()).unwrap(),
      dispatch(loadNotionState()).unwrap(),
    ])
  } catch (error) {
    console.error('[Omnivy] Failed to initialize states:', error)
  }
}

import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/uiSlice'
import googleDriveReducer from '../features/googleDriveSlice'
import dropboxReducer from '../features/dropboxSlice'
import onedriveReducer from '../features/oneDriveSlice'
import obsidianReducer from '../features/obsidianSlice'
import notificationReducer from '../features/notificationSlice'
import notionReducer from '../features/notionSlice'
import behaviorReducer from '../features/behaviorSlice'
import interpreterReducer from '../features/interpreterSlice'
import authReducer from '../features/authSlice'
import { listenerMiddleware } from '@/features/listeners'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    googleDrive: googleDriveReducer,
    dropbox: dropboxReducer,
    onedrive: onedriveReducer,
    obsidianVault: obsidianReducer,
    notification: notificationReducer,
    notion: notionReducer,
    behavior: behaviorReducer,
    interpreter: interpreterReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

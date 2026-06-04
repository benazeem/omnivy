import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loadNotionState } from './index'

import type { Folder, UserInfo } from '@/types'

interface NotionState {
  connected: boolean
  folders: Folder[]
  userInfo: UserInfo | null
  loading: boolean
}

const initialState: NotionState = {
  connected: false,
  folders: [],
  userInfo: null,
  loading: true,
}

const notionSlice = createSlice({
  name: 'notion',
  initialState,
  reducers: {
    setNotionConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setNotionFolders: (state, action: PayloadAction<Folder[]>) => {
      state.folders = action.payload
    },
    setNotionUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload
    },
    resetNotion: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(loadNotionState.pending, (state) => {
      state.loading = true
    });
    builder.addCase(loadNotionState.fulfilled, (state, action) => {
      state.connected = action.payload.connected
      state.folders = action.payload.folders
      state.userInfo = action.payload.userInfo || null
      state.loading = false
    });
    builder.addCase(loadNotionState.rejected, (state) => {
      state.loading = false
    });
  },
})

export const { setNotionConnected, setNotionFolders, setNotionUserInfo, resetNotion } = notionSlice.actions
export default notionSlice.reducer


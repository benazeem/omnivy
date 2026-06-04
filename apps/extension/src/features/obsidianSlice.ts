import type { Folder } from '@/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadObsidianState } from './index'

interface ObsidianState {
  connected: boolean
  folders: Folder[]
  vaultNames: string[]
}

const initialState: ObsidianState = {
  connected: false,
  folders: [],
  vaultNames: [],
}

const obsidianSlice = createSlice({
  name: 'obsidianVault',
  initialState,
  reducers: {
    setObsidianConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload
    },
    setObsidianFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload
    },
    addObsidianVaultName(state, action: PayloadAction<string>) {
      const vaultName = action.payload
      if (
        state.vaultNames.length === 0 ||
        !state.vaultNames.includes(vaultName)
      ) {
        state.vaultNames.push(vaultName)
      }
    },
    removeObsidianVaultName(state, action: PayloadAction<string>) {
      const vaultName = action.payload
      state.vaultNames = state.vaultNames.filter((name) => name !== vaultName)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadObsidianState.fulfilled, (state, action) => {
      state.connected = action.payload.connected
      state.folders = action.payload.folders
      state.vaultNames = action.payload.vaultNames || []
    })
  },
})

export const {
  setObsidianConnected,
  setObsidianFolders,
  addObsidianVaultName,
  removeObsidianVaultName,
} = obsidianSlice.actions
export default obsidianSlice.reducer

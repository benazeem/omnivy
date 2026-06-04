import type { BackgroundWorkerState } from "@/types"

export const workerState = self as BackgroundWorkerState

export const SAVE_MESSAGE_TYPES = new Set(['SAVE_TO_CLOUD', 'SAVE_OBSIDIAN_FILE'])
export const DUPLICATE_MESSAGE_WINDOW_MS = 1500
export const DUPLICATE_CONTEXT_CLICK_WINDOW_MS = 1000

export const CONTEXT_MENU_STORAGE_KEYS = [
  'obsidianVaultNames',
  'notionConnection',
  'notionFolders',
  'googleDriveConnection',
  'googleDriveFolders',
  'oneDriveConnection',
  'oneDriveFolders',
  'dropboxConnection',
  'dropboxFolders',
]

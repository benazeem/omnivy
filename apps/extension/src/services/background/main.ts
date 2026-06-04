import { DUPLICATE_CONTEXT_CLICK_WINDOW_MS, DUPLICATE_MESSAGE_WINDOW_MS, SAVE_MESSAGE_TYPES, CONTEXT_MENU_STORAGE_KEYS, workerState } from '@/constants/background'
import {
  handleContextMenuClick,
  handleMessage,
  initContextMenu,
  resetStartupFlag,
  runStartupSync,
} from './backgroundService'



function bootstrapBackgroundWorker(): void {
  initContextMenu()
  void runStartupSync()
}

function registerListenersOnce(): void {
  if (workerState.__omnivyListenersRegistered) return

  workerState.__omnivyListenersRegistered = true
  console.log('[Omnivy] Registering all event listeners (once)')

  registerMessageListener()
  registerContextMenuListener()
  registerStorageListener()
  registerLifecycleListeners()
}

function registerMessageListener(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (isDuplicateSaveMessage(message)) {
      console.warn('[Background] Blocked duplicate message trigger via self lock.')
      sendResponse({ success: true, duplicateBlocked: true })
      return true
    }

    handleMessage(message, sender, sendResponse)
    return true
  })
}

function isDuplicateSaveMessage(message: {
  type?: string
  payload?: unknown
}): boolean {
  if (!message.type || !SAVE_MESSAGE_TYPES.has(message.type)) {
    return false
  }

  const payload = JSON.stringify(message.payload)
  const now = Date.now()
  const isDuplicate =
    workerState.__omnivyLastMessagePayload === payload &&
    !!workerState.__omnivyLastMessageTime &&
    now - workerState.__omnivyLastMessageTime < DUPLICATE_MESSAGE_WINDOW_MS

  workerState.__omnivyLastMessagePayload = payload
  workerState.__omnivyLastMessageTime = now

  return isDuplicate
}

function registerContextMenuListener(): void {
  if (typeof chrome.contextMenus === 'undefined') return

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (isDuplicateContextMenuClick(info, tab)) {
      console.warn('[Context Menu] Blocked duplicate click trigger via self lock.')
      return
    }

    if (tab) {
      handleContextMenuClick(info, tab)
    }
  })
}

function isDuplicateContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
): boolean {
  const clickId = `${info.menuItemId}-${tab?.id}`
  const now = Date.now()
  const isDuplicate =
    workerState.__omnivyLastClickId === clickId &&
    !!workerState.__omnivyLastClickTime &&
    now - workerState.__omnivyLastClickTime < DUPLICATE_CONTEXT_CLICK_WINDOW_MS

  workerState.__omnivyLastClickId = clickId
  workerState.__omnivyLastClickTime = now

  return isDuplicate
}

function registerStorageListener(): void {
  chrome.storage.onChanged.addListener((changes) => {
    if (shouldRefreshContextMenu(changes)) {
      initContextMenu()
    }
  })
}

function shouldRefreshContextMenu(
  changes: Record<string, chrome.storage.StorageChange>,
): boolean {
  return CONTEXT_MENU_STORAGE_KEYS.some((key) => changes[key])
}

function registerLifecycleListeners(): void {
  chrome.runtime.onStartup.addListener(refreshContextMenuAndSync)
  chrome.runtime.onInstalled.addListener(refreshContextMenuAndSync)

  chrome.runtime.onSuspend.addListener(() => {
    console.log('[Omnivy] Service worker suspending')
  })

  chrome.runtime.onUpdateAvailable.addListener(() => {
    console.info('[Omnivy] Extension update available')
  })
}

function refreshContextMenuAndSync(): void {
  initContextMenu()
  resetStartupFlag()
  void runStartupSync()
}

bootstrapBackgroundWorker()
registerListenersOnce()

import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { setChromeLocal } from '@/services/background'
import {
  setGoogleDriveConnected,
  setGoogleDriveUserInfo,
  setGoogleDriveFolders,
} from '../googleDriveSlice'
import {
  setDropboxConnected,
  setDropboxUserInfo,
  setDropboxFolders,
} from '../dropboxSlice'
import {
  setObsidianConnected,
  setObsidianFolders,
  addObsidianVaultName,
  removeObsidianVaultName,
} from '../obsidianSlice'
import {
  setOneDriveConnected,
  setOneDriveFolders,
  setOneDriveUserInfo,
} from '../oneDriveSlice'
import {
  setFontSize,
  setTheme,
  setBackgroundImageUrl,
  setObsidianInputInterface,
  setAccentColor,
  setFontFamily,
  setUIDensity,
  setReduceMotion,
  setGlassmorphism,
  setSmoothScrolling,
  setCustomCSS,
} from '../uiSlice'
import { setBehavior } from '../behaviorSlice'
import { setInterpreter } from '../interpreterSlice'

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: setGoogleDriveConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: 'googleDriveConnection',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setGoogleDriveFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: 'googleDriveFolders',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setGoogleDriveUserInfo,
  effect: async (action) => {
    await setChromeLocal({
      key: 'googleDriveUserInfo',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setDropboxConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: 'dropboxConnection',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setDropboxFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: 'dropboxFolders',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setDropboxUserInfo,
  effect: async (action) => {
    await setChromeLocal({
      key: 'dropboxUserInfo',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setObsidianConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: 'obsidianConnected',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setObsidianFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: 'obsidianFolders',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  matcher: isAnyOf(addObsidianVaultName, removeObsidianVaultName),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState
    const names = state.obsidianVault.vaultNames

    await setChromeLocal({
      key: 'obsidianVaultNames',
      value: names,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setOneDriveConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: 'oneDriveConnection',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setOneDriveFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: 'oneDriveFolders',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setOneDriveUserInfo,
  effect: async (action) => {
    await setChromeLocal({
      key: 'oneDriveUserInfo',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setFontSize,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyfontsize',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setTheme,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivytheme',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setObsidianInputInterface,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyinputinterface',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setBackgroundImageUrl,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivybackgroundimageurl',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setAccentColor,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyaccentcolor',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setFontFamily,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyfontfamily',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setUIDensity,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyuidensity',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setReduceMotion,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyreducemotion',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setGlassmorphism,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivyglassmorphism',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setSmoothScrolling,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivysmoothscrolling',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setCustomCSS,
  effect: async (action) => {
    await setChromeLocal({
      key: 'omnivycustomcss',
      value: action.payload,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setBehavior,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState
    const merged = { ...state.behavior, ...action.payload }
    await setChromeLocal({
      key: 'behavior',
      value: merged,
    })
  },
})

listenerMiddleware.startListening({
  actionCreator: setInterpreter,
  effect: async (action) => {
    await setChromeLocal({
      key: 'interpreter',
      value: action.payload,
    })
  },
})

export { listenerMiddleware }

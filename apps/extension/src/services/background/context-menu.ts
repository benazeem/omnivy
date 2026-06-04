import { handleMessage } from './message-handler'
import type {FolderNode, SaveResponse} from '@/types'


export function formatProviderName(provider: string): string {
  const names: Record<string, string> = {
    gdrive: 'Google Drive',
    googledrive: 'Google Drive',
    onedrive: 'OneDrive',
    dropbox: 'Dropbox',
    notion: 'Notion',
    obsidian: 'Obsidian',
  }
  return names[provider.toLowerCase()] || provider
}

export function initContextMenu(): void {
  if (typeof chrome.contextMenus === 'undefined') return

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'omnivy-root',
      title: 'Omnivy',
      contexts: ['all'],
    })

    chrome.contextMenus.create({
      id: 'copy-clipboard',
      parentId: 'omnivy-root',
      title: 'Copy to Clipboard',
      contexts: ['page'],
    })

    chrome.contextMenus.create({
      id: 'copy-selection',
      parentId: 'omnivy-root',
      title: 'Copy Selection',
      contexts: ['selection'],
    })

    chrome.contextMenus.create({
      id: 'separator-1',
      parentId: 'omnivy-root',
      type: 'separator',
    })

    chrome.contextMenus.create({
      id: 'save-root',
      parentId: 'omnivy-root',
      title: 'Save to...',
      contexts: ['all'],
    })

    chrome.storage.local.get(
      [
        'obsidianVaultNames',
        'notionConnection',
        'notionFolders',
        'googleDriveConnection',
        'googleDriveFolders',
        'oneDriveConnection',
        'oneDriveFolders',
        'dropboxConnection',
        'dropboxFolders',
      ],
      (data) => {
        const vaults = data.obsidianVaultNames || []
        if (vaults.length > 0) {
          chrome.contextMenus.create({
            id: 'save-obsidian',
            parentId: 'save-root',
            title: 'Obsidian',
            contexts: ['all'],
          })
          vaults.forEach((vault: string) => {
            chrome.contextMenus.create({
              id: `save-obsidian-${vault}`,
              parentId: 'save-obsidian',
              title: `Vault: ${vault}`,
              contexts: ['all'],
            })
          })
        }

        if (data.notionConnection) {
          chrome.contextMenus.create({
            id: 'save-notion',
            parentId: 'save-root',
            title: 'Notion',
            contexts: ['all'],
          })
          const notionFolders = data.notionFolders || []
          if (notionFolders.length > 0) {
            notionFolders.forEach((folder: FolderNode) => {
              chrome.contextMenus.create({
                id: `save-notion-${folder.id}`,
                parentId: 'save-notion',
                title: folder.name,
                contexts: ['all'],
              })
            })
          } else {
            chrome.contextMenus.create({
              id: `save-notion-default`,
              parentId: 'save-notion',
              title: `Default Database`,
              contexts: ['all'],
            })
          }
        }

        if (data.googleDriveConnection) {
          chrome.contextMenus.create({
            id: 'save-gdrive',
            parentId: 'save-root',
            title: 'Google Drive',
            contexts: ['all'],
          })
          const gDriveFolders = data.googleDriveFolders || []
          if (gDriveFolders.length > 0) {
            gDriveFolders.forEach((folder: FolderNode) => {
              chrome.contextMenus.create({
                id: `save-gdrive-${folder.id}`,
                parentId: 'save-gdrive',
                title: folder.name,
                contexts: ['all'],
              })
            })
          } else {
            chrome.contextMenus.create({
              id: `save-gdrive-root`,
              parentId: 'save-gdrive',
              title: 'Root Folder',
              contexts: ['all'],
            })
          }
        }

        if (data.oneDriveConnection) {
          chrome.contextMenus.create({
            id: 'save-onedrive',
            parentId: 'save-root',
            title: 'OneDrive',
            contexts: ['all'],
          })
          const oneDriveFolders = data.oneDriveFolders || []
          if (oneDriveFolders.length > 0) {
            oneDriveFolders.forEach((folder: FolderNode) => {
              chrome.contextMenus.create({
                id: `save-onedrive-${folder.id}`,
                parentId: 'save-onedrive',
                title: folder.name,
                contexts: ['all'],
              })
            })
          } else {
            chrome.contextMenus.create({
              id: `save-onedrive-root`,
              parentId: 'save-onedrive',
              title: 'Root Folder',
              contexts: ['all'],
            })
          }
        }

        if (data.dropboxConnection) {
          chrome.contextMenus.create({
            id: 'save-dropbox',
            parentId: 'save-root',
            title: 'Dropbox',
            contexts: ['all'],
          })
          const dropboxFolders = data.dropboxFolders || []
          if (dropboxFolders.length > 0) {
            dropboxFolders.forEach((folder: FolderNode) => {
              chrome.contextMenus.create({
                id: `save-dropbox-${folder.id}`,
                parentId: 'save-dropbox',
                title: folder.name,
                contexts: ['all'],
              })
            })
          } else {
            chrome.contextMenus.create({
              id: `save-dropbox-root`,
              parentId: 'save-dropbox',
              title: 'Root Folder',
              contexts: ['all'],
            })
          }
        }
      },
    )
  })
}

export async function handleContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab,
): Promise<void> {
  if (!tab?.id) return

  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'PING' })
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    })
    await new Promise((r) => setTimeout(r, 100))
  }

  if (
    info.menuItemId === 'copy-clipboard' ||
    info.menuItemId === 'copy-selection'
  ) {
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_INFO' }, (response) => {
      if (response?.success) {
        const content =
          info.menuItemId === 'copy-selection'
            ? info.selectionText
            : response.data.markdown || response.data.html
        chrome.tabs.sendMessage(tab.id!, {
          type: 'COPY_TO_CLIPBOARD',
          content,
        })
      }
    })
  }

  if (info.menuItemId.toString().startsWith('save-')) {
    const targetId = info.menuItemId.toString()
    const parts = targetId.split('-')
    const provider = parts[1]
    const destination = parts.slice(2).join('-')

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (targetStr) => {
        let container = document.getElementById('omnivy-toast-container')
        if (!container) {
          container = document.createElement('div')
          container.id = 'omnivy-toast-container'
          container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999999;
            pointer-events: none;
          `
          document.body.appendChild(container)
        }

        const existing = container.querySelectorAll('.omnivy-toast-loading')
        existing.forEach((t) => t.remove())

        const toast = document.createElement('div')
        toast.className = 'omnivy-toast-item omnivy-toast-loading'
        toast.id = 'omnivy-toast'
        toast.style.cssText = `
          background: #6366f1;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: sans-serif;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: opacity 0.3s, transform 0.3s;
          opacity: 0;
          transform: translateY(-20px);
          pointer-events: auto;
        `
        toast.innerText = `Saving to ${targetStr}...`
        container.prepend(toast)

        setTimeout(() => {
          toast.style.opacity = '1'
          toast.style.transform = 'translateY(0)'
        }, 10)

        setTimeout(() => {
          if (
            container.contains(toast) &&
            toast.className.includes('omnivy-toast-loading')
          ) {
            toast.style.background = '#ef4444'
            toast.innerText = 'Save timed out. Please try again.'
            toast.className = 'omnivy-toast-item'
            setTimeout(() => {
              toast.style.opacity = '0'
              toast.style.transform = 'translateY(-20px)'
              setTimeout(() => toast.remove(), 300)
            }, 3000)
          }
        }, 15000)
      },
      args: [formatProviderName(provider)],
    })

    chrome.tabs.sendMessage(
      tab.id!,
      { type: 'GET_PAGE_INFO' },
      async (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message)
        }

        if (response?.success) {
          const data = response.data ?? {}
          let content = data.markdown || data.html || ''

          try {
            const storage = await chrome.storage.local.get('behavior')
            const activeBehavior = {
              addLinksInFooter: false,
              saveImages: false,
              ...(storage.behavior || {}),
            }

            if (!activeBehavior.saveImages) {
              content = content
                .replace(/!\[.*?\]\([^\n]*?\)/g, '')
                .replace(/<img[^>]*>/gi, '')
            }
            if (
              activeBehavior.addLinksInFooter &&
              data.links &&
              data.links.length > 0
            ) {
              const linkLines = data.links.map(
                (l: { text: string; url: string }) => `- [${l.text}](${l.url})`,
              )
              content += `\n\n---\n**Content Links:**\n${linkLines.join('\n')}`
            }
          } catch (e) {
            console.error(
              'Failed to get behavior settings for context menu save',
              e,
            )
          }

          const dispatchMessage = async (
            msg:
              | {
                  type: 'SAVE_OBSIDIAN_FILE'
                  payload: { content: string; path: string; vault?: string }
                }
              | {
                  type: 'SAVE_TO_CLOUD'
                  payload: {
                    title: string
                    content: string
                    url?: string
                    tags?: string[]
                    provider: 'gdrive' | 'onedrive' | 'dropbox' | 'notion'
                    folderId?: string
                  }
                },
          ): Promise<SaveResponse> => {
            return new Promise((resolve) => {
              handleMessage(
                msg as never,
                { tab } as chrome.runtime.MessageSender,
                (response) => {
                  resolve(response as SaveResponse)
                },
              )
            })
          }

          let success = false
          let errorMsg = 'Unknown error'

          try {
            if (provider === 'obsidian') {
              const sanitizedFileName = data.title
                ? String(data.title)
                    .replace(/[:*?"<>|\\/]/g, '')
                    .replace(/[^a-zA-Z0-9\-_. ]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
                : 'Untitled'
              const filePath = `${sanitizedFileName}.md`

              const res = await dispatchMessage({
                type: 'SAVE_OBSIDIAN_FILE',
                payload: {
                  content,
                  path: filePath,
                  vault: destination,
                },
              })
              success = !!res?.success
              errorMsg = res?.error || errorMsg
            } else {
              const cloudProvider = provider as
                | 'gdrive'
                | 'onedrive'
                | 'dropbox'
                | 'notion'
              const res = await dispatchMessage({
                type: 'SAVE_TO_CLOUD',
                payload: {
                  title: String(data.title || 'Untitled'),
                  content,
                  url: typeof data.url === 'string' ? data.url : undefined,
                  tags: Array.isArray(data.tags) ? data.tags : [],
                  provider: cloudProvider,
                  folderId:
                    destination &&
                    destination !== 'root' &&
                    destination !== 'default'
                      ? destination
                      : undefined,
                },
              })
              success = !!res?.success
              errorMsg = res?.error || errorMsg
            }
          } catch (e: unknown) {
            errorMsg = e instanceof Error ? e.message : 'Error occurred'
          }

          chrome.scripting
            .executeScript({
              target: { tabId: tab.id! },
              func: (targetStr, isSuccess, errMsg) => {
                const toast = document.getElementById('omnivy-toast')
                if (toast) {
                  if (isSuccess) {
                    toast.style.background = '#22c55e'
                    toast.innerText = `Successfully saved to ${targetStr}!`
                  } else {
                    toast.style.background = '#ef4444'
                    toast.innerText = `Error: ${errMsg}`
                  }
                  setTimeout(() => {
                    toast.style.opacity = '0'
                    toast.style.transform = 'translateY(-20px)'
                    setTimeout(() => toast.remove(), 300)
                  }, 3500)
                }
              },
              args: [formatProviderName(provider), success, errorMsg],
            })
            .catch(() => {})
        } else {
          chrome.scripting
            .executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const toast = document.getElementById('omnivy-toast')
                if (toast) {
                  toast.className = 'omnivy-toast-item'
                  toast.style.background = '#ef4444'
                  toast.innerText = `Error: Unable to capture page. Please refresh this tab.`
                  setTimeout(() => {
                    toast.style.opacity = '0'
                    toast.style.transform = 'translateY(-20px)'
                    setTimeout(() => toast.remove(), 300)
                  }, 3500)
                }
              },
            })
            .catch(() => {})
        }
      },
    )
  }
}

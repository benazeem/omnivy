import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Hash, Link as LinkIcon, User } from 'lucide-react'
import type { AppDispatch, RootState } from '../store'
import { initializeStates } from '@/services/background/stateInitializer'
import { bootstrapAuth } from '@/features/thunks/auth'
import type { PageProperties, PropertyItem, FlatFolder,
  PopupMode,
  PopupTarget, PageInfoResponse } from '@/types'
import {
  buildCustomPropertiesFrontmatter,
  createPropertyId,
  isUnsupportedPageUrl,
  sanitizeFileName,
} from '@/utils/popupUtils'


const initialProperties: PageProperties = {
  title: '',
  source: '',
  author: '',
  published: '',
  description: '',
  tags: 'clippings',
  content: '',
  customProperties: [],
}

export function usePopupController() {
  const dispatch = useDispatch<AppDispatch>()
  const handleSaveRef = useRef<() => void>(() => {})

  const vaultNames = useSelector(
    (state: RootState) => state.obsidianVault.vaultNames || [],
  )

  const [googleDriveStatus, setGoogleDriveStatus] = useState(false)
  const [oneDriveStatus, setOneDriveStatus] = useState(false)
  const [dropboxStatus, setDropboxStatus] = useState(false)
  const [notionStatus, setNotionStatus] = useState(false)

  const [properties, setProperties] = useState<PageProperties>(initialProperties)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [target, setTarget] = useState<PopupTarget>('obsidian')
  const [popupError, setPopupError] = useState<string | null>(null)
  const [pageMode, setPageMode] = useState<PopupMode>('loading')
  const [pageUrl, setPageUrl] = useState('')
  const [pageTitle, setPageTitle] = useState('')

  const [selectedVault, setSelectedVault] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<FlatFolder | null>(null)

  useEffect(() => {
    if (vaultNames.length > 0 && !selectedVault) {
      setSelectedVault(vaultNames[0])
    }
  }, [vaultNames, selectedVault])

  useEffect(() => {
    setSelectedFolder(null)
    setPopupError(null)
  }, [target])

  const syncCloudStatusFromStorage = () => {
    chrome.storage.local.get(
      [
        'googleDriveConnection',
        'oneDriveConnection',
        'dropboxConnection',
        'notionConnection',
        'googleDriveFolders',
        'oneDriveFolders',
        'dropboxFolders',
        'notionFolders',
      ],
      (result) => {
        setGoogleDriveStatus(!!result.googleDriveConnection)
        setOneDriveStatus(!!result.oneDriveConnection)
        setDropboxStatus(!!result.dropboxConnection)
        setNotionStatus(!!result.notionConnection)

        chrome.runtime.sendMessage({ type: 'GET_CLOUD_STATUS' })
        chrome.runtime.sendMessage({ type: 'LOAD_PROVIDER_FOLDERS' })

        const needsFolderSync =
          (result.googleDriveConnection &&
            (!result.googleDriveFolders ||
              result.googleDriveFolders.length === 0)) ||
          (result.oneDriveConnection &&
            (!result.oneDriveFolders || result.oneDriveFolders.length === 0)) ||
          (result.dropboxConnection &&
            (!result.dropboxFolders || result.dropboxFolders.length === 0)) ||
          (result.notionConnection &&
            (!result.notionFolders || result.notionFolders.length === 0))

        if (needsFolderSync) {
          chrome.runtime.sendMessage({ type: 'LOAD_PROVIDER_FOLDERS' })
        }
      },
    )
  }

  useEffect(() => {
    void initializeStates(dispatch)
    void dispatch(bootstrapAuth()).then(() => syncCloudStatusFromStorage())

    const onRuntimeMessage = (msg: { type?: string }) => {
      if (msg?.type === 'AUTH_SESSION_CLEARED') {
        setGoogleDriveStatus(false)
        setOneDriveStatus(false)
        setDropboxStatus(false)
        setNotionStatus(false)
      }
    }
    chrome.runtime.onMessage.addListener(onRuntimeMessage)
    return () => chrome.runtime.onMessage.removeListener(onRuntimeMessage)
  }, [dispatch])

  useEffect(() => {
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange
    }) => {
      const keys = [
        'googleDriveConnection',
        'oneDriveConnection',
        'dropboxConnection',
        'notionConnection',
        'googleDriveFolders',
        'oneDriveFolders',
        'dropboxFolders',
        'notionFolders',
      ]
      const hasAnyChange = keys.some((key) => changes[key] !== undefined)
      if (hasAnyChange) {
        console.log(
          '[Popup] Storage changed. Reloading connection and folder states...',
        )
        chrome.storage.local.get(
          [
            'googleDriveConnection',
            'oneDriveConnection',
            'dropboxConnection',
            'notionConnection',
          ],
          (result) => {
            setGoogleDriveStatus(!!result.googleDriveConnection)
            setOneDriveStatus(!!result.oneDriveConnection)
            setDropboxStatus(!!result.dropboxConnection)
            setNotionStatus(!!result.notionConnection)
          },
        )
        void initializeStates(dispatch)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)
    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [dispatch])

  useEffect(() => {
    const init = async () => {
      try {
        setPageMode('loading')
        setPopupError(null)
        await initializeStates(dispatch)

        const storage = await chrome.storage.local.get('behavior')
        const activeBehavior = storage.behavior || {
          autoClip: false,
          saveImages: true,
          saveBehavior: 'popup',
        }

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
        if (!tab?.id) {
          setPageMode('unsupported')
          setPopupError('No active tab found.')
          return
        }

        setPageUrl(tab.url || '')
        setPageTitle(tab.title || '')

        if (isUnsupportedPageUrl(tab.url)) {
          setPageMode('unsupported')
          setPopupError(
            'This page cannot be captured because Chrome blocks content scripts here.',
          )
          return
        }

        try {
          await chrome.tabs.sendMessage(tab.id, { type: 'PING' })
        } catch {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js'],
            })
            await new Promise((r) => setTimeout(r, 100))
          } catch {
            setPageMode('unsupported')
            setPopupError(
              'This page cannot be captured because content scripts are not allowed on it.',
            )
            return
          }
        }

        const response = (await chrome.tabs.sendMessage(tab.id, {
          type: 'GET_PAGE_INFO',
        })) as PageInfoResponse

        if (response?.success) {
          setPageMode('capture')
          const data = response.data ?? {}
          let content = data.markdown || data.html || ''

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
            const linkLines = data.links.map((l) => `- [${l.text}](${l.url})`)
            content += `\n\n---\n**Content Links:**\n${linkLines.join('\n')}`
          }

          setProperties({
            title: data.title || '',
            source: data.url || '',
            author: data.author || 'Unknown',
            published: new Date().toISOString().split('T')[0],
            description: data.description || '',
            tags: data.tags?.join(', ') || 'clippings',
            content,
            customProperties: [],
          })

          if (activeBehavior.saveBehavior === 'background') {
            setTimeout(() => {
              handleSaveRef.current()
              setTimeout(() => window.close(), 1000)
            }, 500)
          }
        } else {
          setPageMode('unsupported')
          setPopupError('This page could not provide clip content.')
        }
      } catch (error) {
        setPageMode('unsupported')
        setPopupError(
          error instanceof Error ? error.message : 'Popup init failed',
        )
        console.error('Popup init error:', error)
      }
    }
    void init()
  }, [dispatch])

  const propertyList: PropertyItem[] = [
    {
      id: 'title',
      label: 'title',
      value: properties.title,
      icon: <FileText size={12} />,
      onValueChange: (v: string) =>
        setProperties((prev) => ({ ...prev, title: v })),
    },
    {
      id: 'source',
      label: 'source',
      value: properties.source,
      icon: <LinkIcon size={12} />,
      onValueChange: (v: string) =>
        setProperties((prev) => ({ ...prev, source: v })),
    },
    {
      id: 'author',
      label: 'author',
      value: properties.author,
      icon: <User size={12} />,
      onValueChange: (v: string) =>
        setProperties((prev) => ({ ...prev, author: v })),
    },
    {
      id: 'tags',
      label: 'tags',
      value: properties.tags,
      icon: <Hash size={12} />,
      onValueChange: (v: string) =>
        setProperties((prev) => ({ ...prev, tags: v })),
    },
    ...properties.customProperties.map((property) => ({
      id: property.id,
      label: property.label,
      value: property.value,
      icon: <Hash size={12} />,
      labelEditable: true,
      onLabelChange: (label: string) =>
        setProperties((prev) => ({
          ...prev,
          customProperties: prev.customProperties.map((item) =>
            item.id === property.id ? { ...item, label } : item,
          ),
        })),
      onValueChange: (value: string) =>
        setProperties((prev) => ({
          ...prev,
          customProperties: prev.customProperties.map((item) =>
            item.id === property.id ? { ...item, value } : item,
          ),
        })),
      onRemove: () =>
        setProperties((prev) => ({
          ...prev,
          customProperties: prev.customProperties.filter(
            (item) => item.id !== property.id,
          ),
        })),
    })),
  ]

  const addProperty = () => {
    setProperties((prev) => ({
      ...prev,
      customProperties: [
        ...prev.customProperties,
        { id: createPropertyId(), label: '', value: '' },
      ],
    }))
  }

  const isConfigured =
    (target === 'obsidian' && vaultNames.length > 0) ||
    (target === 'notion' && notionStatus) ||
    (target === 'gdrive' && googleDriveStatus) ||
    (target === 'onedrive' && oneDriveStatus) ||
    (target === 'dropbox' && dropboxStatus)

  const handleSave = async () => {
    if (isSaving || isSaved) return

    setIsSaving(true)
    setPopupError(null)
    const customFrontmatter = buildCustomPropertiesFrontmatter(
      properties.customProperties,
    )
    const saveContent = `${customFrontmatter}${properties.content}`

    try {
      if (target === 'obsidian') {
        const sanitizedFileName =
          sanitizeFileName(properties.title) || 'Untitled'
        const filePath = `${sanitizedFileName}_${new Date().toISOString().split('T')[0]}.md`
        const activeVault = selectedVault || vaultNames[0]

        chrome.runtime.sendMessage(
          {
            type: 'SAVE_OBSIDIAN_FILE',
            payload: {
              content: saveContent,
              path: filePath,
              vault: activeVault,
            },
          },
          (response) => {
            if (chrome.runtime.lastError) {
              setPopupError(
                chrome.runtime.lastError.message || 'Error saving to Obsidian',
              )
              setIsSaving(false)
              return
            }
            if (response?.success) {
              setIsSaved(true)
              setTimeout(() => {
                setIsSaved(false)
              }, 2000)
            } else {
              setPopupError(
                response?.error || 'Unknown error saving to Obsidian',
              )
            }
            setIsSaving(false)
          },
        )
      } else {
        chrome.runtime.sendMessage(
          {
            type: 'SAVE_TO_CLOUD',
            payload: {
              title: properties.title,
              content: saveContent,
              url: properties.source,
              tags: properties.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
              provider: target,
              folderId:
                target === 'dropbox'
                  ? selectedFolder?.path
                  : selectedFolder?.id,
              fromUI: true,
            },
          },
          (response) => {
            if (chrome.runtime.lastError) {
              setPopupError(chrome.runtime.lastError.message || 'Error syncing')
              setIsSaving(false)
              return
            }
            if (response?.success) {
              setIsSaved(true)
              setTimeout(() => {
                setIsSaved(false)
              }, 2000)
            } else {
              setPopupError(response?.error || 'Unknown error saving')
            }
            setIsSaving(false)
          },
        )
      }
    } catch (error: unknown) {
      console.error('Save error:', error)
      setPopupError(error instanceof Error ? error.message : 'Save failed')
      setIsSaving(false)
    }
  }

  handleSaveRef.current = () => {
    void handleSave()
  }

  return {
    addProperty,
    dropboxStatus,
    googleDriveStatus,
    handleSave,
    isConfigured,
    isSaved,
    isSaving,
    notionStatus,
    oneDriveStatus,
    pageMode,
    pageTitle,
    pageUrl,
    popupError,
    properties,
    propertyList,
    selectedFolder,
    selectedVault,
    setProperties,
    setSelectedFolder,
    setSelectedVault,
    setTarget,
    target,
  }
}

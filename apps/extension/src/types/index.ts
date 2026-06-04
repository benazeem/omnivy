export type Folder = {
  id: string
  name: string
  path: string
  folders: Folder[]
}

export interface UserInfo {
  id: string
  name: string
  email: string
  picture: string | null
}

export type Theme = 'dark' | 'light' | 'system' | 'amoled'
export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl'
export type AccentColor = 'indigo' | 'violet' | 'rose' | 'emerald' | 'amber' | 'cyan' | 'orange'
export type FontFamily = 'sans' | 'serif' | 'mono'
export type UIDensity = 'compact' | 'comfortable' | 'spacious'

export interface PageInfo {
  title: string
  url: string
  domain: string
  lastModified: string
  referrer: string
  description?: string
  author?: string
  tags: string[]
  html: string
  markdown?: string
  links?: { text: string; url: string }[]
  timestamp: number
}

export interface Property {
  id: string
  label: string
  value: string
  icon: React.ReactNode
  labelEditable?: boolean
  onLabelChange?: (val: string) => void
  onValueChange?: (val: string) => void
  onRemove?: () => void
}

export interface PropertyEditorProps {
  properties: Property[]
  onAddProperty: () => void
}

export interface FlatFolder {
  id: string
  name: string
  path: string
}
export interface VaultManagerProps {
  target: 'obsidian' | 'notion' | 'gdrive' | 'onedrive' | 'dropbox'
  selectedVault: string
  setSelectedVault: (v: string) => void
  selectedFolder: FlatFolder | null
  setSelectedFolder: (f: FlatFolder) => void
}

export interface AuthUserBadgeProps {
  compact?: boolean
  showSignIn?: boolean
}

export type CloudServiceId = 'gdrive' | 'onedrive' | 'dropbox' | 'notion'
export type RefreshableCloudServiceId = Exclude<CloudServiceId, 'notion'>


export type RawFolderNode = {
  id?: string
  name?: string
  path?: string
  path_display?: string
  folders?: RawFolderNode[]
}

export type FolderNode = {
  id: string
  name: string
}

export type SaveResponse = {
  success?: boolean
  error?: string
}

export type CloudConnection = {
  provider: string
  status: string
}

export type CloudStatusResponse = {
  success: boolean
  data?: {
    connections?: CloudConnection[]
  }
}

export type RawFolder = {
  id?: string
  name?: string
  path?: string
  path_display?: string
  folders?: RawFolder[]
}

export type ProviderFolders = Record<string, RawFolder[]>

export type ProviderUserInfo = {
  id?: string
  name?: string
  displayName?: string
  email?: string
  mail?: string
  picture?: string | null
  profile_photo_url?: string | null
  account_id?: string
}

export type BackgroundWorkerState = typeof self & {
  __omnivyListenersRegistered?: boolean
  __omnivyLastClickId?: string
  __omnivyLastClickTime?: number
  __omnivyLastMessagePayload?: string
  __omnivyLastMessageTime?: number
}

export * from './auth'
export * from './api'
export * from './connector'
export * from './popup'
export * from './content'
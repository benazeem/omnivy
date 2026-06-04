export interface PageProperties {
  title: string
  source: string
  author: string
  published: string
  description: string
  tags: string
  content: string
  customProperties: Array<{
    id: string
    label: string
    value: string
  }>
}

export interface PropertyItem {
  id: string
  label: string
  value: string
  icon: React.ReactNode
  labelEditable?: boolean
  onLabelChange?: (v: string) => void
  onValueChange: (v: string) => void
  onRemove?: () => void
}

export interface PopupMainProps {
  properties: PageProperties
  setProperties: React.Dispatch<React.SetStateAction<PageProperties>>
  propertyList: PropertyItem[]
  onAddProperty: () => void
}

 
export type PopupTarget =
  | 'obsidian'
  | 'notion'
  | 'gdrive'
  | 'onedrive'
  | 'dropbox'

export type PopupMode = 'loading' | 'capture' | 'unsupported'

export interface PopupUnsupportedViewProps {
  pageTitle: string
  pageUrl: string
  popupError: string | null
  onOpenWebsiteIntegrations: () => void
}

export interface PageInfoResponse {
  success?: boolean
  data?: {
    title?: string
    url?: string
    author?: string
    description?: string
    tags?: string[]
    markdown?: string
    html?: string
    links?: Array<{
      text: string
      url: string
    }>
  }
}

export interface FlatFolder {
  id: string
  name: string
  path: string
}

export interface PopupFooterProps {
  target: 'obsidian' | 'notion' | 'gdrive' | 'onedrive' | 'dropbox'
  setTarget: (
    t: 'obsidian' | 'notion' | 'gdrive' | 'onedrive' | 'dropbox',
  ) => void
  notionStatus: boolean
  googleDriveStatus: boolean
  oneDriveStatus: boolean
  dropboxStatus: boolean
  isConfigured: boolean
  isSaving: boolean
  isSaved: boolean
  handleSave: () => void
  selectedVault: string
  setSelectedVault: (v: string) => void
  selectedFolder: FlatFolder | null
  setSelectedFolder: (f: FlatFolder) => void
  popupError?: string | null
}
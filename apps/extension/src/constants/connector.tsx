import Icons from '@public/icons.json'
import type { CloudServiceId, CloudAction } from '@/types'

export const brandConfig = {
  gdrive: {
    name: 'Google Drive',
    description:
      'Sync and access your saved content securely with Google Drive cloud storage.',
    icon: Icons.googleDriveIcon,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accentBorder: 'border-emerald-500/20',
    hoverBackground: 'bg-emerald-500/10 hover:bg-emerald-500/15',
    connectButton: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10',
  },

  onedrive: {
    name: 'Microsoft OneDrive',
    description:
      'Host and sync your clippings using your personal or work Microsoft account.',
    icon: Icons.oneDriveIcon,
    gradient: 'from-blue-500/10 to-indigo-500/10',
    accentBorder: 'border-blue-500/20',
    hoverBackground: 'bg-blue-500/10 hover:bg-blue-500/15',
    connectButton: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10',
  },

  dropbox: {
    name: 'Dropbox',
    description:
      'Use Dropbox file sharing to access your saved content wherever you work.',
    icon: Icons.dropboxIcon,
    gradient: 'from-indigo-500/10 to-purple-500/10',
    accentBorder: 'border-indigo-500/20',
    hoverBackground: 'bg-indigo-500/10 hover:bg-indigo-500/15',
    connectButton: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10',
  },

  notion: {
    name: 'Notion',
    description: 'Save and organize clippings in your Notion workspace.',
    icon: Icons.notionLightIcon,
    darkIcon: Icons.notiondarkIcon,
    gradient: 'from-amber-500/10 to-orange-500/10',
    accentBorder: 'border-amber-500/20',
    hoverBackground: 'bg-amber-500/10 hover:bg-amber-500/15',
    connectButton: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10',
  },
} satisfies Record<
  CloudServiceId,
  {
    name: string
    description: string
    icon: string
    darkIcon?: string
    gradient: string
    accentBorder: string
    hoverBackground: string
    connectButton: string
  }
>

export const actionLabels: Record<CloudAction, string> = {
  'sync-folders': 'Syncing folders',
}

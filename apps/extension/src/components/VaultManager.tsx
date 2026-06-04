import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Vault,
  ChevronDown,
  Database,
  Folder as FolderIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@omnivy/ui'
import type { FlatFolder, Folder, VaultManagerProps } from '@/types'

const flattenFolders = (folders: Folder[], prefix = ''): FlatFolder[] => {
  let result: FlatFolder[] = []
  for (const f of folders) {
    const fullPath = prefix ? `${prefix}/${f.name}` : `/${f.name}`
    result.push({ id: f.id, name: f.name, path: f.path || fullPath })
    if (f.folders && f.folders.length > 0) {
      result = result.concat(flattenFolders(f.folders, fullPath))
    }
  }
  return result
}

const VaultManager: React.FC<VaultManagerProps> = ({
  target,
  selectedVault,
  setSelectedVault,
  selectedFolder,
  setSelectedFolder,
}) => {
  const vaultNames = useSelector(
    (state: RootState) => state.obsidianVault.vaultNames || [],
  )
  const gdriveFolders = useSelector(
    (state: RootState) => state.googleDrive.folders || [],
  )
  const onedriveFolders = useSelector(
    (state: RootState) => state.onedrive.folders || [],
  )
  const dropboxFolders = useSelector(
    (state: RootState) => state.dropbox.folders || [],
  )
  const notionFolders = useSelector(
    (state: RootState) => state.notion.folders || [],
  )

  let label = ''
  let items: React.ReactNode = null
  let icon = <Vault size={12} className="text-purple-400" />
  let iconBg = 'bg-purple-500/10'

  if (target === 'obsidian') {
    label = selectedVault || vaultNames[0] || 'Select Vault'
    icon = <Vault size={12} className="text-purple-400" />
    iconBg = 'bg-purple-500/10'
    items =
      vaultNames.length > 0 ? (
        vaultNames.map((name, i) => (
          <DropdownMenuItem
            key={i}
            onClick={() => setSelectedVault(name)}
            className="text-[10px] font-bold uppercase p-2 hover:bg-brand-600 rounded-lg cursor-pointer"
          >
            {name}
          </DropdownMenuItem>
        ))
      ) : (
        <DropdownMenuItem
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-[10px] font-bold uppercase p-2 text-red-400 hover:bg-white/5 rounded-lg cursor-pointer"
        >
          Configure Vaults
        </DropdownMenuItem>
      )
  } else if (
    target === 'gdrive' ||
    target === 'onedrive' ||
    target === 'dropbox' ||
    target === 'notion'
  ) {
    const rawFolders =
      target === 'gdrive'
        ? gdriveFolders
        : target === 'onedrive'
          ? onedriveFolders
          : target === 'dropbox'
            ? dropboxFolders
            : notionFolders

    const flat = flattenFolders(rawFolders as Folder[])

    if (!selectedFolder && flat.length > 0) {
      setTimeout(() => setSelectedFolder(flat[0]), 0)
    }

    label =
      selectedFolder?.name ||
      flat[0]?.name ||
      (target === 'notion' ? 'Select Database' : 'Select Folder')
    icon =
      target === 'notion' ? (
        <Database size={12} className="text-neutral-400" />
      ) : (
        <FolderIcon size={12} className="text-emerald-400" />
      )
    iconBg = target === 'notion' ? 'bg-neutral-500/10' : 'bg-emerald-500/10'

    items =
      flat.length > 0 ? (
        flat.map((folder, i) => (
          <DropdownMenuItem
            key={i}
            onClick={() => setSelectedFolder(folder)}
            className="text-[10px] font-bold uppercase p-2 hover:bg-brand-600 rounded-lg cursor-pointer "
          >
            {target === 'notion' ? folder.name : folder.path}
          </DropdownMenuItem>
        ))
      ) : (
        <DropdownMenuItem
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-[10px] font-bold uppercase p-2 text-red-400 hover:bg-white/5 rounded-lg cursor-pointer"
        >
          Configure Folders
        </DropdownMenuItem>
      )
  }

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-black/20 border border-white/5 rounded-xl hover:border-brand-500/50 transition-all text-left group">
            <div className="flex items-center gap-2 truncate">
              <div
                className={`p-1 ${iconBg} rounded-md group-hover:bg-purple-500/20 transition-colors`}
              >
                {icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight truncate">
                {label}
              </span>
            </div>
            <ChevronDown
              size={12}
              className="text-[var(--text-muted)] flex-shrink-0"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="  bg-[var(--bg-popover)] border border-[var(--border-dim)] p-1 min-w-[150px] max-h-[200px] overflow-y-auto">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default VaultManager

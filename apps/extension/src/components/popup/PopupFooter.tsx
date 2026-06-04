import { Share2, Loader2, CheckCircle2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import VaultManager from '@/components/VaultManager'
import Icons from '@public/icons.json'
import {Button} from '@omnivy/ui'
import type { PopupFooterProps } from '@/types'



const PopupFooter = ({
  target,
  setTarget,
  notionStatus,
  googleDriveStatus,
  oneDriveStatus,
  dropboxStatus,
  isConfigured,
  isSaving,
  isSaved,
  handleSave,
  selectedVault,
  setSelectedVault,
  selectedFolder,
  setSelectedFolder,
  popupError,
}: PopupFooterProps) => {
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const googleDriveLoading = useSelector((state: RootState) => state.googleDrive.loading)
  const oneDriveLoading = useSelector((state: RootState) => state.onedrive.loading)
  const dropboxLoading = useSelector((state: RootState) => state.dropbox.loading)
  const notionLoading = useSelector((state: RootState) => state.notion.loading)

  const isDark =
    uiTheme === 'system'
      ? typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      : uiTheme === 'dark' || uiTheme === 'amoled'

  const notionIcon = isDark ? Icons.notiondarkIcon : Icons.notionLightIcon

  return (
    <footer className="p-4 border-t border-[var(--border-dim)] bg-[var(--bg-muted)]/80 backdrop-blur-2xl space-y-3.5">
      <div className="flex items-center gap-2">
        <div className="flex-grow min-w-0">
          <VaultManager
            target={target}
            selectedVault={selectedVault}
            setSelectedVault={setSelectedVault}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        </div>
 
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 gap-0.5 flex-shrink-0">
          
          <Button
            onClick={() => setTarget('obsidian')}
            title="Obsidian"
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${target === 'obsidian' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/20' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'}`}
          >
            <img
              src="/obsidian-icon.png"
              className="w-4 h-4 object-contain"
              alt="Obsidian"
            />
          </Button>
 
          <Button
            onClick={() => setTarget('gdrive')}
            disabled={googleDriveLoading || !googleDriveStatus}
            title="Google Drive"
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${target === 'gdrive' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'} ${!googleDriveStatus && 'opacity-20 cursor-not-allowed hover:scale-100'}`}
          >
            {googleDriveLoading ? (
              <Loader2 size={16} className="animate-spin shrink-0" />
            ) : (
              <img
                src={Icons.googleDriveIcon}
                className="w-4 h-4 object-contain"
                alt="Google Drive"
              />
            )}
          </Button>

          <Button
            onClick={() => setTarget('onedrive')}
            disabled={oneDriveLoading || !oneDriveStatus}
            title="OneDrive"
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${target === 'onedrive' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'} ${!oneDriveStatus && 'opacity-20 cursor-not-allowed hover:scale-100'}`}
          >
            {oneDriveLoading ? (
              <Loader2 size={16} className="animate-spin shrink-0" />
            ) : (
              <img
                src={Icons.oneDriveIcon}
                className="w-4 h-4 object-contain"
                alt="OneDrive"
              />
            )}
          </Button>
 
          <Button
            onClick={() => setTarget('dropbox')}
            disabled={dropboxLoading || !dropboxStatus}
            title="Dropbox"
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${target === 'dropbox' ? 'bg-blue-200 text-white shadow-lg shadow-blue-500/30 border border-blue-400/20' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'} ${!dropboxStatus && 'opacity-20 cursor-not-allowed hover:scale-100'}`}
          >
            {dropboxLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img
                src={Icons.dropboxIcon}
                className="w-4 h-4 object-contain"
                alt="Dropbox"
              />
            )}
          </Button>
 
          <Button
            onClick={() => setTarget('notion')}
            disabled={notionLoading || !notionStatus}
            title="Notion"
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${target === 'notion' ? 'bg-neutral-800 text-white shadow-lg shadow-neutral-800/30 border border-neutral-700/20' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'} ${!notionStatus && 'opacity-20 cursor-not-allowed hover:scale-100'}`}
          >
            {notionLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img
                src={notionIcon}
                className="w-4 h-4 object-contain"
                alt="Notion"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </Button>
        </div>
      </div>
      <Button
        onClick={handleSave}
        disabled={!isConfigured || isSaving || isSaved}
        className={`w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-[0.98] ${
          !isConfigured
            ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700/20'
            : isSaved
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/25 animate-pulse'
              : target === 'notion'
                ? 'bg-neutral-800 hover:bg-neutral-900 hover:-translate-y-0.5 text-white shadow-lg shadow-neutral-800/30 border border-neutral-700/20'
                : target === 'gdrive'
                  ? 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/20'
                  : target === 'onedrive'
                    ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white shadow-lg shadow-blue-600/30 border border-blue-500/20'
                    : target === 'dropbox'
                      ? 'bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 text-white shadow-lg shadow-blue-500/30 border border-blue-400/20'
                      : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5 text-white shadow-lg shadow-brand-600/30 border border-brand-500/20'
        }`}
      >
        {isSaving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isSaved ? (
          <CheckCircle2 size={14} />
        ) : (
          <Share2 size={14} />
        )}
        {!isConfigured
          ? 'Configure Target First'
          : isSaving
            ? 'Saving...'
          : isSaved
            ? 'Clipped!'
            : `Add to ${
                target === 'notion'
                  ? 'Notion'
                  : target === 'gdrive'
                    ? 'Google Drive'
                    : target === 'onedrive'
                      ? 'OneDrive'
                      : target === 'dropbox'
                        ? 'Dropbox'
                        : 'Obsidian'
              }`}
      </Button>
 
      {popupError && (
        <div className="text-red-400 text-[10px] text-center mt-2 font-medium">
          {popupError}
        </div>
      )}
    </footer>
  )
}

export default PopupFooter

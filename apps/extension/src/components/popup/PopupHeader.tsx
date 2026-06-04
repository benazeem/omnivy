import { Settings } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import AuthUserBadge from '@/components/AuthUserBadge'
import {Button } from '@omnivy/ui'

const PopupHeader = () => {
  const notionStatus = useSelector((state: RootState) => state.notion.connected)
  const dropboxStatus = useSelector((state: RootState) => state.dropbox.connected)
  const googleDriveStatus = useSelector((state: RootState) => state.googleDrive.connected)
  const oneDriveStatus = useSelector((state: RootState) => state.onedrive.connected)

  return (
    <header className="px-5 py-4 border-b border-[var(--border-dim)] bg-[var(--bg-muted)]/40 backdrop-blur-xl flex flex-col gap-3 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/30">
            <img src="/icons/icon32.png" className="w-4 h-4 invert" alt="" />
          </div>
          <span className="font-display font-black text-sm tracking-tighter uppercase">
            Omnivy
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-1">
            {[
              { s: googleDriveStatus, n: 'Google Drive' },
              { s: oneDriveStatus, n: 'OneDrive' },
              { s: dropboxStatus, n: 'Dropbox' },
            ].map((c, i) => (
              <div
                key={i}
                title={c.n}
                className={`w-1.5 h-1.5 rounded-full ${c.s ? 'bg-green-500' : 'bg-red-500/30'}`}
              />
            ))}
            <div
              title="Notion"
              className={`w-1.5 h-1.5 rounded-full ${notionStatus ? 'bg-blue-500' : 'bg-white/10'}`}
            />
          </div>
          <Button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings size={16} className="text-[var(--text-muted)]" />
          </Button>
          <AuthUserBadge compact />
        </div>
      </div>

      
    </header>
  )
}

export default PopupHeader

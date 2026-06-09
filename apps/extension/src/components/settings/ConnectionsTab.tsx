import { useEffect, useState } from 'react'
import { Vault, Database, X, Cloud } from 'lucide-react'
import { Input, Button } from '@omnivy/ui'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import CloudManager from '@/components/CloudManager'
import Icons from '@public/icons.json'

interface ConnectionsTabProps {
  vaultNames: string[]
  currentNameInput: string
  setCurrentNameInput: (val: string) => void
  handleVaultAdd: () => void
  handleRemoveName: (name: string) => void
}

const ConnectionsTab = ({
  vaultNames,
  currentNameInput,
  setCurrentNameInput,
  handleVaultAdd,
  handleRemoveName,
}: ConnectionsTabProps) => {
  const [storedNotionConnected, setStoredNotionConnected] = useState(false)

  const dropboxConnected = useSelector(
    (state: RootState) => state.dropbox.connected,
  )
  const googleDriveConnected = useSelector(
    (state: RootState) => state.googleDrive.connected,
  )
  const oneDriveConnected = useSelector(
    (state: RootState) => state.onedrive.connected,
  )
  const notionConnected = useSelector(
    (state: RootState) => state.notion.connected,
  )

  useEffect(() => {
    let mounted = true

    const syncNotionStatus = () => {
      chrome.storage.local.get(['notionConnection'], (result) => {
        if (!mounted) return
        setStoredNotionConnected(!!result.notionConnection)
      })
    }

    syncNotionStatus()

    const onStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.notionConnection !== undefined) {
        syncNotionStatus()
      }
    }

    chrome.storage.onChanged.addListener(onStorageChange)
    return () => {
      mounted = false
      chrome.storage.onChanged.removeListener(onStorageChange)
    }
  }, [])

  const anyConnected =
    googleDriveConnected || oneDriveConnected || dropboxConnected || notionConnected || storedNotionConnected

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black mb-2 sm:mb-3 tracking-tight">
            Connections
          </h2>
          <p className="text-[var(--text-muted)] text-base sm:text-lg lg:text-xl">
            Manage your vaults and cloud sync providers.
          </p>
        </div>
      </header>

      {anyConnected && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Active Connections
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {googleDriveConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-500/25">
                <img src={Icons.googleDriveIcon} className="w-3.5 h-3.5 object-contain" alt="Google Drive" />
                Google Drive
              </span>
            )}
            {oneDriveConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-500/25">
                <img src={Icons.oneDriveIcon} className="w-3.5 h-3.5 object-contain" alt="OneDrive" />
                OneDrive
              </span>
            )}
            {dropboxConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-500/25">
                <img src={Icons.dropboxIcon} className="w-3.5 h-3.5 object-contain" alt="Dropbox" />
                Dropbox
              </span>
            )}
            {(notionConnected || storedNotionConnected) && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-500/25">
                <img src={Icons.notionLightIcon} className="w-3.5 h-3.5 object-contain" alt="Notion" />
                Notion
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] gap-6 lg:gap-8 items-start">
        <div className="space-y-6 lg:space-y-8">
          <section className="glass-panel p-5 sm:p-6 lg:p-7 xl:p-8 space-y-6 lg:space-y-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
                <div className="p-2.5 bg-purple-500/10 rounded-2xl">
                  <Vault className="w-6 h-6 text-purple-600" />
                </div>
                Obsidian Vaults
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                value={currentNameInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentNameInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleVaultAdd()
                  }
                }}
                placeholder="Enter vault name..."
                className="min-w-0 flex-grow py-3 sm:py-4"
              />
              <Button onClick={handleVaultAdd} className="btn-primary px-8 sm:px-10">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 pt-6 lg:pt-8 border-t border-[var(--border-dim)]">
              {vaultNames.length === 0 ? (
                <span className="text-sm text-[var(--text-muted)] font-medium">No vaults configured yet. Add one above!</span>
              ) : (
                vaultNames.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-3 bg-[var(--bg-muted)] border border-[var(--border-dim)] rounded-2xl group hover:border-brand-500 transition-all shadow-sm"
                  >
                    <span className="text-xs font-black uppercase tracking-widest">
                      {name}
                    </span>
                    <Button
                      onClick={() => handleRemoveName(name)}
                      title={`Remove ${name}`}
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-colors"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:space-y-8">
          <section className="glass-panel p-5 sm:p-6 lg:p-7 xl:p-8 space-y-7 lg:space-y-8">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-dim)] pb-5 lg:pb-6">
              <h3 className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
                <div className="p-2.5 bg-blue-500/10 rounded-2xl">
                  <Cloud className="w-6 h-6 text-blue-500" />
                </div>
                Integrations
              </h3>
            </div>

            <div className="space-y-6">
              <CloudManager />
            </div>

            <div className="space-y-5 lg:space-y-6 pt-6 lg:pt-8 border-t border-[var(--border-dim)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                    Upcoming Integrations
                    <span className="px-2 py-0.5 rounded-full bg-amber-600/10 text-amber-600 text-[9px] font-black uppercase tracking-tighter border border-amber-600/20">
                      Soon
                    </span>
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">Platforms we are currently planning to support.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                {['Evernote', 'Readwise', 'Zotero', 'Raindrop.io', 'Todoist'].map((service) => (
                  <div key={service} className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-dim)] opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                    <span className="font-bold text-xs">{service}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ConnectionsTab

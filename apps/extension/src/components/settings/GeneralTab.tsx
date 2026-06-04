import { useRef } from 'react'
import { Download, Upload, Settings, Zap } from 'lucide-react'
import { Input, Button } from '@omnivy/ui'
import { setBehavior } from '@/features/behaviorSlice'
import type { BehaviorState } from '@/features/behaviorSlice'
import type { AppDispatch } from '@/store'

interface GeneralTabProps {
  behavior: BehaviorState
  dispatch: AppDispatch
}

const GeneralTab = ({ behavior, dispatch }: GeneralTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportSettings = () => {
    try {
      chrome.storage.local.get(null, (allData: Record<string, unknown>) => {
        const exportData: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(allData)) { 
          if (
            key.includes('Connection') ||
            key.includes('Folders') ||
            key.includes('UserInfo') ||
            key.includes('VaultNames') ||
            key.startsWith('omnivy_')
          ) {
            continue
          }
          exportData[key] = value
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `omnivy-settings-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
      })
    } catch {
      console.warn('Failed to export settings')
    }
  }

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(
          String(event.target?.result ?? ''),
        ) as Record<string, unknown>
        
         const importData: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(data)) {
          if (
            key.includes('Connection') ||
            key.includes('Folders') ||
            key.includes('UserInfo') ||
            key.includes('VaultNames') ||
            key.startsWith('omnivy_')
          ) {
            continue
          }
          importData[key] = value
        }

        chrome.storage.local.set(importData, () => {
          setTimeout(() => window.location.reload(), 1000)
        })
      } catch {
        console.warn('Invalid settings file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-5xl font-display font-black mb-3 tracking-tighter">
            General Settings
          </h2>
          <p className="text-[var(--text-muted)] text-xl">
            Configure how the extension captures and manages your content.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10"> 
        <section className="glass-panel p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-2xl">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-black font-display tracking-tight uppercase">
              Clip Behavior
            </h3>
          </div>
          <div className="space-y-6"> 
            <div className="p-6 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm uppercase tracking-tight">
                      Clip Mode
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-brand-600/10 text-brand-600 text-[8px] font-black uppercase tracking-tighter border border-brand-600/20">
                      Soon
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    How content is saved when you clip a page.
                  </p>
                </div>
                <select
                  disabled
                  value={behavior.saveBehavior}
                  title='Clip Mode'
                  onChange={(e) =>
                    dispatch(
                      setBehavior({
                        saveBehavior: e.target.value as 'popup' | 'background',
                      }),
                    )
                  }
                  className="bg-[var(--bg-popover)] border border-[var(--border-dim)] rounded-2xl px-5 py-3 text-sm font-bold opacity-50 cursor-not-allowed"
                >
                  <option value="popup">Show Popup</option>
                  <option value="background">Save Silently</option>
                </select>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] bg-brand-500/5 rounded-xl px-4 py-2 border border-brand-500/10">
                {behavior.saveBehavior === 'popup'
                  ? '📋 A popup will appear letting you edit title, tags, and destination before saving.'
                  : '⚡ Content is instantly saved to your default vault with auto-generated metadata.'}
              </p>
            </div>

 
            <div className="flex items-center justify-between p-6 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/30">
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-tight">
                  Save Images
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Download and embed images from clipped articles into your vault.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                <Input
                  id="toggle-save-images"
                  type="checkbox"
                  checked={behavior.saveImages}
                  onChange={(e) =>
                    dispatch(setBehavior({ saveImages: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--bg-muted)] border border-[var(--border-dim)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-6 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/30">
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-tight">
                  Add Content Links
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Add the important URL links in the content to the footer of your clipped content.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                <Input
                  id="toggle-add-links"
                  type="checkbox"
                  checked={behavior.addLinksInFooter}
                  onChange={(e) =>
                    dispatch(setBehavior({ addLinksInFooter: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--bg-muted)] border border-[var(--border-dim)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          </div>
        </section>
 
        <section className="glass-panel p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
              <Settings className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black font-display tracking-tight uppercase">
              Data Management
            </h3>
          </div>

          <div className="space-y-6">
      
            <div className="p-6 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/30 space-y-4">
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-tight">
                  Export Settings
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Download all your extension settings, vault configurations, and connection data as a JSON file for backup or migration.
                </p>
              </div>
              <Button
                onClick={handleExportSettings}
                className="btn-primary px-6 flex items-center gap-2"
              >
                <Download size={16} /> Export All Settings
              </Button>
            </div> 

            <div className="p-6 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/30 space-y-4">
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-tight">
                  Import Settings
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Restore a previously exported settings file. This will overwrite your current settings and reload the page.
                </p>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-popover)] font-bold text-sm hover:border-brand-500/40 transition-all"
              >
                <Upload size={16} /> Import Settings File
              </Button>
            </div>


            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-4">
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-tight text-red-500">
                  Reset to Defaults
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Clear all settings and restore the extension to factory defaults. This cannot be undone.
                </p>
              </div>
              <Button
                onClick={() => {
                  if (window.confirm('Are you sure? This will erase all settings and reload.')) {
                    chrome.storage.local.clear(() => {
                        console.warn('Settings reset. Reloading...')
                      setTimeout(() => window.location.reload(), 1000)
                    })
                  }
                }}
                className="px-6 py-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-all"
              >
                Reset All Settings
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GeneralTab

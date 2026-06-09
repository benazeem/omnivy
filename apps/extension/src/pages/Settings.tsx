import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Settings as SettingsIcon,
  Database,
  Palette,
  Cpu,
  Clipboard,
  Menu,
} from 'lucide-react'
import type { AppDispatch, RootState } from '@/store'
import {
  addObsidianVaultName,
  removeObsidianVaultName,
} from '@/features/obsidianSlice'
import { initializeStates } from '@/services/background/stateInitializer'
import { bootstrapAuth } from '@/features/thunks/auth'
import SettingsNotification from '@/components/SettingsNotification'
import { showNotification } from '@/features/notificationSlice'
import ClipperHistoryPanel from '@/components/settings/ClipperHistoryPanel'

import { useUIEffect } from '@/hooks/useUIEffect'
import SettingsSidebar from '../components/settings/SettingsSidebar'
import GeneralTab from '../components/settings/GeneralTab'
import AppearanceTab from '../components/settings/AppearanceTab'
import ConnectionsTab from '../components/settings/ConnectionsTab'

function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentNameInput, setCurrentNameInput] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

  useUIEffect()
  
  const uiState = useSelector((state: RootState) => state.ui)
  const authState = useSelector((state: RootState) => state.auth)
  const vaultNames = useSelector(
    (state: RootState) => state.obsidianVault.vaultNames || [],
  )
  const behavior = useSelector((state: RootState) => state.behavior)

  const handleRemoveName = (name: string) => {
    dispatch(removeObsidianVaultName(name))
    dispatch(
      showNotification({ message: `Removed vault: ${name}`, type: 'info' }),
    )
  }

  const handleVaultAdd = () => {
    if (!currentNameInput.trim()) return
    dispatch(addObsidianVaultName(currentNameInput.trim()))
    setCurrentNameInput('')
  }

  useEffect(() => {
    void initializeStates(dispatch)
    void dispatch(bootstrapAuth())

    const onRuntimeMessage = (msg: { type?: string }) => {
      if (msg?.type === 'AUTH_SESSION_CLEARED') {
        void initializeStates(dispatch)
        void dispatch(bootstrapAuth())
      }
    }
    chrome.runtime.onMessage.addListener(onRuntimeMessage)
    return () => chrome.runtime.onMessage.removeListener(onRuntimeMessage)
  }, [dispatch])

  const menuItems = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'connections', label: 'Connections', icon: <Database size={18} /> },
    ...(authState.authenticated
      ? [{ id: 'clipper-history', label: 'Clipper History', icon: <Clipboard size={18} /> }]
      : []),
    { id: 'interpreter', label: 'Interpreter', icon: <Cpu size={18} />, comingSoon: true },
  ]

  return (
    <div
      className="flex min-h-screen w-full bg-[var(--bg-popover)] text-[var(--text-main)] font-sans lg:overflow-hidden"
    >
      <SettingsNotification />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close settings menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SettingsSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        menuItems={menuItems} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      <main className="w-full flex-1 overflow-y-auto px-4 pb-6 pt-20 sm:px-6 lg:h-screen lg:px-6 lg:py-7 xl:px-8 2xl:px-10">
        <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-[var(--border-dim)] bg-[var(--bg-popover)]/95 px-4 py-3 backdrop-blur-lg lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/60 p-2.5 text-[var(--text-main)] shadow-sm"
            title="Open settings menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 text-right">
            <p className="text-sm font-black uppercase tracking-wider">Omnivy</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Settings
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
          {activeTab === 'general' && (
            <GeneralTab behavior={behavior} dispatch={dispatch} />
          )}

          {activeTab === 'appearance' && (
            <AppearanceTab uiState={uiState} dispatch={dispatch} />
          )}

          {activeTab === 'connections' && (
            <ConnectionsTab 
              vaultNames={vaultNames} 
              currentNameInput={currentNameInput} 
              setCurrentNameInput={setCurrentNameInput} 
              handleVaultAdd={handleVaultAdd} 
              handleRemoveName={handleRemoveName} 
            />
          )}

          {activeTab === 'clipper-history' && (
            <ClipperHistoryPanel authenticated={authState.authenticated} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Settings

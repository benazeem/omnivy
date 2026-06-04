import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Settings as SettingsIcon,
  Database,
  Palette,
  Cpu,
  Clipboard,
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
      className={`flex min-h-screen w-full bg-[var(--bg-popover)] text-[var(--text-main)] font-sans overflow-hidden`}
    >
      <SettingsNotification />

      <SettingsSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        menuItems={menuItems} 
      />

      {/* Fluid Content Area */}
      <main className="flex-grow p-10 lg:p-16 h-screen overflow-y-auto w-full">
        <div className="w-full space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
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

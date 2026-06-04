import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CircleUserRound,
  Database,
  FolderSync,
  Link,
  Loader2,
  X,
} from 'lucide-react'
import { Button } from '@omnivy/ui'
import { API_BASE_URL } from '@/config/api'
import { usePrefersDarkMode } from '@/hooks/usePrefersDarkMode'
import handleCloudFileRefresh from '@/services/handlers/fileRefreshHandlers'
import type { AppDispatch, RootState } from '@/store' 
import type { ActionState, CloudAction, CloudConnectorProps } from '@/types'
import { actionLabels, brandConfig } from '@/constants/connector'
 

function CloudConnector({ cloud, setCloud }: CloudConnectorProps) {
  const connectorRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [actionState, setActionState] = useState<ActionState>({
    status: 'idle',
  })
  const dispatch = useDispatch<AppDispatch>()
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const systemPrefersDarkMode = usePrefersDarkMode()
  const isDark =
    uiTheme === 'system'
      ? systemPrefersDarkMode
      : uiTheme === 'dark' || uiTheme === 'amoled'

  const cloudState = useSelector((state: RootState) => {
    const cloudStateMap = {
      gdrive: state.googleDrive,
      onedrive: state.onedrive,
      dropbox: state.dropbox,
      notion: state.notion,
    }
    return cloudStateMap[cloud]
  })

  const authenticated = cloudState.connected
  const userInfo = cloudState.userInfo
  const refreshableCloud = cloud === 'notion' ? null : cloud
  const brand = brandConfig[cloud]
  const brandIcon = isDark && 'darkIcon' in brand ? brand.darkIcon : brand.icon
  const isActionRunning = actionState.status === 'running'

  const handleClose = useCallback(() => {
    setCloud(null)
  }, [setCloud])

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement

    function handleClickOutside(event: MouseEvent) {
      if (
        connectorRef.current &&
        !connectorRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    closeButtonRef.current?.focus()
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus()
      }
    }
  }, [handleClose])

  const runAction = useCallback(
    async (action: CloudAction, operation: () => Promise<boolean>) => {
      if (isActionRunning) return

      setActionState({ action, status: 'running' })

      try {
        const succeeded = await operation()
        setActionState({ action, status: succeeded ? 'success' : 'error' })
      } catch {
        setActionState({ action, status: 'error' })
      }
    },
    [isActionRunning],
  )

  const actionMessage =
    actionState.action &&
    (actionState.status === 'running'
      ? `${actionLabels[actionState.action]}...`
      : actionState.status === 'success'
        ? `${actionLabels[actionState.action]} completed.`
        : actionState.status === 'error'
          ? `${actionLabels[actionState.action]} failed. Check the notification for details.`
          : null)

  const openIntegrations = () => {
    window.open(
      `${API_BASE_URL}/settings/integrations?provider=${cloud}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cloud-connector-title"
      aria-describedby="cloud-connector-description"
    >
      <div
        ref={connectorRef}
        className="relative w-full max-w-md bg-[var(--bg-main)] border border-[var(--border-dim)] rounded-3xl shadow-2xl p-8 space-y-6 overflow-hidden animate-in zoom-in-95 duration-300"
        aria-busy={isActionRunning}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 bg-gradient-to-br ${brand.gradient} rounded-2xl border ${brand.accentBorder} flex items-center justify-start shadow-inner`}
            >
              <img
                className="w-8 h-8 object-contain"
                draggable="false"
                onContextMenu={(event) => event.preventDefault()}
                src={brandIcon}
                alt={brand.name}
              />
            </div>
            <div>
              <h3
                id="cloud-connector-title"
                className="text-xl font-black font-display tracking-tight text-[var(--text-main)]"
              >
                {brand.name}
              </h3>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    authenticated
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      : 'bg-[var(--bg-muted)] border-[var(--border-dim)] text-[var(--text-muted)]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      authenticated
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-gray-400'
                    }`}
                  />
                  {authenticated ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          <Button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent hover:border-[var(--border-dim)] transition-all outline-none"
          >
            <X size={18} />
          </Button>
        </div>

        <p
          id="cloud-connector-description"
          className="text-sm text-[var(--text-muted)] leading-relaxed"
        >
          {brand.description}
        </p>

        {userInfo && (
          <div className="p-4 rounded-2xl bg-[var(--bg-muted)]/50 border border-[var(--border-dim)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {userInfo.picture ? (
              <img
                className="w-12 h-12 rounded-full object-cover border border-[var(--border-dim)] shadow-sm"
                draggable={false}
                src={userInfo.picture}
                alt={userInfo.name}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] border border-[var(--border-dim)] flex items-center justify-center text-[var(--text-muted)]">
                <CircleUserRound size={24} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-[var(--text-main)] truncate">
                {userInfo.name}
              </h4>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {userInfo.email}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {!authenticated ? (
            <Button
              disabled={isActionRunning}
              onClick={openIntegrations}
              className={`w-full py-4 rounded-2xl font-black text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${brand.connectButton}`}
            >
              <Link size={16} />
              Connect on Website
            </Button>
          ) : (
            <Button
              disabled={isActionRunning}
              onClick={openIntegrations}
              className={`w-full py-4 rounded-2xl font-black text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${brand.connectButton}`}
            >
              <Link size={16} />
              Manage on Website
            </Button>
          )}

          {authenticated &&
            (refreshableCloud ? (
              <div>
                <Button
                  variant="outline"
                  disabled={isActionRunning}
                  onClick={() => {
                    void runAction('sync-folders', () =>
                      handleCloudFileRefresh(refreshableCloud, dispatch),
                    )
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs border-[var(--border-dim)] hover:bg-[var(--bg-muted)] text-[var(--text-main)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionState.action === 'sync-folders' && isActionRunning ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <FolderSync size={14} />
                  )}
                  Sync Folders
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                disabled={isActionRunning}
                onClick={openIntegrations}
                className="w-full py-3 rounded-xl font-bold text-xs border-amber-500/20 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Database size={14} />
                Configure Destinations
              </Button>
            ))}

          {actionMessage && (
            <p
              className={`text-xs font-medium ${
                actionState.status === 'error'
                  ? 'text-red-500'
                  : 'text-[var(--text-muted)]'
              }`}
              role="status"
              aria-live="polite"
            >
              {actionMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CloudConnector

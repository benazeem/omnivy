import { Button } from '@omnivy/ui'
import { Database, Loader2, Mail, RefreshCcw, User } from 'lucide-react'
import type {
  CloudServiceId,
  RefreshableCloudServiceId,
  UserInfo,
} from '@/types'

export interface CloudService {
  id: CloudServiceId
  name: string
  icon: string
  connected: boolean
  userInfo: UserInfo | null
  loading: boolean
  hoverBackground: string
  accentBorder: string
}

interface CloudServiceCardProps {
  service: CloudService
  onManage: () => void
  onOpen: (serviceId: CloudServiceId) => void
  onRefresh: (serviceId: RefreshableCloudServiceId) => void
}

const actionColor: Record<CloudServiceId, string> = {
  gdrive:
    'text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300',
  onedrive:
    'text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300',
  dropbox:
    'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300',
  notion:
    'text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300',
}

const isRefreshable = (
  serviceId: CloudServiceId,
): serviceId is RefreshableCloudServiceId => serviceId !== 'notion'

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

const CloudServiceCard = ({
  service,
  onManage,
  onOpen,
  onRefresh,
}: CloudServiceCardProps) => {
  const displayName = service.userInfo?.name || service.userInfo?.email || ''
  const email = service.userInfo?.email || ''

  return (
    <div
      className={`grid gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
        service.connected
          ? `${service.hoverBackground} ${service.accentBorder} shadow-sm`
          : 'bg-[var(--bg-muted)]/50 border-[var(--border-dim)] hover:border-brand-500/40'
      }`}
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <Button
          type="button"
          onClick={() => onOpen(service.id)}
          className="flex min-w-0 flex-1 items-start justify-start gap-3 sm:gap-4 text-left bg-transparent hover:bg-transparent border-0 p-0 shadow-none h-auto text-[var(--text-main)]"
          aria-label={`${service.name}: ${
            service.connected ? 'connected' : 'not connected'
          }`}
        >
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-[var(--border-dim)] flex shrink-0 items-center justify-center">
            <img
              className="w-6 h-6 object-contain"
              draggable="false"
              onContextMenu={(event) => event.preventDefault()}
              src={service.icon}
              alt=""
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-base sm:text-lg leading-tight text-[var(--text-main)] break-words">
              {service.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              {service.loading ? (
                <>
                  <Loader2
                    size={10}
                    className="animate-spin shrink-0 text-[var(--text-muted)]"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                    Checking connection...
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      service.connected
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-gray-400 dark:bg-gray-600'
                    }`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                    {service.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </>
              )}
            </div>
          </div>
        </Button>
      </div>

      {service.connected && service.userInfo && (
        <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-[var(--bg-popover)]/70 border border-[var(--border-dim)] p-3">
          {service.userInfo.picture ? (
            <img
              src={service.userInfo.picture}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover border border-[var(--border-dim)]"
            />
          ) : (
            <div className="h-9 w-9 shrink-0 rounded-full bg-brand-600/15 text-brand-600 flex items-center justify-center text-xs font-black">
              {getInitials(displayName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
              <User size={12} className="shrink-0 text-[var(--text-muted)]" />
              <span className="truncate">{displayName || 'Connected account'}</span>
            </p>
            {email && (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[var(--text-muted)]">
                <Mail size={12} className="shrink-0" />
                <span className="truncate">{email}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {service.loading ? (
        <div className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-[var(--border-dim)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
          <Loader2 size={12} className="animate-spin shrink-0" />
          Loading...
        </div>
      ) : (
        service.connected && (
          <Button
            type="button"
            onClick={() => {
              if (isRefreshable(service.id)) {
                onRefresh(service.id)
              } else {
                onManage()
              }
            }}
            className={`w-full justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-current/20 hover:bg-white/5 active:scale-95 sm:w-fit sm:justify-start ${actionColor[service.id]}`}
          >
            {service.id === 'notion' ? (
              <Database size={12} />
            ) : (
              <RefreshCcw size={12} />
            )}
            {service.id === 'notion' ? 'Configure Destinations' : 'Sync Folders'}
          </Button>
        )
      )}
    </div>
  )
}

export default CloudServiceCard

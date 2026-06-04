import { Button } from '@omnivy/ui'
import { Database, Loader2, RefreshCcw } from 'lucide-react'
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

const CloudServiceCard = ({
  service,
  onManage,
  onOpen,
  onRefresh,
}: CloudServiceCardProps) => (
  <div
    className={`flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
      service.connected
        ? `${service.hoverBackground} ${service.accentBorder} shadow-sm`
        : 'bg-[var(--bg-muted)]/50 border-[var(--border-dim)] hover:border-[var(--border-dim-hover)]'
    }`}
  >
    <Button
      type="button"
      onClick={() => onOpen(service.id)}
      className="flex min-w-0 flex-1 items-center justify-start gap-4 text-left bg-transparent hover:bg-transparent border-0 p-0 shadow-none h-auto text-[var(--text-main)]"
      aria-label={`${service.name}: ${
        service.connected ? 'connected' : 'not connected'
      }`}
    >
      <div className="p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-[var(--border-dim)] flex items-center justify-start">
        <img
          className="w-6 h-6 object-contain"
          draggable="false"
          onContextMenu={(event) => event.preventDefault()}
          src={service.icon}
          alt=""
        />
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-sm text-[var(--text-main)]">
          {service.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
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
        {service.connected && service.userInfo && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-main)] border border-[var(--border-dim)]">
              <span className="font-black uppercase tracking-wider">
                {service.userInfo.name}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-main)] border border-[var(--border-dim)]">
              {service.userInfo.email}
            </span>
          </div>
        )}
      </div>
    </Button>

    {service.loading ? (
      <div className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border-dim)] text-[var(--text-muted)] flex items-center gap-1.5">
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
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-current/20 hover:bg-white/5 active:scale-95 ${actionColor[service.id]}`}
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

export default CloudServiceCard

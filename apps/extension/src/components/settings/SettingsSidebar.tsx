import {
  Settings as SettingsIcon,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import AuthUserBadge from '../AuthUserBadge'
import { Button } from '@omnivy/ui'
import { API_BASE_URL } from '@/config/api'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  comingSoon?: boolean
}

interface SettingsSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  menuItems: MenuItem[]
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapsed: () => void
}

const SettingsSidebar = ({
  activeTab,
  setActiveTab,
  menuItems,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapsed,
}: SettingsSidebarProps) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[min(88vw,20rem)] flex-col gap-5 overflow-y-auto border-r border-[var(--border-dim)] bg-[var(--bg-popover)] p-5 shadow-2xl transition-all duration-300 lg:static lg:z-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:bg-[var(--bg-muted)]/30 lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'lg:w-20 lg:p-4' : 'lg:w-60 lg:p-5 xl:w-64 xl:p-6 2xl:w-72'}`}
    >
      <div
        className={`flex items-center gap-4 px-1 ${
          isCollapsed ? 'lg:justify-center' : 'justify-between'
        }`}
      >
        <div
          className={`flex min-w-0 items-center gap-3 ${
            isCollapsed ? 'lg:hidden' : ''
          }`}
        >
          <div className="p-2.5 bg-brand-600 rounded-2xl shadow-lg shadow-brand-600/20">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex min-w-0 flex-col">
              <span className="font-display font-black text-xl tracking-tight leading-none truncate">
                Omnivy
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">
                Extension Settings
              </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden rounded-xl p-2 text-[var(--text-muted)] hover:bg-black/5 hover:text-[var(--text-main)] dark:hover:bg-white/5 lg:block"
          title={isCollapsed ? 'Expand settings sidebar' : 'Collapse settings sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-[var(--text-muted)] hover:bg-black/5 hover:text-[var(--text-main)] dark:hover:bg-white/5 lg:hidden"
          title="Close settings menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={`rounded-2xl bg-[var(--bg-muted)]/50 lg:bg-[var(--bg-popover)] border border-[var(--border-dim)] ${isCollapsed ? 'lg:px-1 lg:py-2' : 'px-2 py-3'}`}>
        <div className={isCollapsed ? 'lg:hidden' : ''}>
          <AuthUserBadge />
        </div>
        {isCollapsed && (
          <div className="hidden lg:block">
            <AuthUserBadge compact />
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => {
              if (!item.comingSoon) {
                setActiveTab(item.id)
                onClose()
              }
            }}
            title={isCollapsed ? item.label : undefined}
            className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              item.comingSoon
                ? 'text-[var(--text-muted)]/40 cursor-not-allowed opacity-50'
                : activeTab === item.id
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20'
                  : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5'
            } ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`}
            disabled={item.comingSoon}
          >
            <div className={`flex min-w-0 items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              {item.icon}
              <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>
                {item.label}
              </span>
            </div>
            {item.comingSoon ? (
              <span className={`shrink-0 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-500 rounded-lg border border-amber-500/20 ${isCollapsed ? 'lg:hidden' : ''}`}>
                Soon
              </span>
            ) : (
              activeTab === item.id && (
                <ChevronRight
                  size={14}
                  className={isCollapsed ? 'lg:hidden' : ''}
                />
              )
            )}
          </Button>
        ))}
      </nav>

      <div className={`mt-auto p-4 bg-brand-500/5 rounded-3xl border border-brand-500/10 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-2">
            System Status
          </p>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold">All services active</span>
          </div>
          <a
            href={`${API_BASE_URL}/documentation`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black text-[var(--text-main)] hover:text-brand-600 flex items-center gap-2 transition-colors"
          >
            Documentation <ExternalLink size={12} />
          </a>
      </div>
      {isCollapsed && (
        <a
          href={`${API_BASE_URL}/documentation`}
          target="_blank"
          rel="noopener noreferrer"
          title="Documentation"
          className="mt-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-500/10 bg-brand-500/5 text-[var(--text-muted)] hover:text-brand-600"
        >
          <ExternalLink size={16} />
        </a>
      )}
    </aside>
  )
}

export default SettingsSidebar

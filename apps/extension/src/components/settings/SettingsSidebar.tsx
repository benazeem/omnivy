import {
  Settings as SettingsIcon,
  ChevronRight,
  ExternalLink,
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
}

const SettingsSidebar = ({
  activeTab,
  setActiveTab,
  menuItems,
}: SettingsSidebarProps) => {
  return (
    <aside className="w-80 border-r border-[var(--border-dim)] bg-[var(--bg-muted)]/30 p-8 flex flex-col gap-10 shrink-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-4 px-2">
        <div className="p-2.5 bg-brand-600 rounded-2xl shadow-lg shadow-brand-600/20">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-xl tracking-tight leading-none">
            Omnivy
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">
            Extension Settings
          </span>
        </div>
      </div>

      <div className="px-2 py-3 rounded-2xl bg-[var(--bg-popover)] border border-[var(--border-dim)]">
        <AuthUserBadge />
      </div>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => !item.comingSoon && setActiveTab(item.id)}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              item.comingSoon
                ? 'text-[var(--text-muted)]/40 cursor-not-allowed opacity-50'
                : activeTab === item.id
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20 translate-x-2'
                  : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1'
            }`}
            disabled={item.comingSoon}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </div>
            {item.comingSoon ? (
              <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-500 rounded-lg border border-amber-500/20">
                Soon
              </span>
            ) : (
              activeTab === item.id && <ChevronRight size={14} />
            )}
          </Button>
        ))}
      </nav>

      <div className="mt-auto p-5 bg-brand-500/5 rounded-3xl border border-brand-500/10">
        <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-2">
          System Status
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold">All services active</span>
        </div>
        <a
          href={`${API_BASE_URL}/documentation`}
          className="text-xs font-black text-[var(--text-main)] hover:text-brand-600 flex items-center gap-2 transition-colors"
        >
          Documentation <ExternalLink size={12} />
        </a>
      </div>
    </aside>
  )
}

export default SettingsSidebar

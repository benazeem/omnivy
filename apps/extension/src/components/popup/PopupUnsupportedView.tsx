import type { PopupUnsupportedViewProps } from '@/types/popup'
import { AlertCircle, ExternalLink } from 'lucide-react'


const PopupUnsupportedView = ({
  pageTitle,
  pageUrl,
  popupError,
  onOpenWebsiteIntegrations,
}: PopupUnsupportedViewProps) => (
  <main className="flex-grow flex items-center justify-center px-5 pb-6">
    <div className="w-full rounded-3xl border border-[var(--border-dim)] bg-[var(--bg-main)] p-5 shadow-xl space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <AlertCircle size={18} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black tracking-tight">
            This page can't be clipped here
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Chrome blocks content scripts on this kind of page, so the normal
            capture UI is unavailable.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-muted)]/60 p-3 text-xs text-[var(--text-muted)] space-y-2">
        <div className="font-bold text-[var(--text-main)]">Page details</div>
        <div className="truncate">{pageTitle || 'No page title available'}</div>
        <div className="truncate">{pageUrl || 'No page URL available'}</div>
        {popupError && <div className="text-amber-500">{popupError}</div>}
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={onOpenWebsiteIntegrations}
          className="w-full py-3 rounded-2xl font-black text-sm bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          Open Website Settings
        </button>
        <button
          type="button"
          onClick={() => window.close()}
          className="w-full py-3 rounded-2xl font-black text-sm border border-[var(--border-dim)] hover:bg-[var(--bg-muted)] text-[var(--text-main)]"
        >
          Close
        </button>
      </div>
    </div>
  </main>
)

export default PopupUnsupportedView


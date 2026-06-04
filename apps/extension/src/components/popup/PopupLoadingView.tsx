import { Loader2 } from 'lucide-react'

const PopupLoadingView = () => (
  <main className="flex-grow flex items-center justify-center px-5 pb-6">
    <div className="w-full rounded-3xl border border-[var(--border-dim)] bg-[var(--bg-main)] p-6 shadow-xl space-y-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/10 border border-brand-600/20 text-brand-600">
        <Loader2 size={24} className="animate-spin" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-black tracking-tight">
          Extracting clip data
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Reading the current page and preparing the save fields.
        </p>
      </div>
    </div>
  </main>
)

export default PopupLoadingView


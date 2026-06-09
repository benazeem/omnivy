import { useEffect, useState } from 'react'
import { Clock3, ExternalLink, Loader2, RefreshCcw, Search } from 'lucide-react'
import { Button, Card } from '@omnivy/ui'
import { getClipsHistory } from '@/services/api/saasClient'
import type { ClipRecord } from '@/types/api'

interface ClipperHistoryPanelProps {
  authenticated: boolean
}

export default function ClipperHistoryPanel({ authenticated }: ClipperHistoryPanelProps) {
  const [clips, setClips] = useState<ClipRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    if (!authenticated) return

    let active = true
    const load = async () => {
      setLoading(true)
      setError(null)
      const result = await getClipsHistory(page, 5)
      if (!active) return

      if (result.success && result.data?.clips) {
        setClips(result.data.clips)
      } else {
        setError(result.error || 'Unable to load clip history')
      }
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [authenticated, page, refreshTick])

  if (!authenticated) return null

  return (
    <section className="glass-panel p-5 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 rounded-xl">
              <Clock3 className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
              Clipper History
            </h3>
          </div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Recently saved clips from the authenticated Omnivy account. Use this as a quick activity snapshot when you are connected.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setRefreshTick((current) => current + 1)}
          className="w-full sm:w-auto rounded-xl border-[var(--border-dim)] text-xs font-bold"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] py-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading clip history...
        </div>
      ) : error ? (
        <Card className="p-4 border border-red-500/20 bg-red-500/5 text-sm text-red-600 dark:text-red-300 rounded-2xl">
          {error}
        </Card>
      ) : clips.length === 0 ? (
        <Card className="p-6 border border-[var(--border-dim)] bg-[var(--bg-muted)]/50 rounded-2xl text-sm text-[var(--text-muted)]">
          No clips have been saved yet. Your first few items will appear here once the extension starts clipping.
        </Card>
      ) : (
        <div className="space-y-3">
          {clips.map((clip) => (
            <Card
              key={clip.id}
              className="p-4 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-main)]/80 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    <h4 className="font-bold text-sm text-[var(--text-main)] truncate">
                      {clip.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {clip.url || 'No source URL recorded'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {clip.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-muted)] border border-[var(--border-dim)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                    {new Date(clip.createdAt).toLocaleDateString()}
                  </span>
                  {clip.url && (
                    <a
                      href={clip.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
                    >
                      <ExternalLink size={12} />
                      Open source
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1 || loading}
          className="rounded-xl border-[var(--border-dim)] text-xs font-bold"
        >
          Previous
        </Button>
        <span className="text-center text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Page {page}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPage((current) => current + 1)}
          disabled={loading}
          className="rounded-xl border-[var(--border-dim)] text-xs font-bold"
        >
          Next
        </Button>
      </div>
    </section>
  )
}

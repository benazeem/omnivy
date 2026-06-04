'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  ArrowRight,
  Cloud,
  Database,
  ExternalLink,
  FileText,
  HardDrive,
  Layers,
  Loader2,
  RefreshCcw,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'
import type { ClipRecord, ProviderConnection } from '@/types/api'
import { Avatar, AvatarFallback, AvatarImage, Button, Card } from '@omnivy/ui'

const PROVIDER_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  gdrive: { label: 'Google Drive', icon: <HardDrive className="w-4 h-4" /> },
  onedrive: { label: 'OneDrive', icon: <Cloud className="w-4 h-4" /> },
  dropbox: { label: 'Dropbox', icon: <Database className="w-4 h-4" /> },
  notion: { label: 'Notion', icon: <Layers className="w-4 h-4" /> },
}

const PROFILE_SECTIONS = [
  {
    title: 'Identity',
    description: 'Your Omnivy account identity and session state.',
  },
  {
    title: 'Connections',
    description: 'All connected cloud providers and sync targets.',
  },
  {
    title: 'Activity',
    description: 'Recent clips and synced content across services.',
  },
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [connections, setConnections] = useState<ProviderConnection[]>([])
  const [clips, setClips] = useState<ClipRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statusRes, clipsRes] = await Promise.all([
        fetch('/api/providers/status'),
        fetch('/api/clips?limit=8'),
      ])

      if (statusRes.ok) {
        const data = await statusRes.json()
        setConnections(data.connections || [])
      }

      if (clipsRes.ok) {
        const data = await clipsRes.json()
        setClips(data.clips || [])
      }
    } catch {
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') loadProfile()
    if (status === 'unauthenticated') setLoading(false)
  }, [status, loadProfile])

  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Sign in to view your profile</h1>
        <p className="text-secondary mb-8 max-w-md">
          See your account, cloud connections, and recent activity in one place.
        </p>
        <Button asChild variant="default" className="px-6 py-3 rounded-xl font-bold">
          <Link href="/auth/signin?callbackUrl=/profile">Sign in</Link>
        </Button>
      </div>
    )
  }

  const user = session.user
  const activeConnections = connections.filter((connection) => connection.status === 'active').length
  const totalClips = clips.length

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6 items-stretch">
          <Card className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 rounded-2xl border border-brand-500/30">
                  <AvatarImage src={user.image || undefined} alt={user.name || 'User'} className="object-cover" />
                  <AvatarFallback className="rounded-2xl bg-brand-500/10 text-brand-500">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2">
                    Profile
                  </p>
                  <h1 className="text-3xl font-display font-extrabold tracking-tight">
                    {user.name || 'Your account'}
                  </h1>
                  <p className="text-secondary text-sm mt-1">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={loadProfile}
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button asChild variant="default" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
                  <Link href="/settings/integrations">
                    <Settings className="w-4 h-4" />
                    Manage integrations
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Status</p>
                <p className="mt-2 text-lg font-bold text-emerald-500">Authenticated</p>
              </div>
              <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Connections</p>
                <p className="mt-2 text-lg font-bold">{activeConnections} active</p>
              </div>
              <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Clips</p>
                <p className="mt-2 text-lg font-bold">{totalClips} recent</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">Profile overview</p>
            <div className="space-y-4">
              {PROFILE_SECTIONS.map((section) => (
                <div key={section.title} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <h2 className="font-bold mb-1">{section.title}</h2>
                  <p className="text-sm text-secondary">{section.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Cloud className="w-5 h-5 text-brand-500" />
            Connected providers
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-secondary text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : (
              <div className="grid sm:grid-cols-2 gap-4">
              {(['gdrive', 'onedrive', 'dropbox', 'notion'] as const).map((key) => {
                const conn = connections.find((connection) => connection.provider === key)
                const meta = PROVIDER_LABELS[key]
                const active = conn?.status === 'active'
                return (
                  <div
                    key={key}
                    className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-white/5 text-secondary'}`}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{meta.label}</p>
                        <p className="text-xs text-secondary">
                          {active ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            Recent activity
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-secondary text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading activity…
            </div>
          ) : clips.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-[var(--border-color)] text-center text-secondary text-sm">
              No activity yet. Use the extension to save your first clip.
            </div>
          ) : (
            <ul className="space-y-3">
              {clips.map((clip) => (
                <li
                  key={clip.id}
                  className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold truncate">{clip.title}</p>
                    <p className="text-xs text-secondary mt-1">
                      {new Date(clip.createdAt).toLocaleString()} · {clip.status}
                    </p>
                    {clip.tags?.length > 0 && (
                      <p className="text-xs text-brand-500 mt-1">
                        {clip.tags.join(', ')}
                      </p>
                    )}
                  </div>
                  {clip.url && (
                    <a
                      href={clip.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${clip.title}`}
                      className="shrink-0 p-2 rounded-lg hover:bg-white/5 text-secondary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="p-6 rounded-2xl bg-brand-500/5 border border-brand-500/20">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Shortcuts
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="default" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
              <Link href="/settings/integrations">
                <Settings className="w-4 h-4" />
                Integrations
              </Link>
            </Button>
            <Button asChild variant="outline" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
              <Link href="/install">
                <ArrowRight className="w-4 h-4" />
                Install extension
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
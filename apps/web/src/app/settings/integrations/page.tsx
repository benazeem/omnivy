'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import {
  Cloud,
  Shield,
  Check,
  X,
  ExternalLink,
  RefreshCcw,
  Unlink,
  Plus,
  ArrowLeft,
  Sparkles,
  HardDrive,
  Database,
  Layers,
  BookOpen,
  AlertCircle,
  User,
  Mail,
} from 'lucide-react'
import { Input, Button } from '@omnivy/ui'

interface ProviderConnection {
  provider: string
  status: string
  scopes: string[]
  updatedAt: string
}

interface ProviderUserInfo {
  id?: string
  account_id?: string
  name?: string
  displayName?: string
  email?: string
  mail?: string
  picture?: string | null
  profile_photo_url?: string | null
}

const PROVIDER_CONFIG: Record<
  string,
  {
    name: string
    description: string
    icon: React.ReactNode
    gradient: string
    accentColor: string
    borderColor: string
    docsUrl: string
  }
> = {
  gdrive: {
    name: 'Google Drive',
    description: 'Save clippings as markdown files to your Google Drive.',
    icon: <HardDrive className="w-5 h-5" />,
    gradient: 'from-emerald-500/15 to-teal-500/15',
    accentColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/25',
    docsUrl: 'https://developers.google.com/drive',
  },
  onedrive: {
    name: 'Microsoft OneDrive',
    description: 'Sync clippings to your OneDrive app folder.',
    icon: <Cloud className="w-5 h-5" />,
    gradient: 'from-blue-500/15 to-indigo-500/15',
    accentColor: 'text-blue-500',
    borderColor: 'border-blue-500/25',
    docsUrl: 'https://docs.microsoft.com/onedrive',
  },
  dropbox: {
    name: 'Dropbox',
    description: 'Upload clippings directly to your Dropbox storage.',
    icon: <Database className="w-5 h-5" />,
    gradient: 'from-indigo-500/15 to-violet-500/15',
    accentColor: 'text-indigo-500',
    borderColor: 'border-indigo-500/25',
    docsUrl: 'https://www.dropbox.com/developers',
  },
  notion: {
    name: 'Notion',
    description: 'Save clippings to selected Notion pages or databases.',
    icon: <Layers className="w-5 h-5" />,
    gradient: 'from-amber-500/15 to-orange-500/15',
    accentColor: 'text-amber-500',
    borderColor: 'border-amber-500/25',
    docsUrl: 'https://developers.notion.com',
  },
}

const UPCOMING_PROVIDERS = [
  { name: 'Evernote', status: 'Q3 2026' },
  { name: 'Readwise', status: 'Q4 2026' },
  { name: 'Zotero', status: 'Q4 2026' },
  { name: 'Todoist', status: 'Q1 2027' },
  { name: 'Raindrop.io', status: 'Q1 2027' },
]

export default function IntegrationsSettingsPage() {
  const [connections, setConnections] = useState<ProviderConnection[]>([])
  const [providerUserInfo, setProviderUserInfo] = useState<Record<string, ProviderUserInfo>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const popupRef = useRef<Window | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const [refreshingFolders, setRefreshingFolders] = useState<string | null>(null)
  const autoConnectStartedRef = useRef(false)

  const handleRefreshFolders = async (provider: string) => {
    setRefreshingFolders(provider)
    try {
      const res = await fetch(`/api/providers/folders?provider=${provider}`)
      if (!res.ok) throw new Error('Failed to refresh folders')
      
      const data = await res.json()
      if (data.success) {
        setNotification({
          type: 'success',
          message: `${PROVIDER_CONFIG[provider]?.name || provider} folders refreshed successfully!`,
        })
      } else {
        throw new Error(data.error || 'Failed to refresh folders')
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to refresh folders',
      })
    } finally {
      setRefreshingFolders(null)
    }
  }
 
  const [showNotionModal, setShowNotionModal] = useState(false)
  const [notionDestinations, setNotionDestinations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const fetchNotionDestinations = async () => {
    try {
      const res = await fetch('/api/providers/destinations?provider=notion')
      if (res.ok) {
        const data = await res.json()
        setNotionDestinations(data.destinations || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSearchNotion = async () => {
    setIsSearching(true)
    try {
      const res = await fetch(`/api/providers/destinations/search?provider=notion&query=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.results || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddDestination = async (item: any) => {
    try {
      const res = await fetch('/api/providers/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'notion',
          resourceId: item.resourceId,
          resourceType: item.resourceType,
          name: item.name,
          metadata: item.metadata,
        }),
      })
      if (res.ok) {
        setNotification({ type: 'success', message: `Added "${item.name}" as destination.` })
        fetchNotionDestinations()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveDestination = async (resourceId: string, name: string) => {
    try {
      const res = await fetch('/api/providers/destinations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'notion',
          resourceId,
        }),
      })
      if (res.ok) {
        setNotification({ type: 'success', message: `Removed "${name}" from destinations.` })
        fetchNotionDestinations()
      }
    } catch (e) {
      console.error(e)
    }
  }
 
  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/providers/status')
      if (!res.ok) throw new Error('Failed to fetch connections')
      const data = await res.json()
      const nextConnections = data.connections || []
      setConnections(nextConnections)

      const activeProviders = nextConnections
        .filter((connection: ProviderConnection) => connection.status === 'active')
        .map((connection: ProviderConnection) => connection.provider)

      const userInfoEntries = await Promise.all(
        activeProviders.map(async (provider: string) => {
          try {
            const infoRes = await fetch(`/api/providers/userinfo?provider=${provider}`)
            if (!infoRes.ok) return null
            return [provider, await infoRes.json()] as const
          } catch {
            return null
          }
        }),
      )

      setProviderUserInfo(
        Object.fromEntries(userInfoEntries.filter(Boolean) as Array<readonly [string, ProviderUserInfo]>),
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
 
    const handleOauthMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'oauth-success') {
        if (pollRef.current) clearInterval(pollRef.current)
        setIsConnecting(false)
        setActionInProgress(null)
        
        const service = event.data.provider
        setNotification({
          type: 'success',
          message: `${PROVIDER_CONFIG[service || '']?.name || service} connected successfully!`,
        })
        await fetchConnections()
      }
      if (event.data?.type === 'oauth-error') {
        if (pollRef.current) clearInterval(pollRef.current)
        setIsConnecting(false)
        setActionInProgress(null)

        setNotification({
          type: 'error',
          message: `Connection failed: ${event.data.error || 'Unknown error'}`,
        })
      }
    }
    window.addEventListener('message', handleOauthMessage)
 
    const params = new URLSearchParams(window.location.search)
    if (params.get('connect') === 'success') {
      const service = params.get('service')
      setNotification({
        type: 'success',
        message: `${PROVIDER_CONFIG[service || '']?.name || service} connected successfully!`,
      }) 
      window.history.replaceState({}, '', '/settings/integrations')
    }
    if (params.get('error')) {
      setNotification({
        type: 'error',
        message: `Connection failed: ${params.get('error')}`,
      })
      window.history.replaceState({}, '', '/settings/integrations')
    }

    const provider = params.get('provider')
    if (provider && !autoConnectStartedRef.current) {
      autoConnectStartedRef.current = true
      window.history.replaceState({}, '', '/settings/integrations')
      handleConnect(provider)
    }

    return () => {
      window.removeEventListener('message', handleOauthMessage)
    }
  }, [])
 
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const isConnected = (provider: string) => {
    return connections.some(
      (c) => c.provider === provider && c.status === 'active'
    )
  }

  const getConnectionInfo = (provider: string) => {
    return connections.find((c) => c.provider === provider)
  }

  const getUserInfo = (provider: string) => {
    return providerUserInfo[provider]
  }

  const getUserName = (info?: ProviderUserInfo) => {
    return info?.displayName || info?.name || info?.email || info?.mail || ''
  }

  const getUserEmail = (info?: ProviderUserInfo) => {
    return info?.email || info?.mail || ''
  }

  const getUserAvatar = (info?: ProviderUserInfo) => {
    return info?.picture || info?.profile_photo_url || null
  }

  const getInitials = (value: string) =>
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U'

  const cancelConnection = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close()
    }
    setIsConnecting(false)
    setActionInProgress(null)
  }

  const handleConnect = (provider: string) => {
    setActionInProgress(provider)
    setIsConnecting(true)
     
    const width = 600
    const height = 650
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    
    const popup = window.open(
      `/api/providers/connect/${provider}`,
      `Connect ${provider}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no,scrollbars=yes`
    )
    popupRef.current = popup
 
    let pollCount = 0
    const pollInterval = setInterval(async () => {
      try {
        pollCount++
        const res = await fetch('/api/providers/status')
        if (res.ok) {
          const data = await res.json()
          const isConnectedNow = data.connections?.some(
            (c: any) => c.provider === provider && c.status === 'active'
          )
          
          if (isConnectedNow) {
            clearInterval(pollInterval)
            setIsConnecting(false)
            setActionInProgress(null)
            setNotification({
              type: 'success',
              message: `${PROVIDER_CONFIG[provider]?.name || provider} connected successfully!`,
            })
            await fetchConnections()
            if (popup && !popup.closed) {
              popup.close()
            }
            return
          }
        }
      } catch (e) {
        console.error("Polling error:", e)
      }
 
      if (pollCount > 120) {
        clearInterval(pollInterval)
        setIsConnecting(false)
        setActionInProgress(null)
      }
       
    }, 1500)

    pollRef.current = pollInterval
  }

  const handleDisconnect = async (provider: string) => {
    setActionInProgress(provider)
    try {
      const res = await fetch(`/api/providers/disconnect/${provider}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Disconnect failed')
      setNotification({
        type: 'success',
        message: `${PROVIDER_CONFIG[provider]?.name || provider} disconnected successfully.`,
      })
      await fetchConnections()
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message })
    } finally {
      setActionInProgress(null)
    }
  }

  const connectedCount = connections.filter(
    (c) => c.status === 'active'
  ).length

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto space-y-8">
 
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border ${
                notification.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
            >
              {notification.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {notification.message}
              <Button
                onClick={() => setNotification(null)}
                title="Dismiss notification"
                variant="ghost"
                size="icon"
                className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
 
        <AnimatePresence>
          {actionInProgress && isConnecting && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
                 <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-6" />
                 <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Connecting {PROVIDER_CONFIG[actionInProgress]?.name || actionInProgress}</h3>
                 <p className="text-sm text-secondary mb-8">Please complete the authorization in the secure popup window.</p>
                 <Button onClick={cancelConnection} variant="outline" className="px-6 py-2.5 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-sm">
                   Cancel Connection
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/profile"
                title="Back to profile settings"
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-brand-500/10 text-secondary hover:text-brand-500 transition-all interactive"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
                Integrations
              </h1>
            </div>
            <p className="text-secondary text-sm ml-11">
              Connect your cloud storage and workspace providers so the
              extension can save Markdown clippings to selected destinations.
            </p>
          </div>
 
          <div className="ml-11 md:ml-0 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-[var(--border-color)]">
            <span
              className={`w-2 h-2 rounded-full ${
                connectedCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-bold">
              {connectedCount} Active Connection{connectedCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
 
        {connectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Active Sync Providers</p>
              <p className="text-xs text-secondary">
                Tokens are encrypted with AES-256-GCM and stored server-side. Your credentials never touch the browser.
              </p>
            </div>
            <div className="flex gap-2">
              {connections
                .filter((c) => c.status === 'active')
                .map((c) => (
                  <span
                    key={c.provider}
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                      PROVIDER_CONFIG[c.provider]?.accentColor || 'text-brand-500'
                    } bg-white/5 border ${
                      PROVIDER_CONFIG[c.provider]?.borderColor || 'border-brand-500/25'
                    }`}
                  >
                    {c.provider}
                  </span>
                ))}
            </div>
          </motion.div>
        )}
 
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-secondary">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                setIsLoading(true)
                fetchConnections()
              }}
              title="Retry loading connections"
              className="mt-4 px-5 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(PROVIDER_CONFIG).map(
              ([key, config], index) => {
                const connected = isConnected(key)
                const connectionInfo = getConnectionInfo(key)
                const userInfo = getUserInfo(key)
                const userName = getUserName(userInfo)
                const userEmail = getUserEmail(userInfo)
                const userAvatar = getUserAvatar(userInfo)
                const loading = actionInProgress === key

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-2xl border transition-all ${
                      connected
                        ? `bg-gradient-to-br ${config.gradient} ${config.borderColor}`
                        : 'bg-slate-50 dark:bg-white/[0.02] border-[var(--border-color)] hover:border-brand-500/30'
                    }`}
                  > 
                    <div
                      className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                        connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
 
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          connected
                            ? `bg-white/10 ${config.accentColor}`
                            : 'bg-slate-200/50 dark:bg-white/5 text-secondary'
                        }`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{config.name}</h3>
                        <p className="text-xs text-secondary">
                          {config.description}
                        </p>
                      </div>
                    </div>
 
                    {connected && connectionInfo && (
                      <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-3">
                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="h-10 w-10 shrink-0 rounded-full bg-brand-500/15 text-brand-500 flex items-center justify-center text-xs font-black">
                              {getInitials(userName)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 truncate text-xs font-black text-[var(--text-primary)]">
                              <User className="w-3.5 h-3.5 shrink-0 text-secondary" />
                              <span className="truncate">
                                {userName || 'Connected account'}
                              </span>
                            </p>
                            {userEmail && (
                              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-secondary">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{userEmail}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary">Status</span>
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        </div>
                        {connectionInfo.scopes.length > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-secondary">Scopes</span>
                            <span className="font-mono text-[10px] text-secondary truncate max-w-[180px]">
                              {connectionInfo.scopes.join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-secondary">Connected</span>
                          <span className="text-secondary">
                            {new Date(connectionInfo.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2 w-full">
                      {connected && key === 'notion' && (
                        <Button
                          onClick={() => {
                            setShowNotionModal(true)
                            fetchNotionDestinations()
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-xs font-bold"
                        >
                          <Database className="w-3.5 h-3.5" />
                          Configure Destinations
                        </Button>
                      )}

                      {connected && key !== 'notion' && (
                        <Button
                          onClick={() => handleRefreshFolders(key)}
                          disabled={loading || refreshingFolders === key}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 text-xs font-bold"
                        >
                          <RefreshCcw className={`w-3.5 h-3.5 ${refreshingFolders === key ? 'animate-spin' : ''}`} />
                          {refreshingFolders === key ? 'Refreshing...' : 'Refresh Folders'}
                        </Button>
                      )}
                      <div className="flex items-center gap-2 w-full">
                        {connected ? (
                          <>
                            <Button
                              onClick={() => handleDisconnect(key)}
                              disabled={loading}
                              variant="destructive"
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold"
                            >
                              {loading ? (
                                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Unlink className="w-3.5 h-3.5" />
                              )}
                              Disconnect
                            </Button>
                            <a
                              href={config.docsUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={`Open ${config.name} docs`}
                              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-secondary hover:text-brand-500 border border-white/5 transition-all interactive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleConnect(key)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all hover:shadow-lg disabled:opacity-50"
                          >
                            {loading ? (
                              <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                            Connect {config.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              }
            )}
          </div>
        )}
 
        <div className="pt-4">
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Upcoming Integrations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {UPCOMING_PROVIDERS.map((provider) => (
              <div
                key={provider.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-[var(--border-color)] text-center"
              >
                <p className="font-bold text-xs mb-1">{provider.name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 font-bold">
                  {provider.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notion Destinations Modal */}
      <AnimatePresence>
        {showNotionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-xl w-full text-slate-100 shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold">Manage Notion Destinations</h3>
                  <p className="text-xs text-slate-400">Save clippings directly into specific databases or parent pages.</p>
                </div>
                <Button
                  onClick={() => setShowNotionModal(false)}
                  title="Close Notion destinations"
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Configure destination list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Active Destinations</h4>
                {notionDestinations.length === 0 ? (
                  <p className="text-sm text-slate-500 italic py-2">No active destinations. Search below to add one!</p>
                ) : (
                  <div className="grid gap-2">
                    {notionDestinations.map((dest) => (
                      <div key={dest.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            {dest.resourceType === 'notion_page' ? <BookOpen className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{dest.name}</p>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                              {dest.resourceType === 'notion_page' ? 'Page' : 'Database'}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRemoveDestination(dest.resourceId, dest.name)}
                          title={`Remove ${dest.name}`}
                          variant="outline"
                          size="sm"
                          className="px-3 py-1.5 rounded-lg border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Notion Workspace */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Search Notion Workspace</h4>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search pages or databases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearchNotion}
                    disabled={isSearching}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {searchResults.map((item) => {
                      const alreadyAdded = notionDestinations.some((d) => d.resourceId === item.resourceId)
                      return (
                        <div key={item.resourceId} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                              {item.resourceType === 'notion_page' ? <BookOpen className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{item.name}</p>
                              <span className="text-[10px] text-slate-500">
                                {item.resourceType === 'notion_page' ? 'Page' : 'Database'}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddDestination(item)}
                            disabled={alreadyAdded}
                            size="sm"
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              alreadyAdded
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20'
                            }`}
                          >
                            {alreadyAdded ? 'Added' : 'Add'}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

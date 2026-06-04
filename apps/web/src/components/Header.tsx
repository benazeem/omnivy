'use client'

import Link from 'next/link'
import { Loader2, Moon, Sun, LogOut, User, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage, Button } from '@omnivy/ui'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        await signOut({ redirect: false })
        router.replace('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="h-16 w-full fixed top-0 left-0 flex items-center justify-between px-6 z-50 glass border-b border-[var(--border-dim)] shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center group">
          <div className="p-1.5 bg-brand-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <img
              src="/icon.ico"
              className="w-6 h-6 invert"
              alt="Omnivy"
              draggable="false"
            />
          </div>
          <span className="ml-3 font-display font-bold text-lg tracking-tight">
            Omnivy
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-secondary">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Home
          </Link>
          <Link
            href="/install"
            className="hover:text-brand-500 transition-colors"
          >
            Install
          </Link>
          <Link
            href="/future-improvements"
            className="hover:text-brand-500 transition-colors"
          >
            Roadmap
          </Link>
          {session?.user && (
            <>
              <Link
                href="/profile"
                className="hover:text-brand-500 transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Profile
              </Link>
              <Link
                href="/settings/integrations"
                className="hover:text-brand-500 transition-colors"
              >
                Integrations
              </Link>
            </>
          )}
          <Link
            href="/documentation"
            className="hover:text-brand-500 transition-colors"
          >
            Documentation
          </Link>
        </nav>
 
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="hidden sm:inline-flex"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </Button>

        {session?.user ? (
          <div className="flex items-center gap-3 border-l border-[var(--border-dim)] pl-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:text-brand-500 transition-colors"
              title="Open profile"
            >
              <Avatar className="size-8 border border-brand-500/30">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || 'User Avatar'}
                  draggable={false}
                />
                <AvatarFallback className="bg-brand-500/10 text-brand-500 text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-xs font-bold text-secondary truncate max-w-[100px]">
                {session.user.name}
              </span>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Log Out"
              className='hidden sm:inline'
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" className="text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        )}
      </div>
 
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-main)] border-t border-white/5 shadow-lg z-40">
          <div className="flex flex-col p-4 gap-3 text-sm">
            <Link href="/" className="block px-3 py-2 rounded hover:bg-white/5">Home</Link>
            <Link href="/install" className="block px-3 py-2 rounded hover:bg-white/5">Install</Link>
            <Link href="/future-improvements" className="block px-3 py-2 rounded hover:bg-white/5">Roadmap</Link>
            {session?.user && (
              <>
                <Link href="/profile" className="block px-3 py-2 rounded hover:bg-white/5">Profile</Link>
                <Link href="/settings/integrations" className="block px-3 py-2 rounded hover:bg-white/5">Integrations</Link>
              </>
            )}
            <Link href="/documentation" className="block px-3 py-2 rounded hover:bg-white/5">Documentation</Link>
            <div className="pt-2 border-t border-white/5 mt-2 flex items-center gap-2">
              <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </Button>
              {session?.user ? (
                <Button type="button" variant="ghost" onClick={handleLogout} className="text-sm">{isLoggingOut ? 'Logging out...' : 'Log out'}</Button>
              ) : (
                <Link href="/auth/signin" className="text-sm font-bold px-3 py-2 rounded bg-brand-600">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

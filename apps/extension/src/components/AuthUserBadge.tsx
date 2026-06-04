import { LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { API_BASE_URL } from '@/config/api'
import type {AuthUserBadgeProps} from '@/types'
import { signOutExtension } from '@/features/thunks/auth'
import { getSignInUrl } from '@/services/auth/sessionAuth'
import { Button } from '@omnivy/ui'


const AuthUserBadge = ({
  compact = false,
  showSignIn = true,
}: AuthUserBadgeProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { authenticated, loading, user } = useSelector(
    (state: RootState) => state.auth,
  )

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
        {!compact && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Checking session…
          </span>
        )}
      </div>
    )
  }

  if (!authenticated || !user) {
    if (!showSignIn) return null
    return (
      <a
        href={getSignInUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-colors"
      >
        Sign in
      </a>
    )
  }

  return (
    <div className="flex items-center justify-between p-2">
      <a
        href={`${API_BASE_URL}/profile`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 min-w-0 hover:opacity-90 transition-opacity"
        title="Open website profile"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-7 h-7 rounded-full border border-brand-500/30 shrink-0"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 text-[10px] font-bold shrink-0">
            {user.name?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
          </div>
        )}
        {!compact && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold truncate max-w-[120px]">
              {user.name || 'Signed in'}
            </span>
            {user.email && (
              <span className="text-[9px] text-[var(--text-muted)] truncate max-w-[120px]">
                {user.email}
              </span>
            )}
          </div>
        )}
      </a>
      {!compact && (
        <Button
          type="button"
          onClick={async () => {
            setIsSigningOut(true)
            try {
              await dispatch(signOutExtension())
            } finally {
              setIsSigningOut(false)
            }
          }}
          disabled={isSigningOut}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50"
          title="Sign out"
        >
          {isSigningOut ? (
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <LogOut size={14} />
          )}
        </Button>
      )}
    </div>
  )
}

export default AuthUserBadge

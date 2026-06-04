import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser } from '@/types/auth'

const initialState: AuthState = {
  authenticated: false,
  loading: true,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setAuthSession(
      state,
      action: PayloadAction<{ authenticated: boolean; user: AuthUser | null }>,
    ) {
      state.authenticated = action.payload.authenticated
      state.user = action.payload.user
      state.loading = false
    },
    clearAuth(state) {
      state.authenticated = false
      state.user = null
      state.loading = false
    },
  },
})

export const { setAuthLoading, setAuthSession, clearAuth } = authSlice.actions
export default authSlice.reducer

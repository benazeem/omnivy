export interface AuthUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

export interface AuthSession {
  authenticated: boolean
  user: AuthUser | null
}

export interface AuthState {
  authenticated: boolean
  loading: boolean
  user: AuthUser | null
}

export interface WebSessionResponse {
  active: boolean
}

export interface AuthMeResponse {
  user: AuthUser
}

export interface TokenPairResponse {
  accessToken: string
  refreshToken: string
  token?: string
  expiresIn: number
  refreshExpiresIn?: number
}

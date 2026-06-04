export interface AuthUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

export interface AuthMeResponse {
  user: AuthUser
}

export interface WebSessionResponse {
  active: boolean
}

export interface TokenPairResponse {
  accessToken: string
  refreshToken: string
  token: string
  expiresIn: number
  refreshExpiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken?: string
  scopes?: string[]
}

export interface LogoutResponse {
  success: boolean
}

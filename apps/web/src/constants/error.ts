export const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support if the problem persists.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please verify that your account has been approved.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The verification token has expired or has already been used. Please try signing in again.',
  },
  SessionExpired: {
    title: 'Session Expired',
    description: 'Your session has expired. Please sign in again to continue.',
  },
  OAuthExchangeFailed: {
    title: 'OAuth Connection Failed',
    description: 'We were unable to connect your cloud provider account. Please try again or check your provider settings.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try signing in again.',
  },
}
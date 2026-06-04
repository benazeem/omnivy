export default function errorMessage(error: unknown): string {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && 'message' in error)
    return String((error as Record<string, unknown>).message)
  return String(error)
}

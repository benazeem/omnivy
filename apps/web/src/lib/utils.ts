export function sanitizeFilename(filename: string): string {
  if (!filename) return 'Untitled'

  let safe = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  safe = safe
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')

  safe = safe.replace(/[^\x00-\x7F]/g, '')

  safe = safe.replace(/[\/\\?%*:|"<>]/g, '-')

  safe = safe.replace(/\s+/g, ' ').replace(/-+/g, '-').trim()

  return safe || 'Untitled'
}

import { SUPPORTED_SITES } from './platformCatalog'
import type { SupportedSite } from '@/types/content'

export function detectSite(url: URL): SupportedSite | null {
  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  const matchesHost = (candidate: string): boolean => {
    const normalized = candidate.replace(/^www\./, '').toLowerCase()
    return host === normalized || host.endsWith(`.${normalized}`)
  }

  const sortedSites = [...SUPPORTED_SITES].sort(
    (a, b) => (b.extractionPriority || 0) - (a.extractionPriority || 0),
  )

  for (const site of sortedSites) {
    if (site.hosts.some(matchesHost)) {
      return site
    }
  }

  return null
}


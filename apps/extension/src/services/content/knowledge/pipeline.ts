import { detectSite, getSiteContentSelectors, GENERIC_SITE } from './platforms'
import { getStrategy } from './strategies/registry'
import { ensureSourceLine } from './markdown'
import { collectLinks } from './utils/dom'
import type { KnowledgeExtractionResult } from '@/types'
import type { SupportedSite } from './platforms'

export function extractKnowledgeContent(
  doc: Document,
  url: URL,
): KnowledgeExtractionResult | null {
  const site: SupportedSite = detectSite(url) || GENERIC_SITE
  const strategy = getStrategy(site.key)
  const result = strategy(doc, url, site)
  if (!result) return null

  const markdown = ensureSourceLine(result.markdown || '', site.name, url.hostname)

  let links: string[] | undefined
  try {
    links = collectLinks(doc, url.href, 50, getSiteContentSelectors(site))
  } catch (error) {
    console.error('Error collecting links:', error)
  }

  return {
    ...result,
    site: site.key,
    markdown,
    ...(links?.length ? { links } : {}),
  }
}

 
import type { KnowledgeExtractionResult } from '@/types'
import { getSiteContentSelectors, type SupportedSite } from '../platforms'
import { resolveContentRoot } from '../utils/dom'
import { elementToMarkdown } from '../extractors/markdownRenderer'

const BLOCK_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, ul, ol, li, dl, dt, dd, blockquote, pre, table, img, input[type="checkbox"]'

export function extractGenericContent(
  doc: Document,
  url: URL,
  site: SupportedSite,
): KnowledgeExtractionResult | null {
  const root = resolveContentRoot(doc, getSiteContentSelectors(site))
  if (!root) return null

  const blocks = Array.from(root.querySelectorAll(BLOCK_SELECTOR)).filter(
    (el) => !el.parentElement?.closest(BLOCK_SELECTOR),
  )
  const markdownBlocks = blocks
    .map((el) => elementToMarkdown(el))
    .filter(Boolean)
  const markdown = markdownBlocks.join('\n\n')
  const title =
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    doc.querySelector('h1')?.textContent ||
    doc.title ||
    site.name

  return {
    title: title.trim(),
    description:
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      `${site.name} content from ${url.hostname}`,
    markdown,
    tags: [site.category, site.key],
    site: site.key,
  }
}

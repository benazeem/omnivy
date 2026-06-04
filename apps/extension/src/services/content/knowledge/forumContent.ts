import type { KnowledgeExtractionResult } from '@/types'
import { normalizeWhitespace } from './utils/dom'

const THREAD_SELECTORS = [
  '[data-testid="post-container"]',
  '[data-testid="comment"]',
  'shreddit-post',
  'shreddit-comment',
  '.topic-post .cooked',
  '.message-body',
  '.comment',
  'article',
]

export function extractForumLikeContent(
  doc: Document,
): KnowledgeExtractionResult | null {
  const title =
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ||
    doc.title?.trim() ||
    'Forum Thread'

  const posts = collectTextBlocks(doc, THREAD_SELECTORS, 60)
  const markdown =
    posts.length > 0
      ? [`# ${title}`, '', ...posts.map((post) => `## Post\n\n${post}`)].join('\n\n')
      : `# ${title}\n\n${normalizeWhitespace(doc.querySelector('main')?.textContent || '')}`

  return {
    title,
    description: 'Forum discussion',
    tags: ['forum'],
    markdown,
  }
}

function collectTextBlocks(
  doc: Document,
  selectors: string[],
  limit: number,
): string[] {
  const seen = new Set<string>()
  const blocks: string[] = []

  for (const selector of selectors) {
    for (const node of Array.from(doc.querySelectorAll(selector))) {
      const text = normalizeWhitespace(node.textContent || '')
      if (!text || text.length < 12 || seen.has(text)) continue

      seen.add(text)
      blocks.push(text)
      if (blocks.length >= limit) return blocks
    }

    if (blocks.length > 0) return blocks
  }

  return blocks
}

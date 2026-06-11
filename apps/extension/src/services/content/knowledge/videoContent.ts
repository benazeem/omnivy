import type { KnowledgeExtractionResult } from '@/types'
import { normalizeWhitespace } from './utils/dom'

const TRANSCRIPT_SELECTORS = [
  '[data-testid="transcript"]',
  'ytd-transcript-renderer',
  'ytd-transcript-body-renderer',
  '.transcript',
  '.video-transcript',
]

export function extractVideoContent(
  doc: Document,
): KnowledgeExtractionResult | null {
  const title =
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ||
    doc.title?.trim() ||
    'Video'

  const description =
    doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
    ''

  const transcript = TRANSCRIPT_SELECTORS.map((selector) =>
    normalizeWhitespace(doc.querySelector(selector)?.textContent || ''),
  ).find((text) => text.length > 20)

  const markdown = [
    `# ${title}`,
    description ? `\n${description}` : '',
    transcript ? `\n## Transcript\n\n${transcript}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    title,
    description: description || 'Video content',
    tags: ['video'],
    markdown,
  }
}


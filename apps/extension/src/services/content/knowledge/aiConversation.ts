import type { KnowledgeExtractionResult } from '@/types'
import { normalizeWhitespace } from './utils/dom'

const MESSAGE_SELECTORS = [
  '[data-testid="conversation-turn"]',
  '[data-testid*="message"]',
  'article',
  '[role="article"]',
  '.message',
]

export function extractAiConversation(
  doc: Document,
): KnowledgeExtractionResult | null {
  const title = doc.title?.trim() || 'AI Conversation'
  const messages = collectTextBlocks(doc, MESSAGE_SELECTORS, 40)

  const markdown =
    messages.length > 0
      ? [`# ${title}`, '', ...messages].join('\n\n')
      : `# ${title}\n\n${normalizeWhitespace(doc.querySelector('main')?.textContent || '')}`

  return {
    title,
    description: 'AI conversation',
    tags: ['ai', 'conversation'],
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
      if (!text || text.length < 8 || seen.has(text)) continue

      seen.add(text)
      blocks.push(text)
      if (blocks.length >= limit) return blocks
    }

    if (blocks.length > 0) return blocks
  }

  return blocks
}

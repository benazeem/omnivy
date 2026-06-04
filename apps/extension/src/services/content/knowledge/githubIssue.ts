import type { KnowledgeExtractionResult } from '@/types'
import { normalizeWhitespace, fallbackTitle } from './utils/dom'

export function extractGitHubIssueContent(
  doc: Document,
): KnowledgeExtractionResult | null {
  const title =
    normalizeWhitespace(
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        fallbackTitle(doc),
    ).replace(/ · .+$/, '') || fallbackTitle(doc)

  const bodySelectors = [
    '[data-testid="comment-body"]',
    '.comment-body',
    '.js-comment-body',
    '.markdown-body',
  ]

  const threadBlocks: Array<{
    label: string
    author?: string
    body: string
  }> = []

  const seenBodies = new Set<string>()

  const commentNodes = Array.from(
    doc.querySelectorAll(
      [
        'article',
        '.js-timeline-item',
        '.timeline-comment',
        '[data-testid="issue-comment"]',
      ].join(','),
    ),
  )

  for (const node of commentNodes) {
    const bodyNode = bodySelectors
      .map((selector) => node.querySelector(selector))
      .find(Boolean)

    const body = normalizeWhitespace(bodyNode?.textContent || '')

    if (!body) continue
 
    if (seenBodies.has(body)) continue
    seenBodies.add(body)

    const author =
      normalizeWhitespace(
        node.querySelector(
          [
            '.author',
            '[data-hovercard-type="user"]',
            '.timeline-comment-header-text a',
            '[data-testid="author-link"]',
            'a.author',
          ].join(','),
        )?.textContent || '',
      ) || undefined

    const isIssueBody = threadBlocks.length === 0

    threadBlocks.push({
      label: isIssueBody ? 'Issue' : 'Comment',
      author,
      body,
    })
  }

  if (threadBlocks.length === 0) {
    const mainText = normalizeWhitespace(
      doc.querySelector('main')?.innerText || doc.body?.innerText || '',
    )

    if (!mainText) return null

    return {
      title,
      description: 'GitHub issue thread',
      tags: ['github', 'issue'],
      markdown: `# ${title}\n\n${mainText}`,
    }
  }

  const markdown = [
    `# ${title}`,
    '',
    ...threadBlocks.flatMap((entry) => {
      const header =
        `${entry.label === 'Issue' ? '## Issue' : '## Comment'}` +
        (entry.author ? ` - ${entry.author}` : '')

      return [header, '', entry.body, '']
    }),
  ].join('\n')

  return {
    title,
    description: 'GitHub issue thread',
    tags: ['github', 'issue'],
    markdown,
  }
}

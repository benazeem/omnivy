import type { KnowledgeExtractionResult } from '@/types'
import {
  fallbackTitle,
  normalizeWhitespace,
  textFrom,
  escapeCodeFence,
  imageMarkdownFrom,
} from './utils/dom'

export function extractNotionContent(
  doc: Document,
): KnowledgeExtractionResult | null {
  const title = fallbackTitle(doc)

  const main = (doc.querySelector('main') || doc.body) as HTMLElement

  const markdownBlocks: string[] = []
  const seen = new Set<string>()

  const pushBlock = (value: string) => {
    const cleaned = value.trim()

    if (!cleaned) return
    if (seen.has(cleaned)) return

    seen.add(cleaned)
    markdownBlocks.push(cleaned)
  }

  const renderBlock = (node: Element): string | null => {
    const heading = node.querySelector(
      ':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6',
    ) as HTMLElement | null

    if (heading) {
      const level = Number.parseInt(heading.tagName.slice(1), 10)

      return `${'#'.repeat(
        Math.min(Math.max(level, 1), 6),
      )} ${textFrom(heading)}`
    }

    const checkbox = node.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null

    if (checkbox) {
      return `- [${checkbox.checked ? 'x' : ' '}] ${normalizeWhitespace(
        node.textContent || '',
      )}`
    }

    const codeBlock = node.querySelector(':scope pre code, :scope pre')

    if (codeBlock) {
      const code = codeBlock.textContent?.trim() || ''

      const language =
        codeBlock.getAttribute('data-language') ||
        codeBlock.getAttribute('class')?.match(/language-([\w-]+)/)?.[1] ||
        ''

      return ['```' + language, escapeCodeFence(code), '```'].join('\n')
    }

    const quote = node.querySelector(':scope blockquote')

    if (quote) {
      return `> ${textFrom(quote)}`
    }

    const image = node.querySelector('img')

    if (image instanceof HTMLImageElement) {
      return imageMarkdownFrom(image)
    }

    const listItem = node.matches('li') ? node : node.querySelector(':scope li')

    if (listItem) {
      return `- ${textFrom(listItem)}`
    }

    const table = node.querySelector(':scope table')

    if (table) {
      const rows = Array.from(table.querySelectorAll('tr'))

      const markdownRows = rows.map(
        (row) =>
          `| ${Array.from(row.querySelectorAll('th, td'))
            .map((cell) => textFrom(cell))
            .join(' | ')} |`,
      )

      if (markdownRows.length > 1) {
        const columnCount = rows[0]?.querySelectorAll('th, td').length || 0

        markdownRows.splice(
          1,
          0,
          `| ${Array(columnCount).fill('---').join(' | ')} |`,
        )
      }

      return markdownRows.join('\n')
    }

    const text = textFrom(node)

    return text || null
  }

  const notionBlocks = Array.from(main.querySelectorAll('[data-block-id]'))

  if (notionBlocks.length > 0) {
    for (const block of notionBlocks) {
      const rendered = renderBlock(block)

      if (rendered) {
        pushBlock(rendered)
      }
    }
  } else {
    const fallbackText = main.innerText || doc.body?.innerText || ''

    const cleaned = fallbackText.trim()

    if (!cleaned) {
      return null
    }

    pushBlock(cleaned)
  }

  return {
    title,
    description: 'Notion public page',
    tags: ['notion', 'notes'],
    markdown: [`# ${title || 'Notion Page'}`, '', ...markdownBlocks, ''].join(
      '\n',
    ),
  }
}

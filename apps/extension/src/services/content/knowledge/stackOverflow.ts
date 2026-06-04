import type { KnowledgeExtractionResult } from './types'
import { fallbackTitle, normalizeWhitespace } from './utils/dom'

export function extractStackOverflowContent(
  doc: Document,
): KnowledgeExtractionResult | null {
  const title = fallbackTitle(doc)

  const renderPost = (container: Element | null): string => {
    if (!container) return ''

    const clone = container.cloneNode(true) as HTMLElement

    clone.querySelectorAll('pre').forEach((pre) => {
      const code = pre.textContent?.trim() || ''

      pre.replaceWith(doc.createTextNode(`\n\`\`\`\n${code}\n\`\`\`\n`))
    })

    clone.querySelectorAll('blockquote').forEach((quote) => {
      const text = normalizeWhitespace(quote.textContent || '')

      quote.replaceWith(doc.createTextNode(`\n> ${text}\n`))
    })

    clone.querySelectorAll('li').forEach((li) => {
      const text = normalizeWhitespace(li.textContent || '')

      li.replaceWith(doc.createTextNode(`\n- ${text}`))
    })

    return clone.textContent?.trim() || ''
  }

  const questionNode = doc.querySelector(
    '.question .js-post-body, .question .post-text, [itemprop="text"]',
  )

  const questionBody = renderPost(questionNode)

  const questionAuthor = normalizeWhitespace(
    doc.querySelector('.question .user-details a')?.textContent || '',
  )

  const answerNodes = Array.from(doc.querySelectorAll('.answer'))

  if (!title && !questionBody && answerNodes.length === 0) {
    return null
  }

  const blocks: string[] = [`# ${title || 'Stack Overflow Thread'}`]

  if (questionBody) {
    blocks.push(
      '',
      `## Question${questionAuthor ? ` - ${questionAuthor}` : ''}`,
      '',
      questionBody,
      '',
    )
  }

  const sortedAnswers = [...answerNodes].sort((a, b) => {
    const aAccepted =
      a.classList.contains('accepted-answer') ||
      !!a.querySelector('.js-accepted-answer-indicator')

    const bAccepted =
      b.classList.contains('accepted-answer') ||
      !!b.querySelector('.js-accepted-answer-indicator')

    if (aAccepted && !bAccepted) return -1
    if (!aAccepted && bAccepted) return 1

    return 0
  })

  for (const answer of sortedAnswers) {
    const answerBody = renderPost(
      answer.querySelector('.js-post-body, .post-text'),
    )

    if (!answerBody) continue

    const accepted =
      answer.classList.contains('accepted-answer') ||
      !!answer.querySelector('.js-accepted-answer-indicator')

    const author = normalizeWhitespace(
      answer.querySelector('.user-details a')?.textContent || '',
    )

    const votes = normalizeWhitespace(
      answer.querySelector('.js-vote-count')?.textContent || '',
    )

    blocks.push(
      `## Answer${accepted ? ' (Accepted)' : ''}${
        author ? ` - ${author}` : ''
      }${votes ? ` [${votes} votes]` : ''}`,
      '',
      answerBody,
      '',
    )
  }

  return {
    title: title || 'Stack Overflow Thread',
    description: 'Stack Overflow discussion',
    tags: ['stackoverflow', 'q-and-a', 'developer'],
    markdown: blocks.join('\n'),
  }
}

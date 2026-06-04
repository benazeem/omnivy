import type { KnowledgeExtractionResult } from '@/types'
import {
  escapeCodeFence,
  fallbackTitle,
  languageFromFileName,
  normalizeWhitespace,
} from './utils/dom'

const CODE_LINE_SELECTORS = [
  '[data-testid="blob-viewer"] .react-code-text',
  '.react-code-text',
  'td.blob-code .blob-code-inner',
  '.blob-code-inner',
  '.js-file-line',
  'td.blob-code',
  '[data-line-number]',
]

const CODE_BLOCK_SELECTORS = [
  '[data-testid="blob-viewer"] pre code',
  '[data-testid="blob-viewer"] pre',
  '.Box-body pre code',
  '.Box-body pre',
  'pre code',
  'pre',
]

export function extractGitHubFileContent(
  doc: Document,
  url: URL,
): KnowledgeExtractionResult {
  const fileName = getGitHubFileName(doc, url)
  const code = extractCodeFromGitHubPage(doc)
  const language = languageFromFileName(fileName) || ''

  const markdown = [
    `# ${fileName}`,
    '',
    `\`\`\`${language}`,
    escapeCodeFence(code),
    '```',
    '',
  ].join('\n')

  const extension = fileName.split('.').pop()?.toLowerCase()

  return {
    title: fileName,
    description: 'Source file extracted from GitHub repository',
    author:
      doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
      undefined,
    tags: [
      'github',
      'code',
      'file',
      ...(extension && extension !== fileName ? [extension] : []),
    ],
    markdown,
  }
}

function extractCodeFromGitHubPage(doc: Document): string {
  return (
    extractFromLineNodes(doc) ||
    extractFromCodeBlocks(doc) ||
    extractFromEmbeddedJson(doc) ||
    extractFromRenderedPageText(doc) ||
    normalizeWhitespace(doc.body?.innerText || '')
  )
}

function extractFromLineNodes(doc: Document): string {
  for (const selector of CODE_LINE_SELECTORS) {
    const lines = getUniqueElements(doc, selector)
      .map((node) => getCodeLineText(node))
      .filter((line) => line !== null) as string[]

    const code = lines.join('\n').trimEnd()
    if (looksLikeSourceCode(code)) {
      return code
    }
  }

  return ''
}

function extractFromCodeBlocks(doc: Document): string {
  for (const selector of CODE_BLOCK_SELECTORS) {
    const node = doc.querySelector(selector)
    const code = node?.textContent?.trimEnd() || ''

    if (looksLikeSourceCode(code)) {
      return stripStandaloneLineNumbers(code)
    }
  }

  return ''
}

function extractFromEmbeddedJson(doc: Document): string {
  const scripts = Array.from(
    doc.querySelectorAll('script[type="application/json"], script[data-target]'),
  )

  for (const script of scripts) {
    const text = script.textContent || ''
    const decoded = findJsonStringValue(text, [
      'rawBlob',
      'rawLines',
      'blobCode',
      'code',
      'content',
    ])

    if (looksLikeSourceCode(decoded)) {
      return decoded.trimEnd()
    }
  }

  return ''
}

function extractFromRenderedPageText(doc: Document): string {
  const text = doc.querySelector('main')?.textContent || doc.body?.textContent || ''
  const rawMarkerIndex = text.search(/Copy raw file|Download raw file|Open symbols panel/)

  if (rawMarkerIndex === -1) return ''

  const candidate = text.slice(rawMarkerIndex).split(/\r?\n/)
  const firstCodeLine = candidate.findIndex((line, index, lines) => {
    const current = line.trim()
    const next = lines[index + 1]?.trim()

    return /^\d+$/.test(current) && !!next && !/^\d+$/.test(next)
  })

  if (firstCodeLine === -1) return ''

  const code = stripStandaloneLineNumbers(candidate.slice(firstCodeLine).join('\n'))
  return looksLikeSourceCode(code) ? code.trimEnd() : ''
}

function getCodeLineText(node: Element): string | null {
  if (node.closest('[aria-hidden="true"], .blob-num')) return null

  const text = node.textContent ?? ''
  if (!text && node.tagName !== 'TD') return ''

  return text.replace(/\u00A0/g, ' ').replace(/\r/g, '')
}

function getUniqueElements(doc: Document, selector: string): Element[] {
  const seen = new Set<Element>()
  const elements: Element[] = []

  for (const element of Array.from(doc.querySelectorAll(selector))) {
    if (seen.has(element)) continue
    if (elements.some((existing) => existing.contains(element))) continue

    seen.add(element)
    elements.push(element)
  }

  return elements
}

function getGitHubFileName(doc: Document, url: URL): string {
  const titleFile =
    doc.querySelector('main h1')?.textContent ||
    doc.querySelector('[aria-label="Breadcrumbs"] strong')?.textContent ||
    doc.querySelector('[aria-label="Breadcrumbs"] [aria-current="page"]')
      ?.textContent ||
    ''

  const cleanedTitle = normalizeWhitespace(titleFile)
  if (cleanedTitle) return cleanedTitle

  const urlFilePath = getFilePathFromUrl(url)
  if (urlFilePath) return urlFilePath

  return fallbackTitle(doc).replace(/ at .+ · GitHub$/, '') || 'file'
}

function getFilePathFromUrl(url: URL): string {
  const blobMatch = url.pathname.match(/^\/[^/]+\/[^/]+\/(?:blob|raw)\/(.+)$/)
  const pathAfterRef = blobMatch?.[1] || ''

  if (!pathAfterRef) {
    return url.pathname.split('/').filter(Boolean).pop() || ''
  }

  const parts = pathAfterRef.split('/')
  if (parts.length <= 1) return parts[0] || ''

  return parts.slice(1).join('/') || parts[parts.length - 1] || ''
}

function stripStandaloneLineNumbers(value: string): string {
  return value
    .split(/\r?\n/)
    .filter((line) => !/^\s*\d+\s*$/.test(line))
    .join('\n')
    .trimEnd()
}

function looksLikeSourceCode(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length < 2) return false

  const lines = trimmed.split(/\r?\n/)
  const nonEmptyLines = lines.filter((line) => line.trim())

  if (nonEmptyLines.length >= 2) return true

  return /[{}()[\];=<>]|import |export |class |function |const |let |var /.test(
    trimmed,
  )
}

function findJsonStringValue(source: string, keys: string[]): string {
  for (const key of keys) {
    const keyIndex = source.indexOf(`"${key}"`)
    if (keyIndex === -1) continue

    const colonIndex = source.indexOf(':', keyIndex)
    if (colonIndex === -1) continue

    const valueStart = source.indexOf('"', colonIndex + 1)
    if (valueStart === -1) continue

    const value = readJsonString(source, valueStart)
    if (value) return value
  }

  return ''
}

function readJsonString(source: string, quoteIndex: number): string {
  let escaped = false
  let raw = ''

  for (let index = quoteIndex + 1; index < source.length; index += 1) {
    const char = source[index]

    if (escaped) {
      raw += `\\${char}`
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (char === '"') {
      try {
        return JSON.parse(`"${raw}"`)
      } catch {
        return ''
      }
    }

    raw += char
  }

  return ''
}

import type { PageInfo } from '@/types'
import { extractKnowledgeContent } from './knowledge'
import {
  cleanTextContent,
  fallbackTitle,
  imageMarkdownFrom,
  resolveContentRoot,
} from './knowledge/utils/dom'
import { elementToMarkdown } from './knowledge/extractors/markdownRenderer'

const CONTENT_ROOT_SELECTORS = [
  'article',
  'main',
  '[role="main"]',
  '.post-content',
  '.article-content',
  '.entry-content',
  '.markdown-body',
  '.prose',
  '#content',
  '.content',
]

const FALLBACK_BLOCK_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre, table, img'

const REMOVE_FROM_CAPTURE_SELECTOR = [
  'script',
  'style',
  'noscript',
  'iframe',
  'header',
  'footer',
  'nav',
  'aside',
  '[aria-hidden="true"]',
  '.ads',
  '.ad',
  '.advertisement',
  '.sidebar',
  '.cookie',
  '.newsletter',
].join(',')

function initialize(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender, sendResponse)
    return true
  })
}

async function handleMessage(
  message: { type: string; content?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
): Promise<void> {
  switch (message.type) {
    case 'PING':
      sendResponse({ success: true })
      return

    case 'GET_PAGE_INFO':
      sendResponse({ success: true, data: getDetailedPageInfo() })
      return

    case 'COPY_TO_CLIPBOARD':
      await copyTextToClipboard(message.content ?? '')
      sendResponse({ success: true })
      return

    default:
      sendResponse({ success: false, error: 'Unsupported content message' })
  }
}

function getDetailedPageInfo(): PageInfo {
  const pageUrl = new URL(window.location.href)
  const knowledge = extractKnowledgeContent(document, pageUrl)
  const contentRoot = resolveContentRoot(document, CONTENT_ROOT_SELECTORS)
  const fallbackMarkdown = contentRoot ? renderFallbackMarkdown(contentRoot) : ''
  const fallbackText = contentRoot ? cleanTextContent(contentRoot.innerText) : ''
  const tags = mergeTags(collectPageTags(), knowledge?.tags || [])

  return {
    title: knowledge?.title || meta('og:title') || fallbackTitle(document),
    url: pageUrl.href,
    domain: pageUrl.hostname,
    description:
      knowledge?.description ||
      meta('og:description') ||
      meta('description') ||
      '',
    author:
      knowledge?.author ||
      meta('article:author') ||
      meta('author') ||
      cleanTextContent(document.querySelector('[rel="author"]')?.textContent || '') ||
      'Unknown',
    tags,
    lastModified: document.lastModified,
    referrer: document.referrer,
    html: fallbackMarkdown || fallbackText,
    markdown: knowledge?.markdown || fallbackMarkdown,
    links: collectPageLinks(contentRoot || document.body, pageUrl),
    timestamp: Date.now(),
  }
}

async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch (err) {
    console.warn('Primary clipboard copy failed, attempting fallback', err)
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (fallbackErr) {
    console.error('Fallback copy failed:', fallbackErr)
  } finally {
    textArea.remove()
  }
}

function renderFallbackMarkdown(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement
  clone.querySelectorAll(REMOVE_FROM_CAPTURE_SELECTOR).forEach((el) => el.remove())

  const blocks = Array.from(clone.querySelectorAll(FALLBACK_BLOCK_SELECTOR))
    .filter((el) => !el.parentElement?.closest(FALLBACK_BLOCK_SELECTOR))
    .map((el) => {
      if (el instanceof HTMLImageElement) return imageMarkdownFrom(el) || ''
      return elementToMarkdown(el)
    })
    .map((value) => value.trim())
    .filter(Boolean)

  return blocks.join('\n\n')
}

function collectPageTags(): string[] {
  const metaTags = [
    ...splitTags(meta('keywords')),
    ...splitTags(meta('article:tag')),
    ...Array.from(document.querySelectorAll('meta[property="article:tag"]'))
      .map((tag) => tag.getAttribute('content') || '')
      .flatMap(splitTags),
  ]

  const linkTags = Array.from(
    document.querySelectorAll('a[href*="/tag/"], a[href*="/tags/"]'),
  ).map((link) => link.textContent || '')

  return mergeTags(metaTags, linkTags)
}

function collectPageLinks(
  root: HTMLElement,
  baseUrl: URL,
): Array<{ text: string; url: string }> {
  const links: Array<{ text: string; url: string }> = []
  const seen = new Set<string>()

  for (const anchor of Array.from(root.querySelectorAll('a[href]'))) {
    if (anchor.closest('nav, footer, header, aside')) continue

    const href = anchor.getAttribute('href') || ''
    const text = cleanTextContent(anchor.textContent || '')
    if (!href || !text) continue

    let url: URL
    try {
      url = new URL(href, baseUrl.href)
    } catch {
      continue
    }

    if (!isUsefulLink(url, baseUrl) || seen.has(url.href)) continue

    seen.add(url.href)
    links.push({
      text: text.length > 50 ? `${text.slice(0, 47)}...` : text,
      url: url.href,
    })

    if (links.length >= 75) break
  }

  return links
}

function isUsefulLink(url: URL, baseUrl: URL): boolean {
  return (
    !['javascript:', 'mailto:', 'tel:', 'data:'].includes(url.protocol) &&
    !(url.origin === baseUrl.origin && url.pathname === baseUrl.pathname && url.hash)
  )
}

function meta(name: string): string {
  return (
    document.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ||
    document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
    ''
  ).trim()
}

function splitTags(value: string): string[] {
  return value.split(',').map((tag) => tag.trim())
}

function mergeTags(...groups: string[][]): string[] {
  return Array.from(
    new Set(
      groups
        .flat()
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 2),
    ),
  ).slice(0, 12)
}

initialize()

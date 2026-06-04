export function normalizeWhitespace(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function cleanTextContent(value: string): string {
  return normalizeWhitespace(value)
}

export function textFrom(node: Element | null | undefined): string {
  return normalizeWhitespace(node?.textContent || '')
}

export function fallbackTitle(doc: Document): string {
  return normalizeWhitespace(
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('h1')?.textContent ||
      doc.title ||
      '',
  )
}

export function escapeCodeFence(content: string): string {
  return content.replace(/```/g, '~~~')
}

export function imageMarkdownFrom(
  img: HTMLImageElement | null | undefined,
): string | null {
  if (!img) return null
  const src =
    img.currentSrc ||
    img.src ||
    img.getAttribute('data-src') ||
    img.getAttribute('data-original') ||
    img.getAttribute('src') ||
    ''
  if (!src) return null
  const alt = (
    img.alt ||
    img.getAttribute('alt') ||
    img.getAttribute('title') ||
    ''
  ).trim()
  return `![${normalizeWhitespace(alt)}](${src})`
}

export function resolveContentRoot(
  doc: Document,
  selectors?: string[],
): HTMLElement | null {
  const candidates = selectors || ['article', 'main', '[role="main"]']
  for (const selector of candidates) {
    const node = doc.querySelector(selector)
    if (node instanceof HTMLElement) return node
  }
  if (selectors?.length) return null
  return (doc.body || doc.documentElement) as HTMLElement
}

export function collectLinks(
  doc: Document,
  baseHref?: string,
  limit = 50,
  selectors?: string[],
): string[] {
  const container = resolveContentRoot(doc, selectors)
  if (!container) return []
  const anchors = Array.from(
    container.querySelectorAll('a[href]'),
  ) as HTMLAnchorElement[]
  const seen = new Set<string>()
  const out: string[] = []
  const resolvedBase = baseHref || doc.location?.href || location?.href || ''
  for (const a of anchors) {
    if (a.closest('footer, nav, aside, header')) continue
    let href = a.getAttribute('href') || ''
    try {
      href = new URL(href, resolvedBase).href
    } catch {
      continue
    }
    if (
      !href ||
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('data:') ||
      href.includes('#')
    )
      continue
    if (seen.has(href)) continue
    seen.add(href)
    const text = normalizeWhitespace(a.textContent || href)
    out.push(`${text} | ${href}`)
    if (out.length >= limit) break
  }
  return out
}

export function languageFromFileName(fileName: string): string | undefined {
  const parts = fileName.split('.')
  if (parts.length < 2) return undefined
  const ext = parts.pop()!.toLowerCase()
  const map: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    py: 'python',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    html: 'html',
    css: 'css',
    md: 'markdown',
    json: 'json',
    sh: 'bash',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    scala: 'scala',
    sql: 'sql',
  }
  return map[ext]
}

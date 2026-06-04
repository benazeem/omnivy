import type { SiteCategory, SupportedSite } from '@/types/content'

const memo = new Map<string, string[]>()

const readableCategories = new Set<SiteCategory>([
  'blog',
  'docs',
  'developer',
  'research',
  'news',
  'learning',
  'product',
  'reading',
  'social',
  'ai',
])

const genericReadableSelectors = [
  'article .post-content',
  'article .entry-content',
  'article .article-content',
  'article .markdown-body',
  'article .content',
  'article .prose',
  'main article',
  'main .post-content',
  'main .entry-content',
  'main .article-content',
  'main .markdown-body',
  'main .content',
  'main .prose',
  '[role="main"] article',
  '[role="main"] .markdown-body',
  '[role="main"] .prose',
  '.post-content',
  '.entry-content',
  '.article-content',
  '.markdown-body',
  '.content',
  '.prose',
  '.reader-content',
  '#content',
]

const selectorsBySite: Record<string, string[]> = {
  github: [
    '[data-testid="blob-viewer"]',
    '.react-blob-viewer',
    '.file',
    '.repository-content .js-file-content',
    '.repository-content .js-discussion',
    '.repository-content .js-issue-title',
    'article.js-comment-container',
    'main .js-discussion',
    'main',
  ],
  stackoverflow: [
    '.question .js-post-body',
    '.question .post-text',
    '.answer .js-post-body',
    '.answer .post-text',
    '[itemprop="text"]',
  ],
  notion: ['main [data-block-id]', 'article [data-block-id]', '[data-block-id]'],
  obsidian: ['main .page-content', 'article .page-content', '.page-content', '.content'],
  logseq: ['main .page-content', 'article .page-content', '.page-content', '.content'],
  anytype: ['main .page-content', 'article .page-content', '.page-content', '.content'],
  chatgpt: ['main article', '[data-testid="conversation-turn"]', '[data-testid="conversation"]'],
  claude: ['main [data-testid*="message"]', 'main .font-claude-message', 'main'],
  perplexity: ['main article', 'main [data-testid*="answer"]', 'main'],
  gemini: ['main message-content', 'main .conversation-container', 'main'],
  grok: ['main article', 'main [data-testid*="message"]', 'main'],
  youtube: [
    '[data-testid="transcript"]',
    '.transcript',
    '.video-transcript',
    'ytd-transcript-renderer',
    'ytd-transcript-body-renderer',
  ],
  vimeo: ['[data-testid="transcript"]', '.transcript', '.video-transcript'],
  reddit: [
    '[data-testid="post-container"]',
    'shreddit-post',
    'shreddit-comment',
    '[slot="text-body"]',
    '.Post',
    '.Comment',
  ],
  discourse: ['.topic-body', '.topic-post', '.cooked', '.post-stream .topic-post'],
  xenforo: ['.message-body', '.message-inner', '.block-container .message-body'],
  hackernews: ['.comment', '.athing', 'table.f9n', 'tr.athing', '.toptext'],
  quora: ['[data-testid="answer"]', '[data-testid="question"]', '.q-box', '.answer'],
  x: ['article', '[role="article"]', '[data-testid="tweetText"]'],
  linkedin: ['article', '[role="article"]', '.feed-shared-update-v2', '.post-body'],
}

export function getSiteContentSelectors(site: SupportedSite): string[] {
  if (memo.has(site.key)) return memo.get(site.key)!

  const selectors = selectorsBySite[site.key] || defaultSelectorsFor(site)
  memo.set(site.key, selectors)
  return selectors
}

function defaultSelectorsFor(site: SupportedSite): string[] {
  if (readableCategories.has(site.category)) {
    return genericReadableSelectors
  }

  return ['article', 'main', '[role="main"]']
}

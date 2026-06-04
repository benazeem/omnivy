import type { SupportedSite } from './platformTypes'

const blogSites: SupportedSite[] = [
  { key: 'medium', name: 'Medium', hosts: ['medium.com'], category: 'blog' },
  {
    key: 'hashnode',
    name: 'Hashnode',
    hosts: ['hashnode.dev', 'hashnode.com'],
    category: 'blog',
  },
  { key: 'devto', name: 'Dev.to', hosts: ['dev.to'], category: 'blog' },
  {
    key: 'substack',
    name: 'Substack',
    hosts: ['substack.com'],
    category: 'blog',
  },
  { key: 'ghost', name: 'Ghost', hosts: ['ghost.org'], category: 'blog' },
  {
    key: 'wordpress',
    name: 'WordPress.com',
    hosts: ['wordpress.com'],
    category: 'blog',
  },
  { key: 'blogger', name: 'Blogger', hosts: ['blogger.com'], category: 'blog' },
  {
    key: 'hubspot-blog',
    name: 'HubSpot Blog',
    hosts: ['blog.hubspot.com'],
    category: 'blog',
  },
]

const docsSites: SupportedSite[] = [
  {
    key: 'readthedocs',
    name: 'Read the Docs',
    hosts: ['readthedocs.org'],
    category: 'docs',
  },
  { key: 'gitbook', name: 'GitBook', hosts: ['gitbook.com'], category: 'docs' },
  {
    key: 'mintlify',
    name: 'Mintlify',
    hosts: ['mintlify.com'],
    category: 'docs',
  },
  { key: 'nextra', name: 'Nextra', hosts: ['nextra.site'], category: 'docs' },
  { key: 'vite-docs', name: 'Vite Docs', hosts: ['vite.dev'], category: 'docs' },
  {
    key: 'nextjs-docs',
    name: 'Next.js Docs',
    hosts: ['nextjs.org'],
    category: 'docs',
  },
  { key: 'react-docs', name: 'React Docs', hosts: ['react.dev'], category: 'docs' },
  {
    key: 'mkdocs',
    name: 'MkDocs',
    hosts: ['mkdocs.io', 'squidfunk.github.io'],
    category: 'docs',
  },
  {
    key: 'docusaurus',
    name: 'Docusaurus',
    hosts: ['docusaurus.io'],
    category: 'docs',
  },
  {
    key: 'nodejs-docs',
    name: 'Node.js Docs',
    hosts: ['nodejs.org'],
    category: 'docs',
  },
  {
    key: 'typescript-docs',
    name: 'TypeScript Docs',
    hosts: ['typescriptlang.org'],
    category: 'docs',
  },
  {
    key: 'tailwind-docs',
    name: 'Tailwind CSS Docs',
    hosts: ['tailwindcss.com'],
    category: 'docs',
  },
  {
    key: 'cloudflare-docs',
    name: 'Cloudflare Docs',
    hosts: ['developers.cloudflare.com'],
    category: 'docs',
  },
]

const developerSites: SupportedSite[] = [
  {
    key: 'stackoverflow',
    name: 'Stack Overflow',
    hosts: ['stackoverflow.com'],
    category: 'developer',
  },
  {
    key: 'github',
    name: 'GitHub',
    hosts: ['github.com'],
    category: 'developer',
    extractionPriority: 10,
  },
  {
    key: 'mdn',
    name: 'MDN Web Docs',
    hosts: ['developer.mozilla.org'],
    category: 'developer',
  },
  {
    key: 'freecodecamp',
    name: 'freeCodeCamp',
    hosts: ['freecodecamp.org'],
    category: 'developer',
  },
  {
    key: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    hosts: ['geeksforgeeks.org'],
    category: 'developer',
  },
  {
    key: 'google-developers',
    name: 'Google Developers',
    hosts: ['developers.google.com'],
    category: 'developer',
  },
  {
    key: 'microsoft-learn',
    name: 'Microsoft Learn',
    hosts: ['learn.microsoft.com'],
    category: 'developer',
  },
]

const aiSites: SupportedSite[] = [
  {
    key: 'openai-platform',
    name: 'OpenAI Platform Docs',
    hosts: ['platform.openai.com'],
    category: 'ai',
  },
  {
    key: 'anthropic-docs',
    name: 'Anthropic Docs',
    hosts: ['docs.anthropic.com'],
    category: 'ai',
  },
  {
    key: 'langchain-docs',
    name: 'LangChain Docs',
    hosts: ['docs.langchain.com'],
    category: 'ai',
  },
  {
    key: 'llamaindex-docs',
    name: 'LlamaIndex Docs',
    hosts: ['docs.llamaindex.ai'],
    category: 'ai',
  },
  {
    key: 'chatgpt',
    name: 'ChatGPT',
    hosts: ['chat.openai.com', 'chatgpt.com'],
    category: 'ai',
  },
  { key: 'claude', name: 'Claude', hosts: ['claude.ai'], category: 'ai' },
  {
    key: 'perplexity',
    name: 'Perplexity',
    hosts: ['perplexity.ai'],
    category: 'ai',
  },
  { key: 'gemini', name: 'Gemini', hosts: ['gemini.google.com'], category: 'ai' },
  { key: 'grok', name: 'Grok', hosts: ['grok.com'], category: 'ai' },
]

const researchSites: SupportedSite[] = [
  { key: 'arxiv', name: 'arXiv', hosts: ['arxiv.org'], category: 'research' },
  {
    key: 'scholar',
    name: 'Google Scholar',
    hosts: ['scholar.google.com'],
    category: 'research',
  },
  {
    key: 'semanticscholar',
    name: 'Semantic Scholar',
    hosts: ['semanticscholar.org'],
    category: 'research',
  },
  {
    key: 'pubmed',
    name: 'PubMed',
    hosts: ['pubmed.ncbi.nlm.nih.gov'],
    category: 'research',
  },
]

const newsSites: SupportedSite[] = [
  { key: 'reuters', name: 'Reuters', hosts: ['reuters.com'], category: 'news' },
  {
    key: 'guardian',
    name: 'The Guardian',
    hosts: ['theguardian.com'],
    category: 'news',
  },
  {
    key: 'bloomberg',
    name: 'Bloomberg',
    hosts: ['bloomberg.com'],
    category: 'news',
  },
  {
    key: 'nytimes',
    name: 'The New York Times',
    hosts: ['nytimes.com'],
    category: 'news',
  },
]

const forumSites: SupportedSite[] = [
  { key: 'reddit', name: 'Reddit', hosts: ['reddit.com'], category: 'forum' },
  {
    key: 'discourse',
    name: 'Discourse',
    hosts: ['try.discourse.org', 'discourse.org'],
    category: 'forum',
  },
  { key: 'xenforo', name: 'XenForo', hosts: ['xenforo.com'], category: 'forum' },
  {
    key: 'hackernews',
    name: 'Hacker News',
    hosts: ['news.ycombinator.com'],
    category: 'forum',
  },
  { key: 'quora', name: 'Quora', hosts: ['quora.com'], category: 'forum' },
]

const learningSites: SupportedSite[] = [
  {
    key: 'coursera',
    name: 'Coursera',
    hosts: ['coursera.org'],
    category: 'learning',
  },
  { key: 'udemy', name: 'Udemy', hosts: ['udemy.com'], category: 'learning' },
  {
    key: 'khan-academy',
    name: 'Khan Academy',
    hosts: ['khanacademy.org'],
    category: 'learning',
  },
]

const readingSites: SupportedSite[] = [
  {
    key: 'wikipedia',
    name: 'Wikipedia',
    hosts: ['wikipedia.org'],
    category: 'reading',
  },
  {
    key: 'gutenberg',
    name: 'Project Gutenberg',
    hosts: ['gutenberg.org'],
    category: 'reading',
  },
]

const videoSites: SupportedSite[] = [
  {
    key: 'youtube',
    name: 'YouTube',
    hosts: ['youtube.com', 'youtu.be'],
    category: 'video',
  },
  { key: 'vimeo', name: 'Vimeo', hosts: ['vimeo.com'], category: 'video' },
]

const socialSites: SupportedSite[] = [
  { key: 'x', name: 'X', hosts: ['x.com', 'twitter.com'], category: 'social' },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    hosts: ['linkedin.com'],
    category: 'social',
  },
]

const productSites: SupportedSite[] = [
  { key: 'amazon', name: 'Amazon', hosts: ['amazon.com'], category: 'product' },
  {
    key: 'flipkart',
    name: 'Flipkart',
    hosts: ['flipkart.com'],
    category: 'product',
  },
  { key: 'g2', name: 'G2', hosts: ['g2.com'], category: 'product' },
  {
    key: 'capterra',
    name: 'Capterra',
    hosts: ['capterra.com'],
    category: 'product',
  },
]

const notesSites: SupportedSite[] = [
  {
    key: 'obsidian',
    name: 'Obsidian',
    hosts: ['obsidian.md'],
    category: 'notes',
    official: true,
  },
  {
    key: 'notion',
    name: 'Notion',
    hosts: ['notion.so', 'notion.site'],
    category: 'notes',
    official: true,
  },
  { key: 'logseq', name: 'Logseq', hosts: ['logseq.com'], category: 'notes' },
  { key: 'anytype', name: 'Anytype', hosts: ['anytype.io'], category: 'notes' },
  { key: 'roam', name: 'Roam Research', hosts: ['roamresearch.com'], category: 'notes' },
  { key: 'tana', name: 'Tana', hosts: ['tana.inc'], category: 'notes' },
]

export const SUPPORTED_SITES: SupportedSite[] = [
  ...blogSites,
  ...docsSites,
  ...developerSites,
  ...aiSites,
  ...researchSites,
  ...newsSites,
  ...forumSites,
  ...learningSites,
  ...readingSites,
  ...videoSites,
  ...socialSites,
  ...productSites,
  ...notesSites,
]


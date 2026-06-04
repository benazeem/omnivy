import { Metadata } from "next"

export const extractionTypes = [
  {
    name: 'Articles, blogs, docs, and reading pages',
    desc: 'Finds the strongest content root, removes page chrome, keeps headings, lists, quotes, tables, code blocks, images, tags, links, and source metadata.',
  },
  {
    name: 'GitHub files',
    desc: 'Detects /blob/ and /raw/ URLs, extracts source lines from the current GitHub file viewer, and saves the file in a fenced code block with the right language hint when possible.',
  },
  {
    name: 'GitHub issues and pull requests',
    desc: 'Routes /issues/ and /pull/ pages to a thread extractor so the original issue and comments are saved as discussion notes instead of raw page clutter.',
  },
  {
    name: 'Stack Overflow and forums',
    desc: 'Preserves the question, answers, accepted-answer signal, votes, and forum-style post bodies in readable Markdown.',
  },
  {
    name: 'AI chats, video pages, and public Notion pages',
    desc: 'Uses lightweight DOM extraction for chat messages, transcript-like areas, metadata, and Notion-style blocks when those elements are present on the page.',
  },
]

export const destinationPlatforms = [
  {
    name: 'Local Obsidian',
    desc: 'Creates a Markdown note through obsidian://new using your configured vault name. No web account is required for this local target.',
  },
  {
    name: 'Notion',
    desc: 'Saves the clip through your connected Notion workspace. The extension can load available destinations and send title, source URL, tags, and Markdown content.',
  },
  {
    name: 'Google Drive',
    desc: 'Uploads a .md clipping to a selected Google Drive folder, with an Omnivy Web Clips fallback when no folder is selected.',
  },
  {
    name: 'Microsoft OneDrive',
    desc: 'Uploads a .md clipping through Microsoft Graph, using the selected folder when available and an Omnivy Web Clips fallback path otherwise.',
  },
  {
    name: 'Dropbox',
    desc: 'Uploads a .md clipping to the selected Dropbox folder path, or to the Omnivy Web Clips folder if no destination is available.',
  },
]

export const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Documentation | Omnivy Browser Clipper',
  description:
    'How Omnivy captures web pages, extracts Markdown, and saves clips to Obsidian, Notion, Google Drive, OneDrive, and Dropbox.',
  author: {
    '@type': 'Organization',
    name: 'Omnivy',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Omnivy',
  },
}

export const metadata: Metadata = {
  title: 'Documentation | Omnivy Browser Clipper',
  description:
    'How Omnivy captures web pages, extracts Markdown, and saves clips to Obsidian, Notion, Google Drive, OneDrive, and Dropbox.',
  alternates: {
    canonical: '/documentation',
  },
}
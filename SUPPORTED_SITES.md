# Supported Sites & Ecosystems

Omnivy can clip generic webpages, but it works best when a site has a known content structure. The extension therefore combines platform detection, preferred content-root selectors, specialized extractors, and generic fallback extraction.

## Stronger Extractors

These sources have dedicated or more specialized extraction behavior in the current extension:

- GitHub files
- GitHub issues and discussions-like pages
- Stack Overflow questions
- Forum/Q&A pages
- AI conversation pages
- Notion pages
- Video pages
- Generic article/document pages

## Target Ecosystems

The platform catalog and documentation are designed around these content ecosystems:

- AI platforms: ChatGPT, Claude, Perplexity, Gemini, Grok
- Developer docs and references: GitHub Docs, MDN, Node.js, TypeScript, React, Tailwind, Cloudflare, GitBook, Read the Docs, Docusaurus, Nextra, Mintlify
- Developer content: GitHub files, GitHub issues, Stack Overflow
- Reading and research: Wikipedia, Project Gutenberg, arXiv, Semantic Scholar, PubMed
- Forums and communities: Hacker News, Reddit, Quora, Discourse, XenForo-style forums
- Note-taking and knowledge tools: Notion, Obsidian, Logseq, Anytype, Roam Research, Tana
- Video: YouTube, Vimeo
- Social: X, LinkedIn
- News and media: Reuters, The Guardian, Bloomberg, The New York Times
- Product and review pages: Amazon, Flipkart, G2, Capterra

## Extraction Rules

- Prefer the main content root over full-page scraping.
- Capture content-area links instead of navigation/footer/sidebar links.
- Preserve source URL and useful metadata.
- Render code-heavy pages, especially GitHub files, as readable Markdown/code.
- Fall back to generic extraction when a platform-specific strategy is not available.
- Strip images when the user's behavior setting disables image saving.
- Append content links when the user's behavior setting enables footer links.

## Unsupported Pages

Some pages cannot be clipped because browser extension content scripts are blocked there:

- `chrome://` pages
- `chrome-extension://` pages
- `edge://` pages
- `about:` pages
- DevTools pages
- Other browser-internal or restricted pages

## Updating This List

When adding or improving a platform:

1. Update `apps/extension/src/services/content/knowledge/platformCatalog.ts`.
2. Add or adjust selectors in `platformSelectors.ts`.
3. Add a specialized extractor only when generic extraction is not enough.
4. Update this file and the web documentation constants if the supported surface changes.

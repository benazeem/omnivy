# Omnivy Extension

The Omnivy extension is the browser-side clipper. It extracts the active page, lets the user edit save properties, and saves Markdown to Obsidian or connected cloud destinations.

## What It Does

- Runs as a Chrome Extension Manifest V3 extension.
- Provides a popup UI for clipping the current tab.
- Provides a settings page for appearance, behavior, vaults, and cloud connection helpers.
- Detects unsupported pages such as `chrome://`, extension pages, DevTools, and other pages where content scripts cannot run.
- Injects or pings the content script before extracting page data.
- Extracts title, source URL, author, description, tags, Markdown/HTML content, and content-area links.
- Uses a site-aware knowledge extraction pipeline for GitHub files/issues, Stack Overflow, forums, AI conversations, Notion, videos, and generic pages.
- Lets users edit title/source/author/tags and add custom properties.
- Serializes custom properties into frontmatter-like `custom_properties`.
- Saves to Obsidian through the local browser workflow.
- Saves to Google Drive, OneDrive, Dropbox, and Notion through the Omnivy Web API.
- Loads cloud connection state, provider folders, and Notion destinations.
- Supports context-menu saving and background save behavior.
- Supports appearance preferences such as theme, accent, font size, font family, and density.

## Main Files

```text
src
├── pages
│   ├── Popup.tsx
│   └── Settings.tsx
├── components
│   ├── popup
│   ├── settings
│   ├── CloudConnector.tsx
│   ├── CloudManager.tsx
│   ├── UIManager.tsx
│   └── VaultManager.tsx
├── services
│   ├── auth
│   ├── api
│   ├── background
│   ├── content
│   ├── db
│   └── handlers
├── features
├── hooks
├── store
├── types
└── utils
```

## Content Extraction

The extraction code lives under:

```text
src/services/content/knowledge
├── pipeline.ts
├── platformCatalog.ts
├── platformDetection.ts
├── platformSelectors.ts
├── markdown.ts
├── githubFile.ts
├── githubIssue.ts
├── stackOverflow.ts
├── forumContent.ts
├── aiConversation.ts
├── notion.ts
├── videoContent.ts
├── strategies
└── utils
```

The content script responds to `GET_PAGE_INFO`, runs the knowledge pipeline, and returns data to the popup/background. The pipeline chooses a known platform strategy when possible and falls back to generic extraction when needed.

## Save Flow

```mermaid
flowchart TD
  A[Popup opens] --> B[Read active tab]
  B --> C[Ping or inject content script]
  C --> D[GET_PAGE_INFO]
  D --> E[Editable popup fields]
  E --> F{Save target}
  F -->|Obsidian| G[SAVE_OBSIDIAN_FILE]
  F -->|Cloud| H[SAVE_TO_CLOUD]
  H --> I[Short-lived Omnivy Web token]
  I --> J[/api/clip/save]
```

## Web App Dependency

The extension uses `VITE_API_BASE_URL` to find Omnivy Web.

```env
VITE_API_BASE_URL=http://localhost:3000
```

It opens web pages such as `/settings/integrations`, `/documentation`, and `/profile`, and calls web APIs for auth, provider status, folder loading, destination loading, and cloud saves.

## Development

```bash
pnpm -C apps/extension dev
pnpm -C apps/extension build
pnpm -C apps/extension lint
```

`dev` runs a Vite watch build. Load `apps/extension/dist` as an unpacked extension after building.

## Manifest

The extension manifest is in `public/manifest.json`.

Current manifest highlights:

- Manifest V3
- Popup: `popup.html`
- Options page: `settings.html`
- Background service worker: `background.js`
- Content script: `content.js` on `<all_urls>`
- Permissions: `activeTab`, `storage`, `scripting`, `tabs`, `contextMenus`, `cookies`
- Host permissions for local Omnivy Web and the deployed Omnivy domain

## Notes

- Browser-restricted pages cannot be clipped because Chrome blocks content scripts there.
- Cloud saves require a signed-in Omnivy Web session and connected provider.
- Dropbox folder saves use folder paths; Drive, OneDrive, and Notion use IDs.
- Notion destinations are managed from the web integration settings page.

# Omnivy Web

Omnivy Web is the public site and account/integration backend for the Omnivy browser extension.

It provides the marketing and documentation pages users see in the browser, but it also runs the authenticated provider APIs the extension uses to save Markdown clips to cloud destinations.

## What It Does

- Hosts the public website, install page, documentation, roadmap, legal pages, and developer page.
- Handles sign-in with NextAuth/Auth.js.
- Shows signed-in profile and session state.
- Connects Google Drive, OneDrive, Dropbox, and Notion through OAuth.
- Encrypts provider tokens before storing them.
- Refreshes provider tokens when a save requires it.
- Serves provider status, folders, and destinations to the extension.
- Saves extension clips to cloud providers through `/api/clip/save`.
- Issues short-lived extension API tokens through `/api/extension/token`.
- Routes feature and bug requests to GitHub issues.
- Loads Chrome Web Store listing stats and attempts review parsing with a safe fallback.
- Serves `/manifest.json`, icons, SEO metadata, Open Graph data, and JSON-LD from the app layout.

## Main Pages

- `/` product overview
- `/install` install instructions, Chrome Web Store stats, and user review cards
- `/documentation` extraction and destination documentation
- `/settings/integrations` provider connection, folder refresh, and Notion destination management
- `/profile` account and session state
- `/request` feature request and bug report form
- `/future-improvements` roadmap and tracked requests
- `/developer` maintainer and project background
- `/privacy-policy`
- `/terms-of-service`

## API Surface

```text
src/app/api
├── auth
│   ├── [...nextauth]
│   ├── me
│   ├── refresh
│   ├── logout
│   └── web-session
├── extension/token
├── providers
│   ├── status
│   ├── folders
│   ├── destinations
│   ├── connect/[provider]
│   ├── callback/[provider]
│   └── disconnect/[provider]
├── clip/save
├── clips
├── github/issues
└── chrome-extension
    ├── [id]
    └── reviews
```

## Important Folders

```text
src
├── app          # App Router pages and route handlers
├── components   # Shared website components
├── constants    # Page content, roadmap, docs, home data
├── context      # Theme context
├── hooks        # Client hooks such as feedback form handling
├── lib          # Auth, database, providers, encryption, CWS helpers
├── styles.css   # Global Tailwind/CSS variables
├── types        # Shared web app types and ambient declarations
└── utils

prisma           # Database schema
public           # App icon, manifest, social image, llms.txt
```

## Development

```bash
pnpm -C apps/web dev
pnpm -C apps/web build
pnpm -C apps/web start
pnpm -C apps/web lint
```

The dev server runs on port `3000`.

## Environment Variables

Start from `Example.env`.

Core app:

```env
AUTH_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=...
DIRECT_URL=...
ENCRYPTION_SECRET=...
```

OAuth and providers:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
ONEDRIVE_CLIENT_ID=...
ONEDRIVE_CLIENT_SECRET=...
DROPBOX_CLIENT_ID=...
DROPBOX_CLIENT_SECRET=...
NOTION_CLIENT_ID=...
NOTION_CLIENT_SECRET=...
NOTION_DEFAULT_DATABASE_ID=...
```

Extension API:

```env
EXTENSION_ALLOWED_ORIGINS=chrome-extension://your-extension-id
EXTENSION_JWT_SECRET=...
EXTENSION_TOKEN_TTL=900
EXTENSION_TOKEN_MAX_TTL=1800
```

Feedback and install page:

```env
GITHUB_TOKEN=...
GITHUB_REPO=benazeem/obsidianplus
CHROME_WEB_STORE_EXTENSION_ID=nbeeifpffimepiobjmhpfihileadikdo
CHROME_EXTENSION_SLUG=obsidian-plus-web-clipper
```

Do not commit real secrets.

## Extension Relationship

The extension points to this app with `VITE_API_BASE_URL`. Local development usually uses:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The extension opens `/settings/integrations`, `/documentation`, and `/profile`, then calls the web APIs for auth, provider status, folder loading, destination loading, token refresh, and cloud clip saves.

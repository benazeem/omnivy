# Contributing

Thanks for helping improve Omnivy. This project contains both a browser extension and a web app, so changes should stay aligned across code, docs, and environment templates.

## Before You Start

1. Read the root `README.md`.
2. Read `ARCHITECTURE.md` for the current extension/web split.
3. For extraction work, read `SUPPORTED_SITES.md`.
4. Check whether your change affects extension behavior, web APIs, provider flows, or docs.

## Branching

Use clear branch names:

- `feature/github-file-extraction`
- `feature/notion-destinations`
- `fix/dropbox-folder-save`
- `fix/install-review-fallback`
- `docs/update-extension-readme`
- `web/integrations-ui`

## Extension Versioning

The extension version lives in:

- `apps/extension/package.json`
- `apps/extension/public/manifest.json`

Keep them aligned when preparing an extension release.

Use SemVer:

- Major: breaking changes
- Minor: new features
- Patch: bug fixes

Examples:

- `2.0.1`
- `2.1.0`
- `3.0.0`

## Development Workflow

1. Make the smallest focused change that solves the problem.
2. Prefer existing patterns and helpers.
3. Keep extraction changes scoped to the content pipeline.
4. Keep provider changes scoped to the relevant web API and OAuth provider class.
5. Update docs when behavior, routes, environment variables, or supported sites change.
6. Run the relevant checks before opening a PR.

## Useful Commands

From the repository root:

```bash
pnpm install
pnpm build
pnpm lint
pnpm check
pnpm test
```

Extension:

```bash
pnpm -C apps/extension dev
pnpm -C apps/extension build
pnpm -C apps/extension lint
```

Web:

```bash
pnpm -C apps/web dev
pnpm -C apps/web build
pnpm -C apps/web lint
```

## Documentation Checklist

Update Markdown docs when you change:

- Extension popup/settings behavior
- Save destinations
- Provider auth or destination handling
- Web routes or API routes
- Environment variables
- Supported content platforms
- Extraction behavior
- Release/versioning rules

## Provider Work

Provider changes usually touch:

- `apps/web/src/lib/oauth`
- `apps/web/src/app/api/providers`
- `apps/web/src/app/api/clip/save`
- `apps/extension/src/services/api`
- `apps/extension/src/services/background`
- `apps/extension/src/components/CloudConnector.tsx`
- `apps/extension/src/components/CloudManager.tsx`

Provider tokens must remain encrypted at rest.

## Extraction Work

Extraction changes usually touch:

- `apps/extension/src/services/content/knowledge/platformCatalog.ts`
- `platformDetection.ts`
- `platformSelectors.ts`
- Specialized extractor files such as `githubFile.ts`, `stackOverflow.ts`, or `aiConversation.ts`
- `strategies/generic.ts`

Prefer robust selectors, content-root extraction, and fallback behavior over brittle full-page scraping.

## Release Checklist

Before release:

1. Align extension versions in package and manifest.
2. Build extension and web.
3. Verify popup clipping on a generic article and at least one specialized source.
4. Verify Obsidian save.
5. Verify each enabled provider connection and save flow.
6. Verify `/install`, `/documentation`, `/settings/integrations`, `/profile`, and `/request`.
7. Update `CHANGELOG.md`.
8. Update docs if behavior changed.

## Questions

Open an issue or request discussion when a change affects product direction, provider permissions, auth/session behavior, or broad extraction behavior.

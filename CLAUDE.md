# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Next.js 15-based static blog generator with multi-language support, MDX content management, and static export capabilities. Built with TypeScript, Tailwind CSS, and the App Router.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build (runs prebuild scripts automatically)
npm run build

# Lint
npm run lint

# Start production server
npm start

# Static export
npm run export
```

## Build Process

The `prebuild` script runs automatically before builds:
1. `node scripts/generate-social-images.mjs` - generates social media images
2. `tsx scripts/build-search-index.ts` - builds Fuse.js search indices for all locales

## Architecture

### Multi-language Content System

**Supported locales**: `en` (default), `fr`, `pt`, `es`

Content is organized in `src/content/{locale}/{year}/{slug}.mdx`. The system uses a translation mapping system where:

- English (`en`) posts are canonical references
- Other language versions are linked via frontmatter keys: `fr_mdx`, `pt_mdx`, `es_mdx`
- Translation resolution happens in `src/lib/mdx.ts` via `buildTranslationIndex()`
- The translation index maps canonical slugs to localized slugs and vice versa

**Key MDX functions** (in `src/lib/mdx.ts`):
- `listCanonicalSlugs()` - lists all en posts
- `getCanonicalSlug(locale, slug)` - gets canonical slug from localized slug
- `getLocalizedSlug(canonicalSlug, locale)` - gets localized slug for a locale
- `getAllPostsWithFallback(locale)` - gets all posts for locale with fallback to English
- `refreshTranslationIndex()` - rebuilds translation mapping (call before build operations)

### URL Structure

Blog posts use date-based URLs: `/{locale}/{year}/{month}/{slug}`

Path construction is handled by `buildPostPath()` in `src/lib/post-path.ts`. The Next.js dynamic route is at `src/app/[locale]/[year]/[month]/[slug]/page.tsx`.

### MDX Configuration

- MDX files support custom components defined in `src/components/mdx/index.tsx`
- Custom components include: `Callout`, `ThemeImage`, `AppStoreLink`, `ThreeCube`
- Code highlighting uses `rehype-pretty-code` with GitHub themes
- Plugins: `remark-gfm`, `remark-smartypants`, custom `rehype-code-headers`
- Configuration in `next.config.ts` sets `pageExtensions: ["ts", "tsx", "md", "mdx"]`

### Static Export Configuration

`next.config.ts` sets:
- `output: "export"` - enables static HTML export
- `trailingSlash: true` - adds trailing slashes to URLs
- MDX support via `@next/mdx`

### Search System

Search uses Fuse.js with pre-built indices in `public/search-index.{locale}.json`. The build script (`scripts/build-search-index.ts`) generates indices for all locales. Client-side search UI is in `src/app/[locale]/search-client.tsx`.

### Path Aliases

Uses `@/*` alias mapping to `./src/*` (configured in `tsconfig.json`)

### Styling

- Tailwind CSS 4 with PostCSS
- Dark mode support via `next-themes`
- Prose styles for MDX content

## Post Frontmatter Structure

```yaml
---
title: Post Title
description: Post description
date: YYYY-MM-DD
tags: [tag1, tag2]
image: /images/path.webp
en_mdx: slug.mdx          # canonical reference
fr_mdx: slug-fr.mdx       # French translation (can be same or different slug)
pt_mdx: slug-pt.mdx       # Portuguese translation
es_mdx: slug-es.mdx       # Spanish translation
---
```

## Important Notes

- Always call `refreshTranslationIndex()` before build operations or when working with translation mappings
- The system automatically falls back to English content if a translation is missing
- Image paths in frontmatter should be absolute (starting with `/`)
- Social images prefer `.jpg`, `.jpeg`, `.png` over `.webp` for OpenGraph compatibility

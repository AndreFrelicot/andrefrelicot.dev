# Hidden Tags

Hidden tags let you enrich an article's metadata for search relevance without surfacing the extra labels in the UI. They behave exactly like regular tags for indexing, but any tag that starts with an underscore (`_`) stays hidden from the Content page's filters and badges.

## Authoring Hidden Tags

Add hidden tags directly inside the front matter `tags` array of an MDX post. Prefix the tag with `_` to hide it from visitors while keeping it available to the search index.

```mdx
---
title: My Post
date: 2024-06-18
tags: [nextjs, performance, _jamstack, _cdn]
---
```

In the example above, `nextjs` and `performance` appear in the UI. The `_jamstack` and `_cdn` tags stay hidden but can still be matched when a visitor searches for "jamstack" or "cdn".

## How It Works

- **Search indexing** – All tags (hidden or not) are serialized into the locale search index within `scripts/build-search-index.ts` and `src/lib/search.ts`. Hidden tags therefore contribute to Fuse.js matching just like visible tags.
- **UI filtering** – The Content page client (`src/app/[locale]/search-client.tsx:12`) filters out any tag that begins with `_` before building the filter list or rendering tag badges.
- **Front matter** – Hidden tags live alongside visible ones in `src/content/<locale>/*.mdx`, so there is nothing else to configure.

## Usage Tips

- Use hidden tags for synonyms, common misspellings, or technology aliases that should boost discoverability without cluttering the visible taxonomy.
- Avoid hiding tags that you expect readers to filter on; hidden tags never appear as filter chips or badges.
- Keep hidden tag names lowercase and kebab-case so they remain consistent with visible tags and Fuse.js matches.


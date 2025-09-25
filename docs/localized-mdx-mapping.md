# Localized MDX File Mapping

## Overview
Posts are authored in multiple languages by pairing one canonical MDX file (default locale) with translated versions stored under `src/content/<locale>`. The canonical file declares where its translations live via front-matter keys.

## Front Matter Keys
Add one entry per translation to the default-locale file's front matter using the format `<locale>_mdx`. Values can include the `.mdx` extension and optional subdirectories, relative to the locale root. Example:

```mdx
---
title: About
date: 2025-02-10
en_mdx: about.mdx          # Optional but allowed
fr_mdx: a-propos.mdx       # src/content/fr/2025/a-propos.mdx
pt_mdx: sobre.mdx          # src/content/pt/2025/sobre.mdx
---
```

For nested paths:

```mdx
fr_mdx: guides/performance/optimisation.mdx  # resolves to src/content/fr/guides/performance/optimisation.mdx
```

The loader normalizes slashes and trims the extension, so either `guides/performance/optimisation` or the variant with `.mdx` works.

## Workflow
1. Create or update the default-locale MDX under `src/content/en/...`.
2. Add `<locale>_mdx` keys in its front matter pointing at each translated file.
3. Place translated files in the corresponding locale directories using the same slug indicated by the keys.
4. Run `pnpm build` (or `pnpm prebuild`) to rebuild translation mappings and search indexes.

Only the default-locale file needs to list translations; translated files can keep minimal front matter.

# Repository Guidelines

## Project Structure & Module Organization
This Next.js blog ships as a statically generated site sourced from MDX posts. Localized routes live under `src/app/[locale]`, with `(blog)` serving articles and `(portfolio)/apps` listing portfolio entries. Shared components belong in `src/components`, while `src/lib` provides MDX parsing, search helpers, and other server utilities. Author content resides in `src/content/<locale>` as `.mdx` files; portfolio entries live in `src/apps/<locale>`. Curated homepage links are managed via `src/data/links/<locale>.json`. Assets settle under `public`. Build scripts, including `scripts/build-search-index.ts`, automate locale-specific blog search index creation before exports.

## Build, Test, and Development Commands
Run `pnpm dev` for the Turbopack dev server at `http://localhost:3000`. `pnpm build` performs the production compile and runs `prebuild` first to regenerate the search index so static pages stay in sync with MDX content. Use `pnpm start` to serve the compiled output locally. `pnpm lint` executes ESLint across the repo. For full static output, run `pnpm export` (build + `next export`) to produce the `out/` directory.

## Coding Style & Naming Conventions
All runtime code is TypeScript. Default to server components unless interactivity requires `"use client"`. Use two-space indentation and prefer named exports. React components follow PascalCase (`ThemeToggle`), helpers use camelCase, and MDX slugs stay kebab-case (`edge-cdn-strategies.mdx`). Front matter dates must be `YYYY-MM-DD`. Tailwind classes should remain grouped logically (layout → spacing → color) to match existing patterns. Run `pnpm lint` before committing; no other auto-formatters are configured.

## Testing Guidelines
There is no automated test suite yet—treat linting and manual verification as required gates. After editing MDX, preview the page to confirm the generated reading time, metadata, and code highlighting. If you introduce tests, prefer Vitest or Testing Library, co-locate files as `<name>.test.ts(x)`, and document coverage expectations in the pull request.

## Commit & Pull Request Guidelines
Commit history favors short, present-tense summaries (`fix menubar color`). Group related changes per commit. Pull requests should explain the user-visible outcome, link any issues, and include screenshots or recordings for UI changes. Confirm `pnpm lint`, `pnpm build`, and any added tests succeed, and mention if the search index script or MDX slugs were updated.

## Content & Search Index Tips
Keep headings unique inside each MDX file so anchor links remain stable. When adding or renaming posts, rerun `pnpm build` (or `pnpm prebuild`) to refresh the per-locale blog search indexes consumed by the client. Portfolio apps do not feed the search index but must mirror the slug and locale folder structure used by blog posts.

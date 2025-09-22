import fs from "node:fs";
import path from "node:path";
// Client reconstructs Fuse instance; unused here.
import type { Locale, Post } from "./mdx";

export type SearchDoc = {
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  content: string;
  image?: string;
  date: string;
};

export function buildSearchIndex(posts: Post[], locale: Locale): SearchDoc[] {
  // Build a compact index and write to public for client-side fetch
  const bySlug = new Map<string, SearchDoc>();
  posts.forEach((p) => {
    if (bySlug.has(p.slug)) return;
    bySlug.set(p.slug, {
      slug: p.slug,
      title: p.frontmatter.title,
      description: p.frontmatter.description,
      tags: p.frontmatter.tags,
      content: p.content,
      image: p.frontmatter.image,
      date: p.frontmatter.date,
    });
  });
  const docs = Array.from(bySlug.values());

  const serialized = JSON.stringify({
    docs,
    // Fuse can be reconstructed client-side from docs to reduce file size.
  });

  const outDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  fs.writeFileSync(
    path.join(outDir, `search-index.${locale}.json`),
    serialized,
  );

  return docs;
}

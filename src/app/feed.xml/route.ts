import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, getAllPosts, getPostPermalink } from "@/lib/mdx";
import { getDictionary } from "@/lib/dictionary";

export const dynamic = "error";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://andrefrelicot.dev";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const locale = DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const posts = getAllPosts(locale);

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}${getPostPermalink(
        post.locale,
        post.slug,
        post.frontmatter.date,
      )}`;
      const title = escapeXml(post.frontmatter.title ?? post.slug);
      const description = escapeXml(post.frontmatter.description ?? "");
      const pubDate = new Date(post.frontmatter.date).toUTCString();
      const categories = (post.frontmatter.tags ?? [])
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
${categories ? `      ${categories}\n` : ""}    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(dictionary.site.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(dictionary.site.description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=900, stale-while-revalidate=86400",
    },
  });
}

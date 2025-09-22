import { NextResponse } from "next/server";
import { SUPPORTED_LOCALES, getAllPosts, getPostPermalink } from "@/lib/mdx";

export const dynamic = "error";

export async function GET() {
  const origin = "https://andrefrelicot.dev";
  const posts = getAllPosts();
  const localeRoots = SUPPORTED_LOCALES.map((locale) => `${origin}/${locale}`);
  const urls = [
    `${origin}/`,
    ...localeRoots,
    ...posts.map((p) => `${origin}${getPostPermalink(p.locale, p.slug, p.frontmatter.date)}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `<url><loc>${u}</loc><changefreq>weekly</changefreq></url>`) 
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}

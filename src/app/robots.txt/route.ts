import { NextResponse } from "next/server";

export const dynamic = "error";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://andrefrelicot.dev";

export async function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/feed.xml`;
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}


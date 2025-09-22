import type { Locale } from "./locales";

export function extractDateSegments(date: string): { year: string; month: string } {
  const match = String(date).match(/^(\d{4})-(\d{2})/);
  if (match) {
    return { year: match[1], month: match[2] };
  }
  return { year: "0000", month: "00" };
}

export function buildPostPath(locale: Locale | string, slug: string, date: string): string {
  const { year, month } = extractDateSegments(date);
  return `/${locale}/${year}/${month}/${slug}`;
}

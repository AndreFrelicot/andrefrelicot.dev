import { Locale } from "@/lib/mdx";

export function formatLocaleDate(locale: Locale, date: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(`${date}T00:00:00Z`),
    );
  } catch {
    return date;
  }
}

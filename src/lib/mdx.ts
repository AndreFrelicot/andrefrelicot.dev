import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "./locales";
import { buildPostPath, extractDateSegments } from "./post-path";

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getValidLocale,
  isLocale,
} from "./locales";
export type { Locale } from "./locales";

export type PostFrontMatter = {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  image?: string;
  type?: string;
  translations?: Partial<Record<Locale, string>>;
};

export type Post = {
  slug: string;
  locale: Locale;
  content: string;
  frontmatter: PostFrontMatter & {
    readingTimeMinutes: number;
  };
};

type TranslationIndex = {
  byCanonical: Map<string, Partial<Record<Locale, string>>>;
  canonicalByLocaleSlug: Map<string, string>;
};

let translationIndex: TranslationIndex | null = null;

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function resolveLocaleDir(locale: Locale): string {
  return path.join(CONTENT_DIR, locale);
}

function resolvePostPath(slug: string, locale: Locale): string | null {
  const dir = resolveLocaleDir(locale);
  if (!fs.existsSync(dir)) return null;

  const normalizedSlug = normalizeSlugSeparators(slug);
  const directCandidates = [
    path.join(dir, `${normalizedSlug}.mdx`),
    path.join(dir, `${normalizedSlug}.md`),
  ];

  for (const candidate of directCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const targetBase = normalizedSlug.split("/").pop();
  if (!targetBase) return null;

  const visit = (currentDir: string): string | null => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        const found = visit(fullPath);
        if (found) return found;
        continue;
      }
      if (!entry.isFile()) continue;
      if (entry.name === `${targetBase}.mdx` || entry.name === `${targetBase}.md`) {
        return fullPath;
      }
    }
    return null;
  };

  return visit(dir);
}

function normalizeTranslationSlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim().replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "");
}

function normalizeSlugSeparators(slug: string): string {
  return slug.split('/').filter(Boolean).join('/');
}

function resolveLocalizedSlug(baseSlug: string, candidate: string): string {
  const normalizedCandidate = normalizeSlugSeparators(candidate);

  if (normalizedCandidate.includes("/")) {
    return normalizedCandidate;
  }

  const lastSlash = baseSlug.lastIndexOf("/");
  if (lastSlash === -1) {
    return normalizedCandidate;
  }

  const prefix = baseSlug.slice(0, lastSlash);
  return normalizeSlugSeparators(`${prefix}/${normalizedCandidate}`);
}

function buildTranslationIndex(): TranslationIndex {
  const canonicalSlugs = listPostSlugs(DEFAULT_LOCALE);
  const byCanonical = new Map<string, Partial<Record<Locale, string>>>();
  const canonicalByLocaleSlug = new Map<string, string>();

  canonicalSlugs.forEach((canonicalSlug) => {
    const filePath = resolvePostPath(canonicalSlug, DEFAULT_LOCALE);
    if (!filePath) return;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    const locales: Partial<Record<Locale, string>> = {
      [DEFAULT_LOCALE]: canonicalSlug,
    };

    SUPPORTED_LOCALES.forEach((locale) => {
      if (locale === DEFAULT_LOCALE) return;
      const key = `${locale}_mdx`;
      const normalized = normalizeTranslationSlug(data[key]);
      if (normalized) {
        locales[locale] = resolveLocalizedSlug(canonicalSlug, normalized);
      }
    });

    byCanonical.set(canonicalSlug, locales);
    Object.entries(locales).forEach(([localeKey, slugValue]) => {
      canonicalByLocaleSlug.set(`${localeKey}:${slugValue}`, canonicalSlug);
    });
  });

  return { byCanonical, canonicalByLocaleSlug };
}

function getTranslationIndex(): TranslationIndex {
  if (!translationIndex) {
    translationIndex = buildTranslationIndex();
  }
  return translationIndex;
}

export function listPostSlugs(locale: Locale = DEFAULT_LOCALE): string[] {
  const dir = resolveLocaleDir(locale);
  if (!fs.existsSync(dir)) return [];
  const slugs = new Set<string>();

  const visit = (currentDir: string) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    entries.forEach((entry) => {
      if (entry.name.startsWith(".")) return;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        return;
      }
      if (!entry.isFile()) return;
      if (!/\.(md|mdx)$/i.test(entry.name)) return;
      const base = entry.name.replace(/\.(md|mdx)$/i, "");
      slugs.add(base);
    });
  };

  visit(dir);

  return Array.from(slugs).sort((a, b) => a.localeCompare(b));
}

export function listAllSlugs(): string[] {
  const slugs = new Set<string>();
  SUPPORTED_LOCALES.forEach((locale) => {
    listPostSlugs(locale).forEach((slug) => slugs.add(slug));
  });
  return Array.from(slugs);
}

export function normalizeDate(rawDate: unknown): string {
  if (rawDate instanceof Date) {
    return rawDate.toISOString().slice(0, 10);
  }
  if (typeof rawDate === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      return rawDate.slice(0, 10);
    }
    const parsed = new Date(rawDate);
    return isNaN(parsed.getTime())
      ? rawDate
      : parsed.toISOString().slice(0, 10);
  }
  const parsed = new Date(String(rawDate));
  return isNaN(parsed.getTime())
    ? String(rawDate)
    : parsed.toISOString().slice(0, 10);
}

export function readPostBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
  { allowFallback = true }: { allowFallback?: boolean } = {},
): Post {
  const localizedPath = resolvePostPath(slug, locale);
  const effectiveLocale = localizedPath ? locale : DEFAULT_LOCALE;
  const finalPath = localizedPath ?? resolvePostPath(slug, DEFAULT_LOCALE);

  if (!finalPath) {
    throw new Error(`Post "${slug}" not found for locale ${locale}`);
  }

  if (!localizedPath && !allowFallback && locale !== DEFAULT_LOCALE) {
    throw new Error(
      `Post "${slug}" missing locale ${locale} and fallback disabled`,
    );
  }

  const raw = fs.readFileSync(finalPath, "utf8");
  const { content, data } = matter(raw);
  const fm = data as PostFrontMatter & { date: unknown };
  const reading = readingTime(content);
  const translations: Partial<Record<Locale, string>> = {};

  const rawFrontmatter = data as Record<string, unknown>;

  SUPPORTED_LOCALES.forEach((loc) => {
    if (loc === DEFAULT_LOCALE) return;
    const key = `${loc}_mdx`;
    const normalized = normalizeTranslationSlug(rawFrontmatter[key]);
    if (normalized) {
      translations[loc] = normalized;
    }
  });

  const filteredFrontMatter = Object.fromEntries(
    Object.entries(fm).filter(([key]) => !key.endsWith("_mdx")),
  ) as PostFrontMatter & { date: unknown };

  return {
    slug,
    locale: effectiveLocale,
    content,
    frontmatter: {
      ...filteredFrontMatter,
      date: normalizeDate(fm.date),
      readingTimeMinutes: Math.ceil(reading.minutes),
      image: typeof fm.image === "string" ? fm.image : undefined,
      type: typeof fm.type === "string" ? fm.type : undefined,
      translations: Object.keys(translations).length ? translations : undefined,
    },
  };
}

export function getAllPosts(locale: Locale = DEFAULT_LOCALE): Post[] {
  const slugs =
    locale === DEFAULT_LOCALE ? listCanonicalSlugs() : listPostSlugs(locale);

  return slugs
    .map((slug) => readPostBySlug(slug, locale))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getAllPostsWithFallback(locale: Locale): Post[] {
  return listCanonicalSlugs()
    .map((canonicalSlug) => {
      const localizedSlug = getLocalizedSlug(canonicalSlug, locale);
      try {
        return readPostBySlug(localizedSlug, locale);
      } catch (error) {
        if (locale === DEFAULT_LOCALE || localizedSlug === canonicalSlug) {
          throw error;
        }
        return readPostBySlug(canonicalSlug, DEFAULT_LOCALE);
      }
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getDateSegments(date: string): { year: string; month: string } {
  const normalized = normalizeDate(date);
  return extractDateSegments(normalized);
}

export function getPostPermalink(
  locale: Locale,
  slug: string,
  date: string,
): string {
  return buildPostPath(locale, slug, normalizeDate(date));
}

export function getCanonicalSlug(locale: Locale, slug: string): string {
  const { canonicalByLocaleSlug } = getTranslationIndex();
  return canonicalByLocaleSlug.get(`${locale}:${slug}`) ?? slug;
}

export function getLocalizedSlug(canonicalSlug: string, locale: Locale): string {
  const { byCanonical } = getTranslationIndex();
  return byCanonical.get(canonicalSlug)?.[locale] ?? canonicalSlug;
}

export function getTranslationMap(canonicalSlug: string): Partial<Record<Locale, string>> {
  const { byCanonical } = getTranslationIndex();
  return byCanonical.get(canonicalSlug) ?? { [DEFAULT_LOCALE]: canonicalSlug };
}

export function listCanonicalSlugs(): string[] {
  return listPostSlugs(DEFAULT_LOCALE);
}

export function refreshTranslationIndex(): void {
  translationIndex = null;
}

export function getAllTranslationMappings(): Record<string, Partial<Record<Locale, string>>> {
  const { byCanonical } = getTranslationIndex();
  return Object.fromEntries(byCanonical.entries());
}

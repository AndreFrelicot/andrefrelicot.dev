import fs from "node:fs";
import path from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import { CodeCopyListener } from "@/components/mdx/code-copy-listener";
import { mdxComponents } from "@/components/mdx";
import { ShareMenu } from "@/components/share-menu";
import { formatLocaleDate } from "@/lib/date";
import { formatReadingTime, getDictionary } from "@/lib/dictionary";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getCanonicalSlug,
  getDateSegments,
  getLocalizedSlug,
  getPostPermalink,
  getValidLocale,
  listCanonicalSlugs,
  readPostBySlug,
  refreshTranslationIndex,
} from "@/lib/mdx";
import { rehypeCodeHeaders } from "@/lib/rehype-code-headers";

export const dynamic = "error";

const FALLBACK_OG_IMAGE = "/af16bits.jpg";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://andrefrelicot.dev";
const PUBLIC_DIR = path.join(process.cwd(), "public");

function normalizeImagePath(imagePath: string | undefined): string {
  if (!imagePath) return FALLBACK_OG_IMAGE;
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

function toAbsoluteUrl(urlPath: string): string {
  return new URL(urlPath, SITE_URL).toString();
}

function getImageCandidate(imagePath: string | undefined): { og: string; twitter: string } {
  const normalized = normalizeImagePath(imagePath);
  const relativeNormalized = normalized.replace(/^\/+/, "");
  const isWebp = normalized.endsWith(".webp");

  let preferredPath: string | null = null;

  if (isWebp) {
    const parsed = path.posix.parse(relativeNormalized);
    const basePath = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name;
    preferredPath = [".jpg", ".jpeg", ".png"].map((extension) => {
      const candidateRelativePath = `${basePath}${extension}`;
      const fileSystemPath = path.join(PUBLIC_DIR, candidateRelativePath);
      if (fs.existsSync(fileSystemPath)) {
        return `/${candidateRelativePath}`;
      }
      return null;
    }).find((candidate): candidate is string => candidate !== null) ?? null;
  }

  const resolvedPath = preferredPath ?? normalized;
  const absoluteUrl = toAbsoluteUrl(resolvedPath);

  return {
    og: absoluteUrl,
    twitter: absoluteUrl,
  };
}

export function generateStaticParams() {
  refreshTranslationIndex();
  const canonicalSlugs = listCanonicalSlugs();
  return canonicalSlugs.flatMap((canonicalSlug) =>
    SUPPORTED_LOCALES.map((locale) => {
      const localizedSlug = getLocalizedSlug(canonicalSlug, locale);
      const post = readPostBySlug(localizedSlug, locale);
      const { year, month } = getDateSegments(post.frontmatter.date);
      return { locale, year, month, slug: localizedSlug };
    }),
  );
}

type PageParams = Promise<{
  locale: string;
  year: string;
  month: string;
  slug: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}) {
  const resolved = await params;
  const locale = getValidLocale(resolved.locale);
  const canonicalSlug = getCanonicalSlug(locale, resolved.slug);
  const localizedSlug = getLocalizedSlug(canonicalSlug, locale);
  const post = readPostBySlug(localizedSlug, locale);
  const defaultPost = readPostBySlug(canonicalSlug, DEFAULT_LOCALE);
  const pathForLocale = getPostPermalink(locale, localizedSlug, post.frontmatter.date);
  const previewImages = getImageCandidate(post.frontmatter.image);

  const languageAlternates = Object.fromEntries(
    SUPPORTED_LOCALES.map((loc) => {
      const targetSlug = getLocalizedSlug(canonicalSlug, loc);
      const localizedPost = readPostBySlug(targetSlug, loc);
      return [loc, getPostPermalink(loc, targetSlug, localizedPost.frontmatter.date)];
    }),
  );

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: getPostPermalink(DEFAULT_LOCALE, canonicalSlug, defaultPost.frontmatter.date),
      languages: languageAlternates,
    },
    openGraph: {
      type: "article",
      url: pathForLocale,
      images: [
        {
          url: previewImages.og,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      site: "@AndreFrelicot",
      images: [previewImages.twitter],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: PageParams;
}) {
  const resolved = await params;
  const locale = getValidLocale(resolved.locale);
  const dictionary = getDictionary(locale);
  const canonicalSlug = getCanonicalSlug(locale, resolved.slug);
  const localizedSlug = getLocalizedSlug(canonicalSlug, locale);
  const post = readPostBySlug(localizedSlug, locale);
  const sharePath = getPostPermalink(locale, localizedSlug, post.frontmatter.date);
  const formattedDate = formatLocaleDate(locale, post.frontmatter.date);

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        {post.frontmatter.title}
      </h1>
      <div className="mb-6 flex flex-col gap-3 text-sm text-foreground/80 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-2 opacity-70">
          <span>
            {dictionary.post.publishedOnPrefix} {formattedDate}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(dictionary, post.frontmatter.readingTimeMinutes)}</span>
        </p>
        <div className="not-prose flex items-center justify-start sm:justify-end">
          <ShareMenu title={post.frontmatter.title} urlPath={sharePath} />
        </div>
      </div>
      <MDXRemote
        source={post.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkSmartypants],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: "github-light",
                    dark: "github-dark",
                  },
                },
              ],
              rehypeCodeHeaders,
            ],
          },
        }}
      />
      <CodeCopyListener />
    </article>
  );
}

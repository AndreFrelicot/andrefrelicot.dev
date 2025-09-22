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
      url: pathForLocale,
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

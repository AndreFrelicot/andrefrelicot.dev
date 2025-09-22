import { Suspense } from "react";
import { SiteShell } from "@/components/site-shell";
import { ClientSearch } from "./search-client";
import { getDictionary } from "@/lib/dictionary";
import { buildSearchIndex } from "@/lib/search";
import {
  SUPPORTED_LOCALES,
  getAllPostsWithFallback,
  getPostPermalink,
  getValidLocale,
  getLocalizedSlug,
  readPostBySlug,
} from "@/lib/mdx";

type PageParams = Promise<{ locale: string }>;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}) {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const dictionary = getDictionary(locale);
  return {
    title: {
      absolute: `${dictionary.site.title} - ${dictionary.home.tagline}`,
    },
    description: dictionary.content.intro,
  };
}

export const dynamic = "error";

export default async function LocaleHome({
  params,
}: {
  params: PageParams;
}) {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const dictionary = getDictionary(locale);
  const aboutSlug = getLocalizedSlug("about", locale);
  const aboutPost = readPostBySlug(aboutSlug, locale);
  const aboutPath = getPostPermalink(locale, aboutSlug, aboutPost.frontmatter.date);

  const posts = getAllPostsWithFallback(locale);
  const docs = buildSearchIndex(posts, locale);
  const pathsBySlug = Object.fromEntries(
    posts.map((post) => [
      post.slug,
      getPostPermalink(locale, post.slug, post.frontmatter.date),
    ]),
  );

  return (
    <SiteShell
      locale={locale}
      navLinks={[
        {
          href: `/${locale}`,
          label: dictionary.nav.content,
        },
        {
          href: `/${locale}?tag=apps`,
          label: dictionary.nav.apps,
        },
        {
          href: aboutPath,
          label: dictionary.nav.about,
        },
      ]}
      title={
        <div className="flex flex-col leading-tight">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dictionary.home.headline}
          </h1>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/55 sm:text-sm sm:tracking-[0.32em]">
            {dictionary.home.tagline}
          </span>
        </div>
      }
    >
      <Suspense fallback={null}>
        <ClientSearch
          locale={locale}
          copy={{
            placeholder: dictionary.content.searchPlaceholder,
            allLabel: dictionary.content.allTag,
            empty: dictionary.content.empty,
            showTags: dictionary.content.showTags,
            hideTags: dictionary.content.hideTags,
            loadMore: dictionary.content.loadMore,
          }}
          initialDocs={docs}
          pathsBySlug={pathsBySlug}
        />
      </Suspense>
    </SiteShell>
  );
}

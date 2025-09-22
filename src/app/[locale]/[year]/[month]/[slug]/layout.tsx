import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getDictionary } from "@/lib/dictionary";
import {
  SUPPORTED_LOCALES,
  type Locale,
  getCanonicalSlug,
  getDateSegments,
  getLocalizedSlug,
  getPostPermalink,
  getValidLocale,
  readPostBySlug,
} from "@/lib/mdx";

type LayoutParams = Promise<{
  locale: string;
  year: string;
  month: string;
  slug: string;
}>;

export default async function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LayoutParams;
}) {
  const resolved = await params;
  const locale = getValidLocale(resolved.locale);
  const dictionary = getDictionary(locale);
  const aboutSlug = getLocalizedSlug("about", locale);
  const aboutPost = readPostBySlug(aboutSlug, locale);
  const aboutPath = getPostPermalink(locale, aboutSlug, aboutPost.frontmatter.date);
  const canonicalSlug = getCanonicalSlug(locale, resolved.slug);
  const languagePaths = Object.fromEntries(
    SUPPORTED_LOCALES.map((loc) => {
      const targetSlug = getLocalizedSlug(canonicalSlug, loc);
      const targetPost = readPostBySlug(targetSlug, loc);
      const { year, month } = getDateSegments(targetPost.frontmatter.date);
      return [loc, `${year}/${month}/${targetSlug}`];
    }),
  ) as Partial<Record<Locale, string>>;
  const currentPath = languagePaths[locale];

  return (
    <SiteShell
      locale={locale}
      languagePath={currentPath}
      languagePaths={languagePaths}
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
        <Link
          href={`/${locale}`}
          className="inline-flex flex-col leading-tight text-foreground"
        >
          <span className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dictionary.site.title}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/55 sm:text-sm sm:tracking-[0.32em]">
            {dictionary.home.tagline}
          </span>
        </Link>
      }
    >
      {children}
    </SiteShell>
  );
}

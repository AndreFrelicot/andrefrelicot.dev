import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getDictionary } from "@/lib/dictionary";
import { DEFAULT_LOCALE } from "@/lib/mdx";

export const metadata = {
  title: "404 - Page Not Found",
};

export default function NotFound() {
  // For static export, we default to the main locale
  // The root not-found.tsx will be used for most 404s
  const locale = DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);

  return (
    <SiteShell
      locale={locale}
      navLinks={[
        {
          href: `/${locale}`,
          label: dictionary.nav.content,
        },
      ]}
      title={
        <div className="flex flex-col leading-tight">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dictionary.notFound.heading}
          </h1>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-8 text-8xl font-bold opacity-20">404</div>
        <p className="mb-8 max-w-md text-lg opacity-70">
          {dictionary.notFound.message}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 bg-foreground/5 px-6 py-3 font-semibold transition-all hover:border-foreground/40 hover:bg-foreground/10"
        >
          {dictionary.notFound.backHome}
        </Link>
      </div>
    </SiteShell>
  );
}

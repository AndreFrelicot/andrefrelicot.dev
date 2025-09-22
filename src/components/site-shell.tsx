import type { ReactNode } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/mdx";
import type { SiteHeaderNavLink } from "./site-header";
import { SiteHeader } from "./site-header";
import { Footer } from "./footer";

type SiteShellProps = {
  locale: Locale;
  navLinks?: SiteHeaderNavLink[];
  title: ReactNode;
  languagePath?: string;
  languagePaths?: Partial<Record<Locale, string>>;
  children: ReactNode;
  disableContentSpacing?: boolean;
  contentClassName?: string;
};

export function SiteShell({
  locale,
  navLinks,
  title,
  languagePath,
  languagePaths,
  children,
  disableContentSpacing = false,
  contentClassName,
}: SiteShellProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
      <SiteHeader
        locale={locale}
        navLinks={navLinks}
        title={title}
        languagePath={languagePath}
        languagePaths={languagePaths}
      />
      <main
        className={clsx(
          disableContentSpacing ? "pb-10" : "mt-8 pb-10",
          contentClassName,
        )}
      >
        {children}
      </main>
      <Footer withContainer={false} className="mt-6" />
    </div>
  );
}

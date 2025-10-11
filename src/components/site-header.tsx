"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { Locale } from "@/lib/mdx";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

export type SiteHeaderNavLink = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
};

type SiteHeaderProps = {
  locale: Locale;
  title: ReactNode;
  navLinks?: SiteHeaderNavLink[];
  languagePath?: string;
  languagePaths?: Partial<Record<Locale, string>>;
};

export function SiteHeader({
  locale,
  title,
  navLinks = [],
  languagePath,
  languagePaths,
}: SiteHeaderProps) {
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY <= 4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [locale]);

  const navItems = navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={
        link.variant === "ghost"
          ? "rounded-md border border-foreground/10 dark:border-foreground/15 px-4 py-1.5 text-sm font-medium text-foreground/80 transition hover:border-foreground/60 hover:text-foreground"
          : "rounded-md border border-foreground/10 dark:border-foreground/15 px-4 py-1.5 text-sm font-medium transition hover:bg-foreground hover:text-background"
      }
      onClick={() => setMenuOpen(false)}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 flex w-full items-center justify-between gap-3 glass-nav py-3 transition-opacity duration-300",
          atTop ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="min-w-0 text-pretty">
          {title}
        </div>
        <div className="flex items-center gap-2">
          {navLinks.length ? (
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 dark:border-foreground/15 text-foreground transition hover:border-foreground/50 md:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          ) : null}
          <nav className="hidden items-center gap-2 md:flex">{navItems}</nav>
          <ThemeToggle />
          <LanguageSwitcher
            currentLocale={locale}
            path={languagePath}
            paths={languagePaths}
          />
        </div>
      </header>
      {navLinks.length ? (
        <nav
          className={clsx(
            "md:hidden flex origin-top flex-col gap-2 overflow-hidden rounded-xl transition-all duration-200 ease-out",
            menuOpen
              ? "glass-nav mt-2 max-h-64 border border-foreground/10 dark:border-foreground/15 p-3 opacity-100 pointer-events-auto"
              : "max-h-0 border border-transparent p-0 opacity-0 pointer-events-none",
          )}
        >
          {navItems}
        </nav>
      ) : null}
    </>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span
      className={clsx(
        "relative block h-4 w-5",
        "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-current before:transition",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-current after:transition",
        open ? "before:translate-y-1.5 before:rotate-45 after:-translate-y-1.5 after:-rotate-45" : "before:translate-y-0 after:translate-y-0",
      )}
    >
      <span
        className={clsx(
          "absolute inset-x-0 top-1/2 h-0.5 bg-current transition",
          open ? "opacity-0" : "-translate-y-1/2 opacity-100",
        )}
      />
    </span>
  );
}

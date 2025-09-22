"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/locales";

const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  pt: "PT",
  es: "ES",
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  path?: string;
  paths?: Partial<Record<Locale, string>>;
  className?: string;
};

export function LanguageSwitcher({
  currentLocale,
  path,
  paths,
  className,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getPathForLocale = (locale: Locale): string => {
    const candidate = paths?.[locale] ?? path ?? "";
    if (!candidate) return "";
    const trimmed = candidate.replace(/^\/+|\/+$/g, "");
    return trimmed ? `/${trimmed}` : "";
  };

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "flex h-9 items-center rounded-full text-xs font-semibold uppercase tracking-wide backdrop-blur transition-all duration-200",
        open
          ? "overflow-hidden border border-foreground/20 bg-background/70 gap-1 pl-0.5 pr-1.5"
          : "overflow-visible border-none bg-transparent w-9 justify-center",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-200",
          open
            ? "border border-transparent bg-transparent"
            : "border border-foreground/20 bg-background/70 hover:border-foreground/40",
        )}
      >
        <GlobeIcon className="h-4 w-4" />
      </button>
      <nav
        aria-hidden={!open}
        className={clsx(
          "flex h-full items-center gap-1 overflow-hidden pr-0.5 transition-all duration-200",
          open
            ? "max-w-[220px] opacity-100"
            : "pointer-events-none max-w-0 opacity-0",
        )}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <Link
            key={locale}
            href={`/${locale}${getPathForLocale(locale)}`}
            aria-current={locale === currentLocale ? "page" : undefined}
            className={clsx(
              "inline-block rounded-full px-3 py-1 transition-colors",
              locale === currentLocale
                ? "bg-foreground text-background shadow"
                : "text-foreground/60 hover:text-foreground",
            )}
            onClick={() => setOpen(false)}
          >
            {LOCALE_LABEL[locale]}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z" />
    </svg>
  );
}

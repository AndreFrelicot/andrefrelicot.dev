"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  SUPPORTED_LOCALES,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/locales";

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
        "relative flex h-9 w-9 items-center justify-center text-xs font-semibold uppercase tracking-wide transition-all duration-200",
        open ? "z-40" : "z-10",
        "flex-shrink-0",
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
          "absolute right-0 top-full z-50 mt-2 flex items-center gap-1 rounded-full border border-foreground/20 bg-background/90 px-0.5 py-1 text-xs font-semibold uppercase tracking-wide shadow-lg backdrop-blur transition duration-150",
          "origin-top-right transform",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
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
            onClick={() => {
              localStorage.setItem(LOCALE_STORAGE_KEY, locale);
              setOpen(false);
            }}
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

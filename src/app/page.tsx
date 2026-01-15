"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
} from "@/lib/locales";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Priority 1: localStorage preference
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && isLocale(saved)) {
      router.replace(`/${saved}`);
      return;
    }

    // Priority 2: Browser language
    const browserLang = navigator.language.split("-")[0];
    const locale = SUPPORTED_LOCALES.includes(
      browserLang as (typeof SUPPORTED_LOCALES)[number],
    )
      ? browserLang
      : DEFAULT_LOCALE;
    router.replace(`/${locale}`);
  }, [router]);

  return null;
}

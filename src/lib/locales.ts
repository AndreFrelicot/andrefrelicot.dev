export const SUPPORTED_LOCALES = ["en", "fr", "pt", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "preferred-locale";

export function isLocale(candidate: string): candidate is Locale {
  return SUPPORTED_LOCALES.includes(candidate as Locale);
}

export function getValidLocale(candidate: string | undefined): Locale {
  if (!candidate) return DEFAULT_LOCALE;
  return isLocale(candidate) ? candidate : DEFAULT_LOCALE;
}

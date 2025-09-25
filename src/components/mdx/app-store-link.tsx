"use client";

import clsx from "clsx";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const BADGE_MAP = {
  en: {
    light: "/images/appstore/Download_on_the_App_Store_Badge_US-UK_RGB_wht_092917.svg",
    dark: "/images/appstore/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg",
  },
  fr: {
    light: "/images/appstore/Download_on_the_App_Store_Badge_FR_RGB_wht_100217.svg",
    dark: "/images/appstore/Download_on_the_App_Store_Badge_FR_RGB_blk_100517.svg",
  },
  es: {
    light: "/images/appstore/Download_on_the_App_Store_Badge_ES_RGB_wht_100217.svg",
    dark: "/images/appstore/Download_on_the_App_Store_Badge_ES_RGB_blk_100217.svg",
  },
  pt: {
    light: "/images/appstore/Download_on_the_App_Store_Badge_PTBR_RGB_wht_100317.svg",
    dark: "/images/appstore/Download_on_the_App_Store_Badge_PTBR_RGB_blk_092917.svg",
  },
} as const;

type BadgeLocale = keyof typeof BADGE_MAP;

const DEFAULT_BADGE_LOCALE: BadgeLocale = "en";
const LINK_LABEL = "Download on the App Store";

type AppStoreLinkProps = {
  href: string;
  className?: string;
  ariaLabel?: string;
};

export function AppStoreLink({
  href,
  className,
  ariaLabel,
}: AppStoreLinkProps) {
  const params = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const localeParam = params?.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;
  const resolvedLocale: BadgeLocale = (
    locale && locale in BADGE_MAP ? locale : DEFAULT_BADGE_LOCALE
  ) as BadgeLocale;
  const badge = BADGE_MAP[resolvedLocale];
  const label = ariaLabel ?? LINK_LABEL;
  const theme = mounted ? resolvedTheme : undefined;
  const badgeSrc = theme === "light" ? badge.light : badge.dark;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("inline-flex", className)}
      aria-label={label}
      title={label}
    >
      <Image
        key={`${resolvedLocale}-${badgeSrc}`}
        src={badgeSrc}
        alt={label}
        width={120}
        height={40}
        className="h-10 w-auto"
      />
    </a>
  );
}

export default AppStoreLink;

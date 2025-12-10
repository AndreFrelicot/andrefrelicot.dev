"use client";

import clsx from "clsx";
import Image from "next/image";
import { useParams } from "next/navigation";

const BADGE_MAP = {
  en: "/images/playstore/GetItOnGooglePlay_Badge_Web_color_English.svg",
  fr: "/images/playstore/GetItOnGooglePlay_Badge_Web_color_French.svg",
  es: "/images/playstore/GetItOnGooglePlay_Badge_Web_color_Spanish.svg",
  pt: "/images/playstore/GetItOnGooglePlay_Badge_Web_color_Portuguese-Brazil.svg",
  de: "/images/playstore/GetItOnGooglePlay_Badge_Web_color_German.svg",
  ja: "/images/playstore/GetItOnGooglePlay_Badge_Web_color_Japanese.svg",
} as const;

type BadgeLocale = keyof typeof BADGE_MAP;

const DEFAULT_BADGE_LOCALE: BadgeLocale = "en";
const LINK_LABEL = "Get it on Google Play";

type PlayStoreLinkProps = {
  href: string;
  className?: string;
  ariaLabel?: string;
};

export function PlayStoreLink({
  href,
  className,
  ariaLabel,
}: PlayStoreLinkProps) {
  const params = useParams();

  const localeParam = params?.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;
  const resolvedLocale: BadgeLocale = (
    locale && locale in BADGE_MAP ? locale : DEFAULT_BADGE_LOCALE
  ) as BadgeLocale;
  const badgeSrc = BADGE_MAP[resolvedLocale];
  const label = ariaLabel ?? LINK_LABEL;

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
        width={135}
        height={40}
        className="h-10 w-auto"
      />
    </a>
  );
}

export default PlayStoreLink;

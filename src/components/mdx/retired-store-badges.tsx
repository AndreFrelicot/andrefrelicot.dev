"use client";

import { type MouseEvent, type ReactNode, useState } from "react";
import { AppStoreLink } from "./app-store-link";
import { Callout } from "./callout";
import { PlayStoreLink } from "./play-store-link";

type RetiredStoreBadgesProps = {
  appStoreHref: string;
  playStoreHref: string;
  title: string;
  children: ReactNode;
};

// Store badges for an app that is no longer distributed: clicking a badge
// shows a notice instead of opening the store listing.
export function RetiredStoreBadges({
  appStoreHref,
  playStoreHref,
  title,
  children,
}: RetiredStoreBadgesProps) {
  const [showNotice, setShowNotice] = useState(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowNotice(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3">
        <AppStoreLink href={appStoreHref} onClick={handleClick} />
        <PlayStoreLink href={playStoreHref} onClick={handleClick} />
      </div>
      <div aria-live="polite">
        {showNotice && (
          <Callout type="info" title={title}>
            {children}
          </Callout>
        )}
      </div>
    </div>
  );
}

export default RetiredStoreBadges;

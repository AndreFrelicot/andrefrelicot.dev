import Image from "next/image";
import type { ReactNode } from "react";

type AppExpressSourceBannerProps = {
  children: ReactNode;
  href: string;
  linkLabel: string;
};

export function AppExpressSourceBanner({
  children,
  href,
  linkLabel,
}: AppExpressSourceBannerProps) {
  return (
    <aside className="not-prose my-8 rounded-lg border border-foreground/15 bg-foreground/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="relative h-7 w-44">
            <Image
              src="/images/appexpress/appexpress-logo-black.svg"
              alt="AppExpress"
              fill
              priority={false}
              className="theme-light-only object-contain"
            />
            <Image
              src="/images/appexpress/appexpress-logo-white.svg"
              alt="AppExpress"
              fill
              priority={false}
              className="theme-dark-only object-contain"
            />
          </div>
          <div className="text-sm leading-6 text-foreground/75 [&>p]:m-0">
            {children}
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-skip-arrow
          className="inline-flex shrink-0 items-center justify-center rounded-md border border-foreground/20 px-3 py-2 text-sm font-semibold text-foreground transition hover:border-foreground/35 hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45"
        >
          {linkLabel}
        </a>
      </div>
    </aside>
  );
}

export default AppExpressSourceBanner;

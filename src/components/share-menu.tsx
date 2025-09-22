"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import clsx from "clsx";

type ShareMenuProps = {
  title: string;
  urlPath: string;
  className?: string;
};

type ShareTarget = {
  name: string;
  href: (url: string, text: string) => string;
  icon: ComponentType<{ className?: string }>;
};

const SHARE_TARGETS: ShareTarget[] = [
  {
    name: "X",
    href: (url, text) => {
      const params = new URLSearchParams({
        url,
        text,
      });
      return `https://twitter.com/intent/tweet?${params.toString()}`;
    },
    icon: (props) => <XIcon {...props} />,
  },
  {
    name: "LinkedIn",
    href: (url, text) => {
      const params = new URLSearchParams({
        mini: "true",
        url,
        title: text,
      });
      return `https://www.linkedin.com/shareArticle?${params.toString()}`;
    },
    icon: (props) => <LinkedInIcon {...props} />,
  },
  {
    name: "Facebook",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url })}`,
    icon: (props) => <FacebookIcon {...props} />,
  },
  {
    name: "Threads",
    href: (url, text) => {
      const message = `${text} ${url}`.trim();
      return `https://www.threads.net/intent/post?${new URLSearchParams({ text: message })}`;
    },
    icon: (props) => <ThreadsIcon {...props} />,
  },
  {
    name: "Bluesky",
    href: (url, text) => {
      const message = `${text} ${url}`.trim();
      return `https://bsky.app/intent/compose?${new URLSearchParams({ text: message })}`;
    },
    icon: (props) => <BlueskyIcon {...props} />,
  },
];

export function ShareMenu({ title, urlPath, className }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
  }, []);

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

  const shareUrl = useMemo(() => {
    const base = origin ?? "";
    const normalizedPath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
    return `${base}${normalizedPath}`;
  }, [origin, urlPath]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "flex h-9 items-center rounded-full text-xs font-semibold tracking-wide backdrop-blur transition-all duration-200",
        open
          ? "gap-1 overflow-hidden border border-foreground/20 bg-background/70 pl-0.5 pr-1.5"
          : "w-9 justify-center overflow-visible border-none bg-transparent",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Share this article"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-200",
          open
            ? "border border-transparent bg-transparent"
            : "border border-foreground/20 bg-background/70 hover:border-foreground/40",
        )}
      >
        <ShareIcon className="h-4 w-4" />
      </button>
      <nav
        aria-hidden={!open}
        className={clsx(
          "flex h-full items-center gap-1 overflow-hidden pr-0.5 transition-all duration-200",
          open
            ? "max-w-[240px] opacity-100"
            : "pointer-events-none max-w-0 opacity-0",
        )}
      >
        {SHARE_TARGETS.map((target) => {
          const href = target.href(shareUrl, title);
          const Icon = target.icon;
          const iconClassName =
            target.name === "LinkedIn" ? "h-5 w-5 shrink-0" : "h-4 w-4 shrink-0";
          return (
            <a
              key={target.name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${target.name}`}
              data-skip-arrow
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <Icon className={iconClassName} />
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function ShareIcon({ className }: { className?: string }) {
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
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
      <path d="M16 8L12 4 8 8" />
      <path d="M12 4v12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 640"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
    </svg>
  );
}

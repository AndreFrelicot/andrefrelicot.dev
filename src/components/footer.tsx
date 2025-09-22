import Link from "next/link";

import clsx from "clsx";

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/andr%C3%A9-fr%C3%A9licot-44aa2336/",
    icon: LinkedInIcon,
  },
  {
    name: "X",
    href: "https://x.com/AndreFrelicot",
    icon: XIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/AndreFrelicot",
    icon: GitHubIcon,
  },
];

type FooterProps = {
  withContainer?: boolean;
  className?: string;
};

export function Footer({ withContainer = true, className }: FooterProps) {
  const content = (
    <div className="flex w-full flex-col gap-4 border-t footer-border pt-6 sm:flex-row sm:items-center">
      <p className="text-xs uppercase tracking-wide opacity-70">
        © {new Date().getFullYear()} André Frélicot
      </p>
      <nav className="flex items-center gap-2 self-end sm:ml-auto">
        {socials.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground transition hover:border-foreground/40 hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <footer className={clsx("bg-background/80 py-8 text-sm text-foreground/80", className)}>
      {withContainer ? (
        <div className="mx-auto max-w-5xl px-4 sm:px-6">{content}</div>
      ) : (
        content
      )}
    </footer>
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

import clsx from "clsx";
import Image from "next/image";

type PubDevLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

const DEFAULT_LABEL = "View packages on pub.dev";

export function PubDevLink({ href, label, className }: PubDevLinkProps) {
  const displayLabel = label ?? DEFAULT_LABEL;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex items-center rounded-md bg-[#263238] px-3 py-2 transition hover:bg-[#1f292d]",
        className,
      )}
      aria-label={displayLabel}
      title={displayLabel}
    >
      <Image
        src="/images/2026/dartvex/pub-dev-logo.svg"
        alt={displayLabel}
        width={188}
        height={40}
        className="h-10 w-auto"
      />
    </a>
  );
}

export default PubDevLink;

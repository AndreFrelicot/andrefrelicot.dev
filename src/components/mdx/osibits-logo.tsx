import Image from "next/image";
import Link from "next/link";

export function OsibitsLogo() {
  return (
    <Link
      href="https://osibits.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <div className="bg-white rounded-xl p-4 inline-block shadow-sm hover:shadow-md transition-shadow">
        <Image
          src="/images/osibits-logo.svg"
          alt="Osibits"
          width={120}
          height={28}
          className="h-7 w-auto"
        />
      </div>
    </Link>
  );
}

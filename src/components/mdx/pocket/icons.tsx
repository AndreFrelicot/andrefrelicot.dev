import type { ReactNode } from "react";

// Line icons shared by the plates: 24px grid, 1.7px stroke, drawn in the
// current colour so each one takes the tone of the panel it sits in.
const PATHS = {
  prompt: (
    <>
      <path d="M4 5h16v11H10l-5 4v-4H4z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  gizmo: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  publish: (
    <>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M5 14v5h14v-5" />
    </>
  ),
  feed: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M3.5 7v10M20.5 7v10M10.5 17.5h3" />
    </>
  ),
  remix: (
    <>
      <path d="M4.5 9.5A8 8 0 0118 6l2 2M19.5 14.5A8 8 0 016 18l-2-2" />
      <path d="M20 4v4h-4M4 20v-4h4" />
    </>
  ),
  agent: (
    <>
      <path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  build: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10.5 12.5l-2 2 2 2M13.5 12.5l2 2-2 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
      <path d="M9 12l2.2 2.2L15 10.4" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17" />
    </>
  ),
  haptic: (
    <>
      <rect x="8" y="4" width="8" height="16" rx="2" />
      <path d="M4.5 9v6M19.5 9v6M2 10.5v3M22 10.5v3" />
    </>
  ),
  motion: (
    <>
      <rect x="8" y="4" width="8" height="16" rx="2" transform="rotate(18 12 12)" />
      <path d="M3 17.5a11 11 0 005.5 3.5M21 6.5A11 11 0 0015.5 3" />
    </>
  ),
  audio: <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />,
  text: (
    <>
      <path d="M4 6h12M10 6v13" />
      <path d="M18 12l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M3.5 17l5-4.5 3.5 3 3-2.5 5.5 4.5" />
    </>
  ),
  tweaks: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  analytics: <path d="M3 20h18M6 20v-8M11 20V5M16 20v-6M21 20V9" />,
  request: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M12 16V8M9 11l3-3 3 3" />
    </>
  ),
  ranking: <path d="M4 6h10M4 12h16M4 18h7M18 4l2 2-2 2" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

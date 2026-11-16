import type { ReactNode } from "react";

// GridStream's architecture: the Mac serves the iPad and the web UI, and a
// shared Swift package carries the contract between Mac and iPad. Three columns
// on large screens, stacked with downward arrows on small ones.
type Locale = "fr" | "en" | "es" | "pt";

type NodeCopy = { title: string; sub: string; items: ReactNode[] };

type Copy = {
  label: string;
  mac: NodeCopy & { foot: string };
  ipad: NodeCopy;
  web: NodeCopy;
  toIpad: string[];
  toWeb: string;
  kit: { title: string; text: string };
};

const COPY: Record<Locale, Copy> = {
  fr: {
    label:
      "Schéma d'architecture : le Mac sert l'iPad et l'interface web ; GridStreamKit partage le contrat entre Mac et iPad.",
    mac: {
      title: "Mac",
      sub: "serveur · Swift 6",
      items: [
        "App de barre des menus SwiftUI",
        <>
          Vapor · API REST <code>/api/v1</code>
        </>,
        "SQLite via GRDB · migrations",
        "Scanner · ID xxHash64 partiel + taille",
        "Bookmarks à portée de sécurité",
        "Images de scrub précalculées, en cache",
        "Streaming HTTP Range",
        "PIN + jeton de session",
        <>
          Bonjour <code>_gridstream._tcp</code>
        </>,
      ],
      foot: "Les vidéos restent dans vos dossiers : rien n'est copié.",
    },
    ipad: {
      title: "iPad",
      sub: "client · SwiftUI",
      items: [
        "Grille, plein écran, fenêtres flottantes",
        "AVPlayer · pool partagé de lecteurs",
        "PencilKit · annotations normalisées",
        "MTAudioProcessingTap · normalisation, panoramique",
        "SwiftData · dispositions et presets",
        "Découverte Bonjour · jeton en Keychain",
      ],
    },
    web: {
      title: "Web",
      sub: "navigateur · Angular 21",
      items: [
        "Composants standalone, signals, Tailwind",
        "Session par cookie, même port que l'API",
      ],
    },
    toIpad: ["REST JSON + jeton", "vidéo : HTTP Range", "images de scrub"],
    toWeb: "HTML + API",
    kit: {
      title: "GridStreamKit",
      text: "Paquet Swift partagé par le Mac et l'iPad : types du contrat, fixtures JSON vérifiées des deux côtés.",
    },
  },
  en: {
    label:
      "Architecture diagram: the Mac serves the iPad and the web UI; GridStreamKit shares the contract between Mac and iPad.",
    mac: {
      title: "Mac",
      sub: "server · Swift 6",
      items: [
        "SwiftUI menu bar app",
        <>
          Vapor · REST API <code>/api/v1</code>
        </>,
        "SQLite via GRDB · migrations",
        "Scanner · partial xxHash64 + size ID",
        "Security-scoped bookmarks",
        "Precomputed, cached scrub frames",
        "HTTP Range streaming",
        "PIN + session token",
        <>
          Bonjour <code>_gridstream._tcp</code>
        </>,
      ],
      foot: "Your videos stay in your folders: nothing is copied.",
    },
    ipad: {
      title: "iPad",
      sub: "client · SwiftUI",
      items: [
        "Grid, full screen, floating windows",
        "AVPlayer · shared player pool",
        "PencilKit · normalized annotations",
        "MTAudioProcessingTap · normalization, panning",
        "SwiftData · layouts and presets",
        "Bonjour discovery · token in Keychain",
      ],
    },
    web: {
      title: "Web",
      sub: "browser · Angular 21",
      items: [
        "Standalone components, signals, Tailwind",
        "Cookie session, same port as the API",
      ],
    },
    toIpad: ["REST JSON + token", "video: HTTP Range", "scrub frames"],
    toWeb: "HTML + API",
    kit: {
      title: "GridStreamKit",
      text: "Swift package shared by the Mac and the iPad: contract types, JSON fixtures checked on both sides.",
    },
  },
  es: {
    label:
      "Diagrama de arquitectura: el Mac sirve al iPad y a la interfaz web; GridStreamKit comparte el contrato entre Mac e iPad.",
    mac: {
      title: "Mac",
      sub: "servidor · Swift 6",
      items: [
        "App de barra de menús SwiftUI",
        <>
          Vapor · API REST <code>/api/v1</code>
        </>,
        "SQLite con GRDB · migraciones",
        "Escáner · ID xxHash64 parcial + tamaño",
        "Marcadores con ámbito de seguridad",
        "Fotogramas de scrub precalculados, en caché",
        "Streaming HTTP Range",
        "PIN + token de sesión",
        <>
          Bonjour <code>_gridstream._tcp</code>
        </>,
      ],
      foot: "Los vídeos se quedan en tus carpetas: no se copia nada.",
    },
    ipad: {
      title: "iPad",
      sub: "cliente · SwiftUI",
      items: [
        "Cuadrícula, pantalla completa, ventanas flotantes",
        "AVPlayer · pool compartido de reproductores",
        "PencilKit · anotaciones normalizadas",
        "MTAudioProcessingTap · normalización, paneo",
        "SwiftData · disposiciones y presets",
        "Descubrimiento Bonjour · token en el Llavero",
      ],
    },
    web: {
      title: "Web",
      sub: "navegador · Angular 21",
      items: [
        "Componentes standalone, signals, Tailwind",
        "Sesión por cookie, mismo puerto que la API",
      ],
    },
    toIpad: ["REST JSON + token", "vídeo: HTTP Range", "fotogramas de scrub"],
    toWeb: "HTML + API",
    kit: {
      title: "GridStreamKit",
      text: "Paquete Swift compartido por el Mac y el iPad: tipos del contrato, fixtures JSON verificados en ambos lados.",
    },
  },
  pt: {
    label:
      "Diagrama de arquitetura: o Mac serve o iPad e a interface web; o GridStreamKit compartilha o contrato entre Mac e iPad.",
    mac: {
      title: "Mac",
      sub: "servidor · Swift 6",
      items: [
        "App de barra de menus SwiftUI",
        <>
          Vapor · API REST <code>/api/v1</code>
        </>,
        "SQLite com GRDB · migrações",
        "Scanner · ID xxHash64 parcial + tamanho",
        "Bookmarks com escopo de segurança",
        "Quadros de scrub pré-calculados, em cache",
        "Streaming HTTP Range",
        "PIN + token de sessão",
        <>
          Bonjour <code>_gridstream._tcp</code>
        </>,
      ],
      foot: "Os vídeos ficam nas suas pastas: nada é copiado.",
    },
    ipad: {
      title: "iPad",
      sub: "cliente · SwiftUI",
      items: [
        "Grade, tela cheia, janelas flutuantes",
        "AVPlayer · pool compartilhado de players",
        "PencilKit · anotações normalizadas",
        "MTAudioProcessingTap · normalização, pan",
        "SwiftData · layouts e presets",
        "Descoberta Bonjour · token no Keychain",
      ],
    },
    web: {
      title: "Web",
      sub: "navegador · Angular 21",
      items: [
        "Componentes standalone, signals, Tailwind",
        "Sessão por cookie, mesma porta da API",
      ],
    },
    toIpad: ["REST JSON + token", "vídeo: HTTP Range", "quadros de scrub"],
    toWeb: "HTML + API",
    kit: {
      title: "GridStreamKit",
      text: "Pacote Swift compartilhado pelo Mac e pelo iPad: tipos do contrato, fixtures JSON verificados dos dois lados.",
    },
  },
};

const ACCENT = "text-[#eb590d]";

function Node({ node, foot }: { node: NodeCopy; foot?: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-foreground/15 bg-foreground/[0.03] p-4">
      <div className="text-base font-semibold leading-tight text-foreground">
        {node.title}
      </div>
      <div
        className={`mt-0.5 mb-2 font-mono text-[0.7rem] uppercase tracking-wider ${ACCENT}`}
      >
        {node.sub}
      </div>
      <ul className="m-0 list-none p-0 text-sm leading-snug text-foreground/70 [&_code]:rounded [&_code]:bg-foreground/10 [&_code]:px-1 [&_code]:text-[0.85em]">
        {node.items.map((item, index) => (
          <li
            key={index}
            className="border-t border-foreground/10 py-1 first:border-t-0"
          >
            {item}
          </li>
        ))}
      </ul>
      {foot && (
        <div className="mt-3 rounded-lg bg-foreground/[0.06] px-3 py-2 text-xs text-foreground/70">
          {foot}
        </div>
      )}
    </div>
  );
}

// An arrow from the Mac to a client: horizontal on large screens, a downward
// chip when the columns are stacked.
function Links({ labels }: { labels: string[] }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-row flex-wrap justify-center gap-2 lg:flex-col lg:justify-center lg:gap-3"
    >
      {labels.map((label) => (
        <span
          key={label}
          className={`font-mono text-[0.7rem] font-semibold leading-tight ${ACCENT}`}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-2.5 py-1 lg:hidden">
            <span>↓</span>
            {label}
          </span>
          <span className="hidden text-center lg:block">
            {label}
            <svg
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              className="mt-1 block h-2.5 w-full"
            >
              <line
                x1="0"
                y1="5"
                x2="92"
                y2="5"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <path d="M90 0 L100 5 L90 10 Z" fill="currentColor" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

export function GridstreamArchitecture({
  locale,
  caption,
}: {
  locale?: Locale;
  caption?: string;
}) {
  const t = (locale && COPY[locale]) || COPY.fr;
  return (
    <figure className="not-prose mx-auto my-10 w-full max-w-5xl">
      <div role="img" aria-label={t.label}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] lg:gap-4">
          <div className="lg:row-span-2">
            <Node node={t.mac} foot={t.mac.foot} />
          </div>
          <Links labels={t.toIpad} />
          <Node node={t.ipad} />
          <Links labels={[t.toWeb]} />
          <Node node={t.web} />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-[#eb590d]/60 bg-[#eb590d]/[0.06] px-4 py-3 lg:mt-4">
          <span className="text-base font-semibold text-foreground">
            {t.kit.title}
          </span>
          <span className="text-sm text-foreground/70">{t.kit.text}</span>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 px-2 text-center text-sm text-foreground/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default GridstreamArchitecture;

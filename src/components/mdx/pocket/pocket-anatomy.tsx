import clsx from "clsx";
import type { CSSProperties } from "react";
import styles from "./pocket.module.css";
import {
  type Tone,
  type VizLocale,
  VizFigure,
  VizLegend,
  pickCopy,
} from "./frame";

// Uncompressed size of the HTML document served to a desktop browser, in KB,
// split at the first statement of the generated component. `gzip` is a local
// estimate of the transfer size (the server itself uses zstd).
type Gizmo = { base: number; lib3d: number; generated: number; gzip: number };

const GIZMOS: Gizmo[] = [
  { base: 257, lib3d: 682, generated: 68, gzip: 282 },
  { base: 233, lib3d: 0, generated: 19, gzip: 81 },
  { base: 256, lib3d: 0, generated: 96, gzip: 108 },
  { base: 228, lib3d: 0, generated: 66, gzip: 89 },
];

const total = (gizmo: Gizmo) => gizmo.base + gizmo.lib3d + gizmo.generated;
const LARGEST = Math.max(...GIZMOS.map(total));
const TICKS = [0, 250, 500, 750, 1000];

const COPY = {
  fr: {
    eyebrow: "Anatomie",
    title: "Ce que pèse un gizmo, et ce qui y est vraiment généré",
    heroValue: "≈ 7 %",
    heroLabel:
      "du document du jeu 3D est du code généré. Le reste est une boîte à outils que la plateforme ajoute au moment du build.",
    unit: "Ko",
    colon: " : ",
    compressed: "compressé",
    segments: {
      base: "Socle : React, runtime, pont, styles",
      lib3d: "Three.js et ses chargeurs de modèles",
      generated: "Code généré",
    },
    names: [
      "Course sur les rails (3D)",
      "Chats à Paris",
      "Dessin → créatures",
      "Photo → diorama",
    ],
    extras: [
      "+ 3,4 Mo de modèle 3D, d'image et de sons",
      "+ 9,9 Mo d'images et de sons",
      "",
      "+ 1,2 Mo d'images",
    ],
    table: "Voir les chiffres",
    columns: ["Gizmo", "Socle", "3D", "Généré", "Total", "Compressé"],
    caption:
      "Tailles non compressées des documents HTML capturés les 11 et 13 octobre 2026. La frontière du code généré est estimée à partir du bundle minifié ; les valeurs sont arrondies.",
  },
  en: {
    eyebrow: "Anatomy",
    title: "What a gizmo weighs, and how much of it is actually generated",
    heroValue: "≈ 7%",
    heroLabel:
      "of the 3D game's document is generated code. The rest is a toolkit the platform adds at build time.",
    unit: "KB",
    colon: ": ",
    compressed: "compressed",
    segments: {
      base: "Base layer: React, runtime, bridge, styles",
      lib3d: "Three.js and its model loaders",
      generated: "Generated code",
    },
    names: [
      "Rail runner (3D)",
      "Cats in Paris",
      "Drawing → creatures",
      "Photo → diorama",
    ],
    extras: [
      "+ 3.4 MB of 3D model, image and sounds",
      "+ 9.9 MB of images and sounds",
      "",
      "+ 1.2 MB of images",
    ],
    table: "View the numbers",
    columns: ["Gizmo", "Base", "3D", "Generated", "Total", "Compressed"],
    caption:
      "Uncompressed sizes of the HTML documents captured on October 11 and 13, 2026. The boundary of the generated code is estimated from the minified bundle; values are rounded.",
  },
  pt: {
    eyebrow: "Anatomia",
    title: "Quanto pesa um gizmo, e o que nele é realmente gerado",
    heroValue: "≈ 7%",
    heroLabel:
      "do documento do jogo 3D é código gerado. O resto é um kit de ferramentas que a plataforma acrescenta no momento do build.",
    unit: "KB",
    colon: ": ",
    compressed: "comprimido",
    segments: {
      base: "Base: React, runtime, ponte, estilos",
      lib3d: "Three.js e seus loaders de modelos",
      generated: "Código gerado",
    },
    names: [
      "Corrida nos trilhos (3D)",
      "Gatos em Paris",
      "Desenho → criaturas",
      "Foto → diorama",
    ],
    extras: [
      "+ 3,4 MB de modelo 3D, imagem e sons",
      "+ 9,9 MB de imagens e sons",
      "",
      "+ 1,2 MB de imagens",
    ],
    table: "Ver os números",
    columns: ["Gizmo", "Base", "3D", "Gerado", "Total", "Comprimido"],
    caption:
      "Tamanhos não comprimidos dos documentos HTML capturados em 11 e 13 de outubro de 2026. A fronteira do código gerado é estimada a partir do bundle minificado; os valores são arredondados.",
  },
  es: {
    eyebrow: "Anatomía",
    title: "Lo que pesa un gizmo y lo que de verdad se genera en él",
    heroValue: "≈ 7 %",
    heroLabel:
      "del documento del juego 3D es código generado. El resto es una caja de herramientas que la plataforma añade en el momento del build.",
    unit: "KB",
    colon: ": ",
    compressed: "comprimido",
    segments: {
      base: "Base: React, runtime, puente, estilos",
      lib3d: "Three.js y sus cargadores de modelos",
      generated: "Código generado",
    },
    names: [
      "Carrera por las vías (3D)",
      "Gatos en París",
      "Dibujo → criaturas",
      "Foto → diorama",
    ],
    extras: [
      "+ 3,4 MB de modelo 3D, imagen y sonidos",
      "+ 9,9 MB de imágenes y sonidos",
      "",
      "+ 1,2 MB de imágenes",
    ],
    table: "Ver las cifras",
    columns: ["Gizmo", "Base", "3D", "Generado", "Total", "Comprimido"],
    caption:
      "Tamaños sin comprimir de los documentos HTML capturados el 11 y el 13 de octubre de 2026. La frontera del código generado se estima a partir del bundle minificado; los valores están redondeados.",
  },
};

const SEGMENTS: { key: keyof Omit<Gizmo, "gzip">; tone: Tone }[] = [
  { key: "base", tone: "platform" },
  { key: "lib3d", tone: "runtime" },
  { key: "generated", tone: "create" },
];

const NUMBER_LOCALES: Record<VizLocale, string> = {
  fr: "fr-FR",
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
};

export function PocketAnatomy({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  // "always" keeps the separator on four-digit numbers, which es-ES drops.
  const format = (value: number) =>
    value.toLocaleString(NUMBER_LOCALES[locale ?? "fr"], { useGrouping: "always" });
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.hero}>
        <div className={styles.waffle} aria-hidden="true">
          {Array.from({ length: 40 }, (_, cell) => (
            <i key={cell} />
          ))}
        </div>
        <div>
          <div className={styles.heroValue}>
            <span className={styles.hl}>{t.heroValue}</span>
          </div>
          <div className={styles.heroLabel}>{t.heroLabel}</div>
        </div>
      </div>
      <VizLegend
        items={SEGMENTS.map((segment) => ({
          label: t.segments[segment.key],
          tone: segment.tone,
        }))}
      />
      <div className={styles.chart}>
        <div className={styles.bars}>
          <div className={styles.axis} aria-hidden="true">
            {TICKS.map((tick) => (
              <span
                key={tick}
                data-tick={`${format(tick)} ${t.unit}`}
                style={{ "--at": `${(tick / LARGEST) * 100}%` } as CSSProperties}
              />
            ))}
          </div>
          {GIZMOS.map((gizmo, index) => (
            <div key={t.names[index]} className={styles.bar}>
              <div className={styles.barName}>{t.names[index]}</div>
              <div className={styles.barMeta}>
                ≈ {format(gizmo.gzip)} {t.unit} {t.compressed}
                {t.extras[index] && ` · ${t.extras[index]}`}
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barStack}
                  style={{ "--share": total(gizmo) / LARGEST } as CSSProperties}
                >
                  {SEGMENTS.filter((segment) => gizmo[segment.key] > 0).map((segment) => (
                    <span
                      key={segment.key}
                      tabIndex={0}
                      className={clsx(styles.barSeg, styles[segment.tone])}
                      style={{ "--v": gizmo[segment.key] } as CSSProperties}
                      data-tip={`${t.segments[segment.key]}${t.colon}≈ ${format(gizmo[segment.key])} ${t.unit}`}
                    />
                  ))}
                </div>
                <span className={styles.barValue}>
                  {format(total(gizmo))} {t.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <details className={styles.dataTable}>
        <summary>{t.table}</summary>
        <table>
          <thead>
            <tr>
              {t.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GIZMOS.map((gizmo, index) => (
              <tr key={t.names[index]}>
                <td>{t.names[index]}</td>
                <td>{format(gizmo.base)}</td>
                <td>{gizmo.lib3d ? format(gizmo.lib3d) : "—"}</td>
                <td>{format(gizmo.generated)}</td>
                <td>{format(total(gizmo))}</td>
                <td>{format(gizmo.gzip)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </VizFigure>
  );
}

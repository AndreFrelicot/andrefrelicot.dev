import clsx from "clsx";
import { Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import styles from "./pocket.module.css";

// The figures set their own text face, a quiet grotesque close to the one
// used in the site's hand-made diagrams.
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-pocket-sans",
  display: "swap",
});

// Infographic copy lives next to each figure, keyed by locale, so a translated
// article only has to pass `locale`. French is the source and the fallback.
export type VizLocale = "fr" | "en" | "pt" | "es";

export function pickCopy<T>(
  copy: Partial<Record<VizLocale, T>> & { fr: T },
  locale: VizLocale | undefined,
): T {
  return (locale && copy[locale]) || copy.fr;
}

export type Tone = "platform" | "create" | "runtime" | "neutral";

type VizFigureProps = {
  eyebrow: string;
  title: string;
  caption?: ReactNode;
  children: ReactNode;
};

// The plate every figure is printed on. Figures are numbered by a CSS counter,
// in the order they appear in the article.
export function VizFigure({ eyebrow, title, caption, children }: VizFigureProps) {
  return (
    <figure className={clsx("not-prose", styles.viz, sans.variable)}>
      <div className={styles.head}>
        <span className={styles.figNo}>Fig.</span>
        <span>{eyebrow}</span>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{children}</div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

type LegendEntry = { label: string; tone?: Tone; line?: "solid" | "dashed" };

export function VizLegend({ items }: { items: LegendEntry[] }) {
  return (
    <div className={styles.legend}>
      {items.map((item) => (
        <span key={item.label} className={styles.legendItem}>
          {item.line ? (
            <span
              className={clsx(
                styles.swatchLine,
                item.line === "dashed" && styles.swatchDashed,
              )}
            />
          ) : (
            <span className={clsx(styles.swatch, styles[item.tone ?? "neutral"])} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}

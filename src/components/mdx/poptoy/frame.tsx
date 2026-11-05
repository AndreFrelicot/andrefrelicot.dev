import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "./cx";
import styles from "./viz.module.css";

// The shared language of the poptoy figures, the one of the devlog diagrams: a
// sheet that follows the theme, a light title over a short dash, one-pixel rules,
// lucide line icons without a disc, mono for anything technical, and a rationed
// colour that always means the same thing:
//
// - cloud (teal): the platform, Google Cloud, the infrastructure;
// - creator (amber): the creator, their idea, and the generated code they get;
// - ai (soft violet): the models and the forge;
// - hostile (red): what is refused, blocked, risky;
// - cost (green): money, caps, measurements;
// - neutral (slate): everything else.
//
// Animations only run while the figure is on screen, and never with
// `prefers-reduced-motion`.

export type Tone = "creator" | "ai" | "cloud" | "hostile" | "cost" | "neutral";

export const toneClass = (tone: Tone): string => styles[tone] ?? "";

export { VizFigure } from "./viz-figure";

// Infographic copy lives next to each figure, keyed by locale, so a translated
// article only has to pass `locale`. French is the source and the fallback.
export type VizLocale = "fr" | "en" | "pt" | "es";

export function pickCopy<T>(
  copy: Partial<Record<VizLocale, T>> & { fr: T },
  locale: VizLocale | undefined,
): T {
  return (locale && copy[locale]) || copy.fr;
}

export function VizLegend({ items }: { items: { label: string; tone: Tone; dashed?: boolean }[] }) {
  return (
    <div className={styles.legend}>
      {items.map((item) => (
        <span key={item.label} className={styles.legendItem}>
          <span
            className={cx(styles.swatch, toneClass(item.tone), item.dashed && styles.swatchDashed)}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** An icon in a tinted disc. */
export function Badge({
  icon: Icon,
  tone,
  size = 30,
}: {
  icon: LucideIcon;
  tone: Tone;
  size?: number;
}) {
  return (
    <span
      className={cx(styles.badge, toneClass(tone))}
      style={{ "--size": `${String(size)}px` } as CSSProperties}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.62)} strokeWidth={1.35} />
    </span>
  );
}

/** A card: a disc, a title, a text. */
export function Card({
  icon,
  tone,
  title,
  children,
  dashed = false,
  style,
}: {
  icon?: LucideIcon;
  tone: Tone;
  title: ReactNode;
  children?: ReactNode;
  dashed?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={cx(styles.card, toneClass(tone), dashed && styles.dashed)} style={style}>
      <div className={styles.cardHead}>
        {icon && <Badge icon={icon} tone={tone} size={26} />}
        <span className={styles.cardTitle}>{title}</span>
      </div>
      {children && <div className={styles.cardBody}>{children}</div>}
    </div>
  );
}

/** A mono tag, for a service name, a file, a code. */
export function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx(styles.tag, toneClass(tone))}>{children}</span>;
}

/** A key figure. */
export function Stat({ value, label, tone }: { value: ReactNode; label: ReactNode; tone: Tone }) {
  return (
    <div className={cx(styles.stat, toneClass(tone))}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

/** A column grid that drops to one column on a phone. */
export function Grid({
  cols,
  gap = 14,
  children,
}: {
  cols: number;
  gap?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.grid}
      style={{ "--cols": cols, "--gap": `${String(gap)}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

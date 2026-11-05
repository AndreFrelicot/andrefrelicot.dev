import { cx } from "./cx";
import { Stat, type VizLocale, VizFigure, VizLegend, pickCopy } from "./frame";
import styles from "./ai.module.css";

// The second demo batch, under generation profile v6 (2026-10-18): the size the
// plan estimated (estimated_lines) and the lines actually written, read at the
// start of the last build. Data from the online generation events.

// One row per gizmo; its title is in COPY.titles, in the same order.
const ROWS: { est: number; written: number; note?: boolean }[] = [
  { est: 230, written: 580 },
  { est: 280, written: 376, note: true },
  { est: 220, written: 501 },
  { est: 280, written: 340, note: true },
  { est: 230, written: 526 },
  { est: 280, written: 642, note: true },
  { est: 230, written: 376 },
  { est: 280, written: 541 },
  { est: 260, written: 491 },
  { est: 280, written: 712, note: true },
];

const MAX = 800;
const TICKS = [0, 200, 400, 600, 800];
const pct = (n: number) => `${String((n / MAX) * 100)}%`;

const COPY = {
  fr: {
    eyebrow: "Dix gizmos de démo",
    title: "Le plan estime 250 lignes. L'écriture en écrit le double",
    caption:
      "Lignes estimées par le plan et lignes écrites, au début du dernier build. Mot Mystère a demandé une correction (342 lignes au premier build, 340 au second). Les quatre gizmos marqués ◆ ont reçu une note de portée : le plan a jugé la demande trop large et l'a réduite. Les six autres tenaient telles quelles. Tous sont complets et jouables.",
    stats: [
      ["≈ 257", "lignes estimées en moyenne"],
      ["≈ 509", "lignes écrites en moyenne"],
      ["7 sur 10", "au-dessus du plafond de 400"],
      ["10 sur 10", "réussis, 11 builds, 0,61 €"],
    ],
    legend: ["estimé par le plan", "écrit, sous le plafond", "écrit, au-dessus du plafond"],
    target: "cible ≈ 250",
    cap: "plafond 400",
    titles: [
      "Serpent Cathodique 1984",
      "Explorateur Solaire",
      "Kaléidoscope Magique",
      "Mot Mystère",
      "Vélo Rush",
      "Tourne la Bouteille !",
      "Balles Rebondissantes",
      "Styliste Express",
      "Dino Dash",
      "Ma Carte du Monde à Gratter",
    ],
  },
  en: {
    eyebrow: "Ten demo gizmos",
    title: "The plan estimates 250 lines. The writing step produces twice that",
    caption:
      "Lines estimated by the plan and lines written, at the start of the last build. Mystery Word needed a fix (342 lines at the first build, 340 at the second). The four gizmos marked ◆ got a scope note: the plan judged the request too broad and narrowed it. The other six fit as they were. All of them are complete and playable.",
    stats: [
      ["≈ 257", "lines estimated on average"],
      ["≈ 509", "lines written on average"],
      ["7 of 10", "over the 400-line cap"],
      ["10 of 10", "succeeded, 11 builds, €0.61"],
    ],
    legend: ["estimated by the plan", "written, under the cap", "written, over the cap"],
    target: "target ≈ 250",
    cap: "cap 400",
    titles: [
      "Cathode Snake 1984",
      "Solar Explorer",
      "Magic Kaleidoscope",
      "Mystery Word",
      "Bike Rush",
      "Spin the Bottle!",
      "Bouncing Balls",
      "Express Stylist",
      "Dino Dash",
      "My Scratch-Off World Map",
    ],
  },
  es: {
    eyebrow: "Diez gizmos de demo",
    title: "El plan estima 250 líneas. La escritura produce el doble",
    caption:
      "Líneas estimadas por el plan y líneas escritas, al inicio del último build. Palabra misteriosa necesitó una corrección (342 líneas en el primer build, 340 en el segundo). Los cuatro gizmos marcados con ◆ recibieron una nota de alcance: el plan consideró la petición demasiado amplia y la redujo. Los otros seis cabían tal cual. Todos están completos y se pueden jugar.",
    stats: [
      ["≈ 257", "líneas estimadas de media"],
      ["≈ 509", "líneas escritas de media"],
      ["7 de 10", "por encima del tope de 400"],
      ["10 de 10", "con éxito, 11 builds, 0,61\u00a0€"],
    ],
    legend: ["estimado por el plan", "escrito, bajo el tope", "escrito, por encima del tope"],
    target: "objetivo ≈ 250",
    cap: "tope 400",
    titles: [
      "Serpiente catódica 1984",
      "Explorador solar",
      "Caleidoscopio mágico",
      "Palabra misteriosa",
      "Bici Rush",
      "¡Gira la botella!",
      "Pelotas saltarinas",
      "Estilista exprés",
      "Dino Dash",
      "Mi mapamundi para rascar",
    ],
  },
  pt: {
    eyebrow: "Dez gizmos de demo",
    title: "O plano estima 250 linhas. A escrita produz o dobro",
    caption:
      "Linhas estimadas pelo plano e linhas escritas, no início do último build. Palavra misteriosa precisou de uma correção (342 linhas no primeiro build, 340 no segundo). Os quatro gizmos marcados com ◆ receberam uma nota de escopo: o plano julgou o pedido amplo demais e o reduziu. Os outros seis cabiam como estavam. Todos estão completos e jogáveis.",
    stats: [
      ["≈ 257", "linhas estimadas em média"],
      ["≈ 509", "linhas escritas em média"],
      ["7 de 10", "acima do teto de 400"],
      ["10 de 10", "com sucesso, 11 builds, €\u00a00,61"],
    ],
    legend: ["estimado pelo plano", "escrito, abaixo do teto", "escrito, acima do teto"],
    target: "meta ≈ 250",
    cap: "teto 400",
    titles: [
      "Cobra catódica 1984",
      "Explorador solar",
      "Caleidoscópio mágico",
      "Palavra misteriosa",
      "Bike Rush",
      "Gire a garrafa!",
      "Bolinhas saltitantes",
      "Estilista express",
      "Dino Dash",
      "Meu mapa-múndi de raspar",
    ],
  },
};

const STAT_TONES = ["ai", "hostile", "hostile", "cost"] as const;

export function ScopeChart({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.scopeStats}>
        {t.stats.map(([value, label], i) => (
          <Stat key={label} value={value} label={label} tone={STAT_TONES[i]} />
        ))}
      </div>
      <VizLegend
        items={[
          { label: t.legend[0], tone: "ai" },
          { label: t.legend[1], tone: "cost" },
          { label: t.legend[2], tone: "hostile" },
        ]}
      />
      <div className={styles.scope}>
        <div className={styles.scopeGuides} aria-hidden="true">
          <span className={styles.scopeGuide} style={{ left: pct(250) }}>
            <em>{t.target}</em>
          </span>
          <span className={cx(styles.scopeGuide, styles.scopeGuideCap)} style={{ left: pct(400) }}>
            <em>{t.cap}</em>
          </span>
          {TICKS.map((tick) => (
            <span key={tick} className={styles.scopeGrid} style={{ left: pct(tick) }} />
          ))}
        </div>
        {ROWS.map((r, i) => (
          <div key={t.titles[i]} className={styles.scopeRow}>
            <div className={styles.scopeHead}>
              <span className={styles.scopeTitle}>
                {t.titles[i]}
                {r.note && <span className={styles.scopeNote}> ◆</span>}
              </span>
              <code className={styles.scopeVal}>
                {r.est} → {r.written}
              </code>
            </div>
            <span
              className={cx(styles.scopeBar, styles.scopeEst)}
              style={{ width: pct(r.est), animationDelay: `${String(i * 60)}ms` }}
            />
            <span
              className={cx(styles.scopeBar, r.written > 400 ? styles.scopeOver : styles.scopeOk)}
              style={{ width: pct(r.written), animationDelay: `${String(300 + i * 60)}ms` }}
            />
          </div>
        ))}
        <div className={styles.scopeAxis} aria-hidden="true">
          {TICKS.map((tick) => (
            <span key={tick} style={{ left: pct(tick) }}>
              {tick}
            </span>
          ))}
        </div>
      </div>
    </VizFigure>
  );
}

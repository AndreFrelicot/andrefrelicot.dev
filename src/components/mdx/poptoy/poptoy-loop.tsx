import {
  Hammer,
  Lightbulb,
  Repeat2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "./cx";
import { type Tone, type VizLocale, VizFigure, VizLegend, pickCopy, toneClass } from "./frame";
import plate from "./plate.module.css";
import styles from "./poptoy-loop.module.css";

// Layout of each station; its text lives in COPY, in the same order.
const STATIONS: { service: string; tone: Tone; icon: LucideIcon }[] = [
  { service: "api", tone: "creator", icon: Lightbulb },
  { service: "forge", tone: "ai", icon: Sparkles },
  { service: "builder", tone: "hostile", icon: Hammer },
  { service: "moderation", tone: "neutral", icon: ShieldCheck },
  { service: "gizmo_edge", tone: "cloud", icon: Smartphone },
  { service: "forge", tone: "ai", icon: Repeat2 },
];

const COPY = {
  fr: {
    eyebrow: "Le produit",
    title: "poptoy : de la phrase au feed, puis au remix",
    caption:
      "Six étapes, cinq services. La boucle se referme quand un gizmo publié redevient la matière d'un autre : le remix renvoie à la forge, avec les sources de l'original.",
    legend: ["Le créateur", "Un modèle", "Code non fiable", "Plateforme"],
    stations: [
      {
        name: "Idée",
        desc: "Une phrase, éventuellement une photo, tapée dans l'app ou le studio web.",
      },
      { name: "Forge", desc: "Un graphe ADK planifie, puis un modèle écrit un composant React." },
      { name: "Build", desc: "Bundle, puis test dans un Chromium headless, sans réseau." },
      {
        name: "Modération",
        desc: "Règles et analyse du code : elle décide du niveau de diffusion.",
      },
      { name: "Feed", desc: "Un feed vertical classé, des likes, des commentaires." },
      { name: "Remix", desc: "Un autre créateur repart des sources, pas du bundle." },
    ],
    back: "remix : retour à la forge, avec les sources de l'original",
  },
  en: {
    eyebrow: "The product",
    title: "poptoy: from a sentence to the feed, then to a remix",
    caption:
      "Six steps, five services. The loop closes when a published gizmo becomes someone else's raw material: the remix goes back to the forge, with the original's source code.",
    legend: ["The creator", "A model", "Untrusted code", "Platform"],
    stations: [
      { name: "Idea", desc: "A sentence, with or without a photo, typed in the app or the web studio." },
      { name: "Forge", desc: "An ADK graph plans, then a model writes a React component." },
      { name: "Build", desc: "Bundled, then tested in headless Chromium, with no network." },
      {
        name: "Moderation",
        desc: "Rules and code analysis: it decides how widely the gizmo is shown.",
      },
      { name: "Feed", desc: "A ranked vertical feed, likes, comments." },
      { name: "Remix", desc: "Another creator starts from the source code, not the bundle." },
    ],
    back: "remix: back to the forge, with the original's source code",
  },
  es: {
    eyebrow: "El producto",
    title: "poptoy: de la frase al feed, y luego al remix",
    caption:
      "Seis pasos, cinco servicios. El bucle se cierra cuando un gizmo publicado vuelve a ser materia prima para otro: el remix regresa a la forja, con el código fuente del original.",
    legend: ["El creador", "Un modelo", "Código no fiable", "Plataforma"],
    stations: [
      {
        name: "Idea",
        desc: "Una frase, con o sin foto, escrita en la app o en el estudio web.",
      },
      {
        name: "Forja",
        desc: "Un grafo ADK planifica y luego un modelo escribe un componente React.",
      },
      { name: "Build", desc: "Bundle y prueba en un Chromium headless, sin red." },
      {
        name: "Moderación",
        desc: "Reglas y análisis del código: decide el nivel de difusión.",
      },
      { name: "Feed", desc: "Un feed vertical con ranking, likes y comentarios." },
      { name: "Remix", desc: "Otro creador parte del código fuente, no del bundle." },
    ],
    back: "remix: vuelta a la forja, con el código fuente del original",
  },
  pt: {
    eyebrow: "O produto",
    title: "poptoy: da frase ao feed, e depois ao remix",
    caption:
      "Seis etapas, cinco serviços. O ciclo se fecha quando um gizmo publicado vira matéria-prima para outro: o remix volta para a forja, com o código-fonte do original.",
    legend: ["O criador", "Um modelo", "Código não confiável", "Plataforma"],
    stations: [
      {
        name: "Ideia",
        desc: "Uma frase, com ou sem foto, digitada no app ou no estúdio web.",
      },
      {
        name: "Forja",
        desc: "Um grafo ADK planeja, depois um modelo escreve um componente React.",
      },
      { name: "Build", desc: "Bundle, depois teste em um Chromium headless, sem rede." },
      {
        name: "Moderação",
        desc: "Regras e análise do código: ela decide o nível de distribuição.",
      },
      { name: "Feed", desc: "Um feed vertical ranqueado, curtidas, comentários." },
      { name: "Remix", desc: "Outro criador parte do código-fonte, não do bundle." },
    ],
    back: "remix: volta para a forja, com o código-fonte do original",
  },
};

export function PoptoyLoop({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <VizLegend
        items={[
          { label: t.legend[0], tone: "creator" },
          { label: t.legend[1], tone: "ai" },
          { label: t.legend[2], tone: "hostile" },
          { label: t.legend[3], tone: "cloud" },
        ]}
      />
      <div className={styles.loop} style={{ "--n": STATIONS.length } as CSSProperties}>
        <div className={styles.rail} aria-hidden="true">
          <span className={styles.marker} />
        </div>
        <ol className={styles.stations}>
          {STATIONS.map((s, i) => {
            const Icon = s.icon;
            const { name, desc } = t.stations[i];
            return (
              <li
                key={name}
                className={cx(styles.station, plate.block, toneClass(s.tone))}
                style={{ "--i": i } as CSSProperties}
              >
                <span className={styles.head}>
                  <span className={styles.no}>{i + 1}</span>
                  <span className={styles.dot} aria-hidden="true" />
                </span>
                <Icon className={plate.icon} size={20} strokeWidth={1.35} aria-hidden="true" />
                <div className={cx(plate.name, styles.name)}>{name}</div>
                <span className={plate.sig}>{s.service}</span>
                <p className={plate.desc}>{desc}</p>
              </li>
            );
          })}
        </ol>
        <div className={styles.back} aria-hidden="true">
          <span>{t.back}</span>
        </div>
      </div>
    </VizFigure>
  );
}

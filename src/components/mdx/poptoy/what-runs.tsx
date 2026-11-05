import {
  CircleCheck,
  CircleDashed,
  CircleOff,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "./cx";
import {
  type Tone,
  type VizLocale,
  VizFigure,
  pickCopy,
  toneClass,
} from "./frame";
import plate from "./plate.module.css";
import styles from "./what-runs.module.css";

// What runs, what sleeps, what is missing. Layout of each column; its text is in
// COPY.columns, in the same order.
const COLUMNS: { tone: Tone; icon: LucideIcon; dashed?: boolean }[] = [
  { tone: "cloud", icon: CircleCheck },
  { tone: "neutral", icon: CircleDashed, dashed: true },
  { tone: "hostile", icon: CircleOff },
];

const COPY = {
  fr: {
    eyebrow: "Le bilan",
    title: "Ce qui tourne, ce qui dort, ce qui manque",
    caption:
      "La colonne du milieu est la plus instructive : tout y est écrit et testé, mais une fonction n'existe pour l'utilisateur que si un profil, un interrupteur et un budget s'alignent.",
    columns: [
      {
        title: "En ligne, vérifié",
        sub: "en prototype privé, à l'arrêt au repos",
        items: [
          "Huit services sur Cloud Run, derrière Cloudflare et IAP",
          "La forge sur Gemini, rejouable sur cassettes",
          "Le builder dans une sandbox Cloud Run : ni réseau, ni métadonnées",
          "Le feed, le social, le remix ; l'app Flutter contre les API en ligne",
          "La modération, publiée par défaut, et sa console",
          "La console d'admin : coûts, profils, prompts modifiables",
          "Soixante gizmos de démo, écrits par la vraie forge",
        ],
      },
      {
        title: "Codé, testé, éteint",
        sub: "il manque un réglage ou une dépense",
        items: [
          "La photo jointe et les sons : le profil actif ne connaît pas les assets",
          "L'IA en cours de partie : la passerelle répond avec un fournisseur factice",
          "Les images générées : deux interrupteurs coupés",
          "Le classifieur de modération : un interrupteur coupé",
        ],
      },
      {
        title: "Pas fait",
        sub: "noté, chiffré, laissé pour plus tard",
        items: [
          "Model Armor devant les appels d'IA",
          "Le rattrapage d'un pointeur raté après une décision de modération",
          "La Public Suffix List, avant toute ouverture publique",
          "TestFlight, Google Play, une première vague d'invitations",
          "Un test d'intrusion par un tiers",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Taking stock",
    title: "What runs, what sleeps, what is missing",
    caption:
      "The middle column is the most telling: everything in it is written and tested, but a feature only exists for the user when a profile, a switch and a budget line up.",
    columns: [
      {
        title: "Online, verified",
        sub: "as a private prototype, stopped at rest",
        items: [
          "Eight services on Cloud Run, behind Cloudflare and IAP",
          "The forge on Gemini, replayable from cassettes",
          "The builder in a Cloud Run sandbox: no network, no metadata",
          "The feed, the social layer, remix; the Flutter app against the live APIs",
          "Moderation, publishing by default, and its console",
          "The admin console: costs, profiles, editable prompts",
          "Sixty demo gizmos, written by the real forge",
        ],
      },
      {
        title: "Coded, tested, switched off",
        sub: "waiting on a setting or a spend",
        items: [
          "The attached photo and sounds: the active profile does not know about assets",
          "In-game AI: the gateway answers with a fake provider",
          "Generated images: two switches off",
          "The moderation classifier: one switch off",
        ],
      },
      {
        title: "Not done",
        sub: "noted, costed, left for later",
        items: [
          "Model Armor in front of AI calls",
          "Catching up a failed pointer after a moderation decision",
          "The Public Suffix List, before any public launch",
          "TestFlight, Google Play, a first wave of invitations",
          "A third-party penetration test",
        ],
      },
    ],
  },
  es: {
    eyebrow: "El balance",
    title: "Lo que funciona, lo que duerme, lo que falta",
    caption:
      "La columna del medio es la más instructiva: todo está escrito y probado, pero una función solo existe para el usuario si un perfil, un interruptor y un presupuesto se alinean.",
    columns: [
      {
        title: "En línea, verificado",
        sub: "como prototipo privado, detenido en reposo",
        items: [
          "Ocho servicios en Cloud Run, tras Cloudflare e IAP",
          "La forja sobre Gemini, reproducible con casetes",
          "El builder en una sandbox de Cloud Run: sin red ni metadatos",
          "El feed, lo social, el remix; la app Flutter contra las API en línea",
          "La moderación, con publicación por defecto, y su consola",
          "La consola de administración: costes, perfiles, prompts editables",
          "Sesenta gizmos de demo, escritos por la forja real",
        ],
      },
      {
        title: "Programado, probado, apagado",
        sub: "falta una configuración o un gasto",
        items: [
          "La foto adjunta y los sonidos: el perfil activo no conoce los assets",
          "La IA durante la partida: la pasarela responde con un proveedor ficticio",
          "Las imágenes generadas: dos interruptores apagados",
          "El clasificador de moderación: un interruptor apagado",
        ],
      },
      {
        title: "Sin hacer",
        sub: "anotado, presupuestado, para más adelante",
        items: [
          "Model Armor delante de las llamadas de IA",
          "La recuperación de un puntero fallido tras una decisión de moderación",
          "La Public Suffix List, antes de cualquier apertura al público",
          "TestFlight, Google Play, una primera ola de invitaciones",
          "Una prueba de intrusión por parte de un tercero",
        ],
      },
    ],
  },
  pt: {
    eyebrow: "O balanço",
    title: "O que roda, o que dorme, o que falta",
    caption:
      "A coluna do meio é a mais instrutiva: tudo ali está escrito e testado, mas uma função só existe para o usuário se um perfil, um interruptor e um orçamento se alinharem.",
    columns: [
      {
        title: "No ar, verificado",
        sub: "como protótipo privado, parado em repouso",
        items: [
          "Oito serviços no Cloud Run, atrás da Cloudflare e do IAP",
          "A forja no Gemini, reproduzível a partir de cassetes",
          "O builder em uma sandbox do Cloud Run: sem rede, sem metadados",
          "O feed, o social, o remix; o app Flutter contra as APIs online",
          "A moderação, com publicação por padrão, e seu console",
          "O console de administração: custos, perfis, prompts editáveis",
          "Sessenta gizmos de demo, escritos pela forja de verdade",
        ],
      },
      {
        title: "Codificado, testado, desligado",
        sub: "falta uma configuração ou um gasto",
        items: [
          "A foto anexada e os sons: o perfil ativo não conhece os assets",
          "A IA durante a partida: o gateway responde com um provedor fictício",
          "As imagens geradas: dois interruptores desligados",
          "O classificador de moderação: um interruptor desligado",
        ],
      },
      {
        title: "Não feito",
        sub: "anotado, orçado, deixado para depois",
        items: [
          "Model Armor na frente das chamadas de IA",
          "A recuperação de um ponteiro que falhou após uma decisão de moderação",
          "A Public Suffix List, antes de qualquer abertura ao público",
          "TestFlight, Google Play, uma primeira leva de convites",
          "Um teste de intrusão feito por terceiros",
        ],
      },
    ],
  },
};

export function WhatRuns({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.cols}>
        {COLUMNS.map((c, i) => {
          const Icon = c.icon;
          const { title, sub, items } = t.columns[i];
          return (
            <section
              key={title}
              className={cx(plate.block, styles.col, toneClass(c.tone))}
              style={{ "--i": i } as CSSProperties}
            >
              <header className={styles.head}>
                <Icon
                  className={plate.icon}
                  size={20}
                  strokeWidth={1.35}
                  aria-hidden="true"
                />
                <span>
                  <span className={plate.name}>{title}</span>
                  <span className={styles.sub}>{sub}</span>
                </span>
              </header>
              <ul className={plate.items}>
                {items.map((it) => (
                  <li key={it} className={plate.item}>
                    <span
                      className={cx(
                        plate.bullet,
                        c.dashed && plate.bulletEmpty,
                      )}
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </VizFigure>
  );
}

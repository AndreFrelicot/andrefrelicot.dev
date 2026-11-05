import {
  Ban,
  CircleCheck,
  Eye,
  FileLock2,
  Hammer,
  ListChecks,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "./cx";
import { type Tone, type VizLocale, VizFigure, VizLegend, pickCopy, toneClass } from "./frame";
import plate from "./plate.module.css";
import styles from "./defense-layers.module.css";

// Icons of the four gates, in the order of COPY.before.
const GATE_ICONS: LucideIcon[] = [ListChecks, Hammer, ScanSearch, Eye];

type Attempt = {
  code: string;
  /** Index of the layer that stops it (0 = the host). */
  stop: number;
  verdict: "blocked" | "detected" | "allowed";
};

// The text of each attempt is in COPY.notes, in the same order.
const ATTEMPTS: Attempt[] = [
  { code: "fetch()", stop: 3, verdict: "blocked" },
  { code: "parent.document", stop: 2, verdict: "blocked" },
  { code: "location.href", stop: 1, verdict: "detected" },
  { code: "RTCPeerConnection", stop: 1, verdict: "detected" },
  { code: "postMessage", stop: 0, verdict: "allowed" },
];

const VERDICT: Record<Attempt["verdict"], { icon: LucideIcon; tone: Tone }> = {
  blocked: { icon: Ban, tone: "hostile" },
  detected: { icon: Eye, tone: "creator" },
  allowed: { icon: CircleCheck, tone: "cloud" },
};

const COPY = {
  fr: {
    eyebrow: "Défense en profondeur",
    title: "Un gizmo est du contenu hostile : quatre filtres avant, quatre couches pendant",
    caption:
      "Chaque colonne est une tentative de sortie, lancée depuis le code généré. Le point monte jusqu'à la couche qui l'arrête. Deux sorties ne se ferment pas dans un navigateur, la navigation et WebRTC : on les détecte, et on s'assure qu'un gizmo n'a jamais rien qui vaille d'être volé.",
    beforeLabel: "Avant la publication",
    duringLabel: "Pendant la partie",
    before: [
      {
        name: "Un cadre fixe",
        desc: "template imposé, sept imports permis : React, Three.js, le runtime",
      },
      { name: "Un build sans réseau", desc: "une sandbox jetable, rien ne s'installe" },
      { name: "Un test d'évasion", desc: "requête, navigation, WebRTC : le build échoue" },
      { name: "La modération", desc: "règles, analyse du code, capacités sensibles" },
    ],
    // From the outside in, down to the generated code (the last row).
    layers: [
      { name: "L'hôte", sub: "studio, page de partage, app" },
      { name: "iframe ou WebView", sub: "navigation filtrée, pas de fenêtre" },
      { name: "Une origine par gizmo", sub: "{id}.poptoyusercontent.app" },
      { name: "La CSP", sub: "default-src 'none', connect-src 'none'" },
      { name: "Le code généré", sub: "hostile par principe" },
    ],
    notes: [
      "refusé par la CSP, signalé en violation",
      "une autre origine : rien à lire",
      "vu au build ; retiré au second chargement",
      "piégé au build, retiré de la WebView",
      "le pont : validé des deux côtés",
    ],
    legend: ["Bloqué", "Détecté, pas empêché", "La seule sortie, contrôlée par l'hôte"],
    footnote:
      "Aucun jeton, aucune clé, aucune donnée de l'hôte n'entre dans un gizmo (invariant 1) : même une sortie ouverte n'emporte que ce que le joueur lui a donné.",
  },
  en: {
    eyebrow: "Defense in depth",
    title: "A gizmo is hostile content: four filters before, four layers during",
    caption:
      "Each column is an escape attempt, launched from the generated code. The dot climbs to the layer that stops it. Two exits cannot be closed in a browser, navigation and WebRTC: we detect them, and we make sure a gizmo never holds anything worth stealing.",
    beforeLabel: "Before publishing",
    duringLabel: "During play",
    before: [
      {
        name: "A fixed frame",
        desc: "imposed template, seven allowed imports: React, Three.js, the runtime",
      },
      { name: "A build with no network", desc: "a throwaway sandbox, nothing gets installed" },
      { name: "An escape test", desc: "request, navigation, WebRTC: the build fails" },
      { name: "Moderation", desc: "rules, code analysis, sensitive capabilities" },
    ],
    layers: [
      { name: "The host", sub: "studio, share page, app" },
      { name: "iframe or WebView", sub: "filtered navigation, no windows" },
      { name: "One origin per gizmo", sub: "{id}.poptoyusercontent.app" },
      { name: "The CSP", sub: "default-src 'none', connect-src 'none'" },
      { name: "The generated code", sub: "hostile by principle" },
    ],
    notes: [
      "refused by the CSP, reported as a violation",
      "another origin: nothing to read",
      "seen at build time; removed on the second load",
      "trapped at build time, removed from the WebView",
      "the bridge: validated on both sides",
    ],
    legend: ["Blocked", "Detected, not prevented", "The only exit, controlled by the host"],
    footnote:
      "No token, no key, no host data ever enters a gizmo (invariant 1): even an open exit carries off only what the player gave it.",
  },
  es: {
    eyebrow: "Defensa en profundidad",
    title: "Un gizmo es contenido hostil: cuatro filtros antes, cuatro capas durante",
    caption:
      "Cada columna es un intento de salida, lanzado desde el código generado. El punto sube hasta la capa que lo detiene. Dos salidas no se pueden cerrar en un navegador, la navegación y WebRTC: las detectamos y nos aseguramos de que un gizmo nunca tenga nada que valga la pena robar.",
    beforeLabel: "Antes de publicar",
    duringLabel: "Durante la partida",
    before: [
      {
        name: "Un marco fijo",
        desc: "plantilla impuesta, siete imports permitidos: React, Three.js, el runtime",
      },
      { name: "Un build sin red", desc: "una sandbox desechable, no se instala nada" },
      { name: "Una prueba de evasión", desc: "petición, navegación, WebRTC: el build falla" },
      { name: "La moderación", desc: "reglas, análisis del código, capacidades sensibles" },
    ],
    layers: [
      { name: "El anfitrión", sub: "estudio, página para compartir, app" },
      { name: "iframe o WebView", sub: "navegación filtrada, sin ventanas" },
      { name: "Un origen por gizmo", sub: "{id}.poptoyusercontent.app" },
      { name: "La CSP", sub: "default-src 'none', connect-src 'none'" },
      { name: "El código generado", sub: "hostil por principio" },
    ],
    notes: [
      "rechazado por la CSP, notificado como infracción",
      "otro origen: nada que leer",
      "visto en el build; retirado en la segunda carga",
      "atrapado en el build, retirado de la WebView",
      "el puente: validado en ambos lados",
    ],
    legend: ["Bloqueado", "Detectado, no impedido", "La única salida, controlada por el anfitrión"],
    footnote:
      "Ningún token, ninguna clave, ningún dato del anfitrión entra en un gizmo (invariante 1): incluso una salida abierta solo se lleva lo que el jugador le dio.",
  },
  pt: {
    eyebrow: "Defesa em profundidade",
    title: "Um gizmo é conteúdo hostil: quatro filtros antes, quatro camadas durante",
    caption:
      "Cada coluna é uma tentativa de saída, disparada a partir do código gerado. O ponto sobe até a camada que a detém. Duas saídas não se fecham em um navegador, a navegação e o WebRTC: nós as detectamos e garantimos que um gizmo nunca tenha nada que valha a pena roubar.",
    beforeLabel: "Antes da publicação",
    duringLabel: "Durante a partida",
    before: [
      {
        name: "Uma moldura fixa",
        desc: "template imposto, sete imports permitidos: React, Three.js, o runtime",
      },
      { name: "Um build sem rede", desc: "uma sandbox descartável, nada é instalado" },
      { name: "Um teste de evasão", desc: "requisição, navegação, WebRTC: o build falha" },
      { name: "A moderação", desc: "regras, análise do código, recursos sensíveis" },
    ],
    layers: [
      { name: "O host", sub: "estúdio, página de compartilhamento, app" },
      { name: "iframe ou WebView", sub: "navegação filtrada, sem janelas" },
      { name: "Uma origem por gizmo", sub: "{id}.poptoyusercontent.app" },
      { name: "A CSP", sub: "default-src 'none', connect-src 'none'" },
      { name: "O código gerado", sub: "hostil por princípio" },
    ],
    notes: [
      "recusado pela CSP, reportado como violação",
      "outra origem: nada para ler",
      "visto no build; removido no segundo carregamento",
      "capturado no build, removido da WebView",
      "a ponte: validada dos dois lados",
    ],
    legend: ["Bloqueado", "Detectado, não impedido", "A única saída, controlada pelo host"],
    footnote:
      "Nenhum token, nenhuma chave, nenhum dado do host entra em um gizmo (invariante 1): mesmo uma saída aberta só leva o que o jogador lhe deu.",
  },
};

export function DefenseLayers({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  const rows = t.layers.length;
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.before}>
        <span className={plate.label}>{t.beforeLabel}</span>
        <ol className={styles.gates}>
          {t.before.map((g, i) => {
            const Icon = GATE_ICONS[i];
            return (
              <li
                key={g.name}
                className={cx(plate.block, toneClass("hostile"))}
                style={{ "--i": i } as CSSProperties}
              >
                <Icon className={plate.icon} size={18} strokeWidth={1.35} aria-hidden="true" />
                <div className={cx(plate.name, styles.gateName)}>{g.name}</div>
                <p className={plate.desc}>{g.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.during}>
        <span className={plate.label}>{t.duringLabel}</span>
        <div
          className={styles.matrix}
          style={{ "--rows": rows, "--cols": ATTEMPTS.length } as CSSProperties}
        >
          <div className={styles.layers}>
            {t.layers.map((l, r) => (
              <div key={l.name} className={cx(styles.layer, r === rows - 1 && styles.core)}>
                <strong>{l.name}</strong>
                <span>{l.sub}</span>
              </div>
            ))}
          </div>
          {ATTEMPTS.map((a, c) => {
            const v = VERDICT[a.verdict];
            const Icon = v.icon;
            return (
              <div
                key={a.code}
                className={cx(styles.col, toneClass(v.tone))}
                style={{ "--stop": rows - 1 - a.stop, "--c": c } as CSSProperties}
              >
                <code className={styles.attempt}>{a.code}</code>
                <div className={styles.lane}>
                  <span className={styles.trail} />
                  <span className={styles.dot} />
                  <span className={styles.hit} style={{ "--row": a.stop } as CSSProperties}>
                    <Icon size={14} strokeWidth={1.5} />
                  </span>
                </div>
                <span className={styles.note}>{t.notes[c]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <VizLegend
        items={[
          { label: t.legend[0], tone: "hostile" },
          { label: t.legend[1], tone: "creator" },
          { label: t.legend[2], tone: "cloud" },
        ]}
      />
      <p className={styles.footnote}>
        <FileLock2 size={14} strokeWidth={1.35} aria-hidden="true" /> {t.footnote}
      </p>
    </VizFigure>
  );
}

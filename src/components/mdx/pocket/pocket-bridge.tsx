import type { CSSProperties } from "react";
import styles from "./pocket.module.css";
import { type VizLocale, VizFigure, VizLegend, pickCopy } from "./frame";

type Message =
  | { phase: string }
  | { from: "gizmo" | "host"; label: string; sub?: string };

const COPY = {
  fr: {
    eyebrow: "Protocole capturé",
    title: "Ce que le gizmo et la page se disent",
    host: "Page hôte",
    gizmo: "Gizmo",
    fromGizmo: "Message du gizmo",
    fromHost: "Message de l'hôte",
    caption:
      "Séquence relevée le 11 octobre 2026 sur la visionneuse web, en écoutant les événements postMessage des deux côtés. Chaque message porte l'enveloppe { __gizmoBridge: 1, kind, requestId } et un identifiant de document.",
    messages: [
      { phase: "au chargement" },
      { from: "gizmo", label: "hello", sub: "document: 54cd0240…" },
      {
        from: "host",
        label: "expose audioControllerSnippet.setVolume",
        sub: "{ volume: 1 }",
      },
      { from: "gizmo", label: "exposeResult", sub: "ok" },
      { phase: "à chaque interaction" },
      { from: "gizmo", label: "call userActivitySnippet.notifyActivity" },
      { from: "host", label: "result", sub: "ok" },
      {
        from: "gizmo",
        label: "call haptics.trigger",
        sub: '{ kind: "impact", style: "light" }',
      },
      { from: "host", label: "result", sub: "ok → navigator.vibrate(10)" },
    ] satisfies Message[],
  },
  en: {
    eyebrow: "Captured protocol",
    title: "What the gizmo and the page say to each other",
    host: "Host page",
    gizmo: "Gizmo",
    fromGizmo: "Message from the gizmo",
    fromHost: "Message from the host",
    caption:
      "Sequence recorded on October 11, 2026, in the web viewer, by listening to postMessage events on both sides. Every message carries the envelope { __gizmoBridge: 1, kind, requestId } and a document identifier.",
    messages: [
      { phase: "on load" },
      { from: "gizmo", label: "hello", sub: "document: 54cd0240…" },
      {
        from: "host",
        label: "expose audioControllerSnippet.setVolume",
        sub: "{ volume: 1 }",
      },
      { from: "gizmo", label: "exposeResult", sub: "ok" },
      { phase: "on every interaction" },
      { from: "gizmo", label: "call userActivitySnippet.notifyActivity" },
      { from: "host", label: "result", sub: "ok" },
      {
        from: "gizmo",
        label: "call haptics.trigger",
        sub: '{ kind: "impact", style: "light" }',
      },
      { from: "host", label: "result", sub: "ok → navigator.vibrate(10)" },
    ] satisfies Message[],
  },
  pt: {
    eyebrow: "Protocolo capturado",
    title: "O que o gizmo e a página dizem um ao outro",
    host: "Página host",
    gizmo: "Gizmo",
    fromGizmo: "Mensagem do gizmo",
    fromHost: "Mensagem do host",
    caption:
      "Sequência registrada em 11 de outubro de 2026 no visualizador web, escutando os eventos postMessage dos dois lados. Cada mensagem traz o envelope { __gizmoBridge: 1, kind, requestId } e um identificador de documento.",
    messages: [
      { phase: "no carregamento" },
      { from: "gizmo", label: "hello", sub: "document: 54cd0240…" },
      {
        from: "host",
        label: "expose audioControllerSnippet.setVolume",
        sub: "{ volume: 1 }",
      },
      { from: "gizmo", label: "exposeResult", sub: "ok" },
      { phase: "a cada interação" },
      { from: "gizmo", label: "call userActivitySnippet.notifyActivity" },
      { from: "host", label: "result", sub: "ok" },
      {
        from: "gizmo",
        label: "call haptics.trigger",
        sub: '{ kind: "impact", style: "light" }',
      },
      { from: "host", label: "result", sub: "ok → navigator.vibrate(10)" },
    ] satisfies Message[],
  },
  es: {
    eyebrow: "Protocolo capturado",
    title: "Lo que se dicen el gizmo y la página",
    host: "Anfitrión",
    gizmo: "Gizmo",
    fromGizmo: "Mensaje del gizmo",
    fromHost: "Mensaje del anfitrión",
    caption:
      "Secuencia registrada el 11 de octubre de 2026 en el visor web, escuchando los eventos postMessage de ambos lados. Cada mensaje lleva el sobre { __gizmoBridge: 1, kind, requestId } y un identificador de documento.",
    messages: [
      { phase: "al cargar" },
      { from: "gizmo", label: "hello", sub: "document: 54cd0240…" },
      {
        from: "host",
        label: "expose audioControllerSnippet.setVolume",
        sub: "{ volume: 1 }",
      },
      { from: "gizmo", label: "exposeResult", sub: "ok" },
      { phase: "en cada interacción" },
      { from: "gizmo", label: "call userActivitySnippet.notifyActivity" },
      { from: "host", label: "result", sub: "ok" },
      {
        from: "gizmo",
        label: "call haptics.trigger",
        sub: '{ kind: "impact", style: "light" }',
      },
      { from: "host", label: "result", sub: "ok → navigator.vibrate(10)" },
    ] satisfies Message[],
  },
};

const WIDTH = 360;
const HOST_X = 56;
const GIZMO_X = 304;
const TOP = 60;
const ROW = 58;
// Advance of one character of the 10.5px monospace label, to size its pill.
const CHAR = 6.35;

export function PocketBridge({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  const height = TOP + t.messages.length * ROW;
  const count = t.messages.filter((message) => "from" in message).length;
  let step = 0;

  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <VizLegend
        items={[
          { label: t.fromGizmo, tone: "create" },
          { label: t.fromHost, tone: "platform" },
        ]}
      />
      <svg
        className={styles.seq}
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={t.title}
        style={{ "--count": count } as CSSProperties}
      >
        {t.messages.map((message, index) =>
          "phase" in message ? (
            <g key={index}>
              <rect
                className={styles.seqBand}
                x={0}
                y={TOP + index * ROW + 8}
                width={WIDTH}
                height={24}
              />
              <text className={styles.seqPhase} x={WIDTH / 2} y={TOP + index * ROW + 24}>
                {message.phase}
              </text>
            </g>
          ) : null,
        )}
        <line className={styles.seqLifeline} x1={HOST_X} y1={40} x2={HOST_X} y2={height} />
        <line className={styles.seqLifeline} x1={GIZMO_X} y1={40} x2={GIZMO_X} y2={height} />
        <g className={styles.platform}>
          <rect className={styles.seqHead} x={HOST_X - 50} y={6} width={100} height={34} />
          <text className={styles.seqHeadText} x={HOST_X} y={28}>
            {t.host}
          </text>
        </g>
        <g className={styles.create}>
          <rect className={styles.seqHead} x={GIZMO_X - 50} y={6} width={100} height={34} />
          <text className={styles.seqHeadText} x={GIZMO_X} y={28}>
            {t.gizmo}
          </text>
        </g>
        {t.messages.map((message, index) => {
          if ("phase" in message) return null;
          const y = TOP + index * ROW;
          const fromGizmo = message.from === "gizmo";
          const x1 = fromGizmo ? GIZMO_X - 6 : HOST_X + 6;
          const x2 = fromGizmo ? HOST_X + 12 : GIZMO_X - 12;
          const tipX = fromGizmo ? HOST_X + 5 : GIZMO_X - 5;
          const tipBack = fromGizmo ? tipX + 7 : tipX - 7;
          const pillWidth = message.label.length * CHAR + 20;
          const vars = { "--i": step++, "--dx": `${x2 - x1}px` } as CSSProperties;
          return (
            <g
              key={index}
              className={fromGizmo ? styles.create : styles.platform}
            >
              <line className={styles.seqArrow} x1={x1} y1={y + 30} x2={x2} y2={y + 30} />
              <polygon
                className={styles.seqTip}
                points={`${tipX},${y + 30} ${tipBack},${y + 27} ${tipBack},${y + 33}`}
              />
              <rect
                className={styles.seqPill}
                x={WIDTH / 2 - pillWidth / 2}
                y={y + 2}
                width={pillWidth}
                height={20}
                style={vars}
              />
              <text className={styles.seqLabel} x={WIDTH / 2} y={y + 15.5}>
                {message.label}
              </text>
              {message.sub && (
                <text className={styles.seqSub} x={WIDTH / 2} y={y + 45}>
                  {message.sub}
                </text>
              )}
              <circle
                className={styles.seqPacket}
                cx={x1}
                cy={y + 30}
                r={3.5}
                style={vars}
              />
            </g>
          );
        })}
      </svg>
    </VizFigure>
  );
}

import type { ReactNode } from "react";
import styles from "./pocket.module.css";
import { Flow, FlowStep } from "./flow";
import { type Tone, type VizLocale, VizFigure, pickCopy } from "./frame";

type Step = { name: string; sig: string; desc: string; tone: Tone };

const COPY = {
  fr: {
    eyebrow: "Étude de cas",
    title: "Un prompt caché dans un gizmo",
    note: "Chaque partie déclenche une génération d'image. Le calcul est payé par la plateforme, pas par le créateur ni par le joueur.",
    caption:
      "Gizmo « Take a photo of where you are! » du compte officiel Pocket, lu le 11 octobre 2026. Sur la visionneuse web il ne fonctionne pas : la caméra y est interdite et le service de génération n'est pas branché.",
    steps: [
      {
        name: "Photo",
        sig: "getUserMedia()",
        desc: "Le gizmo ouvre la caméra arrière et capture la pièce.",
        tone: "create",
      },
      {
        name: "Prompt embarqué",
        sig: "generateImage()",
        desc: "5 595 caractères de consignes, la photo et trois images de référence.",
        tone: "runtime",
      },
      {
        name: "Détourage",
        sig: "canvas 2D",
        desc: "Le fond blanc est retiré dans le navigateur, sans serveur.",
        tone: "create",
      },
      {
        name: "Diorama",
        sig: "isométrique, pixel art",
        desc: "La pièce revient en miniature, posée à côté de la photo d'origine.",
        tone: "create",
      },
    ] satisfies Step[],
  },
  en: {
    eyebrow: "Case study",
    title: "A prompt hidden in a gizmo",
    note: "Every play triggers an image generation. The compute is paid for by the platform, not by the creator or the player.",
    caption:
      "The gizmo “Take a photo of where you are!” from Pocket's official account, read on October 11, 2026. It does not work in the web viewer: the camera is blocked there and the generation service is not wired up.",
    steps: [
      {
        name: "Photo",
        sig: "getUserMedia()",
        desc: "The gizmo opens the rear camera and captures the room.",
        tone: "create",
      },
      {
        name: "Embedded prompt",
        sig: "generateImage()",
        desc: "5,595 characters of instructions, the photo and three reference images.",
        tone: "runtime",
      },
      {
        name: "Background removal",
        sig: "canvas 2D",
        desc: "The white background is removed in the browser, with no server.",
        tone: "create",
      },
      {
        name: "Diorama",
        sig: "isometric, pixel art",
        desc: "The room comes back as a miniature, placed next to the original photo.",
        tone: "create",
      },
    ] satisfies Step[],
  },
  pt: {
    eyebrow: "Estudo de caso",
    title: "Um prompt escondido em um gizmo",
    note: "Cada partida dispara uma geração de imagem. O processamento é pago pela plataforma, não pelo criador nem pelo jogador.",
    caption:
      "Gizmo “Take a photo of where you are!”, da conta oficial do Pocket, lido em 11 de outubro de 2026. No visualizador web ele não funciona: ali a câmera é proibida e o serviço de geração não está conectado.",
    steps: [
      {
        name: "Foto",
        sig: "getUserMedia()",
        desc: "O gizmo abre a câmera traseira e captura o cômodo.",
        tone: "create",
      },
      {
        name: "Prompt embutido",
        sig: "generateImage()",
        desc: "5.595 caracteres de instruções, a foto e três imagens de referência.",
        tone: "runtime",
      },
      {
        name: "Remoção de fundo",
        sig: "canvas 2D",
        desc: "O fundo branco é removido no navegador, sem servidor.",
        tone: "create",
      },
      {
        name: "Diorama",
        sig: "isométrico, pixel art",
        desc: "O cômodo volta em miniatura, colocado ao lado da foto original.",
        tone: "create",
      },
    ] satisfies Step[],
  },
  es: {
    eyebrow: "Caso de estudio",
    title: "Un prompt escondido en un gizmo",
    note: "Cada partida desencadena una generación de imagen. El cómputo lo paga la plataforma, no el creador ni el jugador.",
    caption:
      "Gizmo «Take a photo of where you are!» de la cuenta oficial de Pocket, leído el 11 de octubre de 2026. En el visor web no funciona: allí la cámara está prohibida y el servicio de generación no está conectado.",
    steps: [
      {
        name: "Foto",
        sig: "getUserMedia()",
        desc: "El gizmo abre la cámara trasera y captura la habitación.",
        tone: "create",
      },
      {
        name: "Prompt incrustado",
        sig: "generateImage()",
        desc: "5.595 caracteres de instrucciones, la foto y tres imágenes de referencia.",
        tone: "runtime",
      },
      {
        name: "Recorte",
        sig: "canvas 2D",
        desc: "El fondo blanco se elimina en el navegador, sin servidor.",
        tone: "create",
      },
      {
        name: "Diorama",
        sig: "isométrico, pixel art",
        desc: "La habitación vuelve en miniatura, colocada junto a la foto original.",
        tone: "create",
      },
    ] satisfies Step[],
  },
};

// Small line illustrations, one per step, drawn on a 160 × 90 canvas.
const ILLUSTRATIONS: ReactNode[] = [
  <g key="photo" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="42" y="14" width="76" height="62" rx="6" />
    <path d="M52 62h56M58 62V44h22v18M86 62V36h14v26M52 30l10-8M118 24v8" opacity="0.75" />
    <path d="M36 22v-8h8M124 14h8v8M36 68v8h8M124 76h8v-8" />
  </g>,
  <g key="prompt" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="22" y="12" width="74" height="66" rx="5" />
    <path d="M32 26h54M32 36h44M32 46h50M32 56h36M32 66h46" opacity="0.75" />
    <rect x="106" y="12" width="30" height="18" rx="3" />
    <rect x="106" y="36" width="30" height="18" rx="3" />
    <rect x="106" y="60" width="30" height="18" rx="3" />
  </g>,
  <g key="matte" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="44" y="12" width="72" height="66" rx="5" strokeDasharray="4 6" />
    <path d="M62 60l18-28 18 28z" />
    <path d="M52 22h8M52 68h8M100 22h8M100 68h8" opacity="0.6" />
  </g>,
  <g key="diorama" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M80 12l40 20v28L80 80 40 60V32z" />
    <path d="M40 32l40 20 40-20M80 52v28" />
    <path d="M56 52v-10l12 6v10M92 58l12-6v-10" opacity="0.75" />
  </g>,
];

type PocketPhotoFlowProps = {
  locale?: VizLocale;
  // Optional bitmaps for the first and last steps (a real photo and its result).
  photoSrc?: string;
  resultSrc?: string;
};

export function PocketPhotoFlow({ locale, photoSrc, resultSrc }: PocketPhotoFlowProps) {
  const t = pickCopy(COPY, locale);
  const images = [photoSrc, undefined, undefined, resultSrc];
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <Flow count={t.steps.length}>
        {t.steps.map((step, index) => (
          <FlowStep key={step.name} index={index} tone={step.tone}>
            {images[index] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.illusImage} src={images[index]} alt={step.name} />
            ) : (
              <svg className={styles.illus} viewBox="0 0 160 90" aria-hidden="true">
                {ILLUSTRATIONS[index]}
              </svg>
            )}
            <div className={styles.name}>{step.name}</div>
            <span className={styles.sig}>{step.sig}</span>
            <div className={styles.desc}>{step.desc}</div>
          </FlowStep>
        ))}
      </Flow>
      <div className={styles.callout}>
        <span className={styles.token} />
        <span>{t.note}</span>
      </div>
    </VizFigure>
  );
}

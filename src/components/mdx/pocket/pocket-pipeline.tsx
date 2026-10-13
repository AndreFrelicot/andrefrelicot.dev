import clsx from "clsx";
import styles from "./pocket.module.css";
import { Flow, FlowStep } from "./flow";
import {
  type Tone,
  type VizLocale,
  VizFigure,
  VizLegend,
  pickCopy,
} from "./frame";
import { Icon, type IconName } from "./icons";

type Stage = {
  name: string;
  desc: string;
  tone: Tone;
  icon: IconName;
  inferred?: boolean;
};

const COPY = {
  fr: {
    eyebrow: "Du prompt au feed",
    title: "La chaîne de fabrication d'un gizmo",
    observed: "Observé dans les captures",
    inferred: "Déduit, non confirmé",
    inferredTag: "déduit",
    observedTag: "observé",
    caption:
      "Les étapes en trait plein sont visibles depuis un navigateur. Les étapes en pointillé sont déduites d'indices : un commentaire sourceMappingURL=app.js.map en fin de bundle, et un afficheur de transcriptions d'agent (tool_call, sub_agent, fichiers sandbox://) dans le code de l'application web.",
    stages: [
      {
        name: "Prompt",
        desc: "Du texte, une photo ou un dessin.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Agent",
        desc: "Un modèle outillé écrit un composant React dans un espace de fichiers isolé.",
        tone: "runtime",
        icon: "agent",
        inferred: true,
      },
      {
        name: "Build",
        desc: "Un bundler l'assemble avec React, Tailwind et le runtime.",
        tone: "runtime",
        icon: "build",
        inferred: true,
      },
      {
        name: "Document",
        desc: "Un fichier HTML autonome ; les médias restent sur le CDN.",
        tone: "create",
        icon: "document",
      },
      {
        name: "Bac à sable",
        desc: "Une iframe sur le web, avec un pont vers la page hôte.",
        tone: "platform",
        icon: "shield",
      },
      {
        name: "Feed",
        desc: "Classement, compteurs, attribution des remixes.",
        tone: "platform",
        icon: "feed",
      },
    ] satisfies Stage[],
  },
  en: {
    eyebrow: "From prompt to feed",
    title: "How a gizmo gets made",
    observed: "Observed in the captures",
    inferred: "Inferred, unconfirmed",
    inferredTag: "inferred",
    observedTag: "observed",
    caption:
      "The solid-line steps are visible from a browser. The dashed steps are inferred from clues: a sourceMappingURL=app.js.map comment at the end of the bundle, and an agent transcript viewer (tool_call, sub_agent, sandbox:// files) in the web app's code.",
    stages: [
      {
        name: "Prompt",
        desc: "Text, a photo or a drawing.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Agent",
        desc: "A tool-using model writes a React component in an isolated file workspace.",
        tone: "runtime",
        icon: "agent",
        inferred: true,
      },
      {
        name: "Build",
        desc: "A bundler assembles it with React, Tailwind and the runtime.",
        tone: "runtime",
        icon: "build",
        inferred: true,
      },
      {
        name: "Document",
        desc: "A self-contained HTML file; the media stays on the CDN.",
        tone: "create",
        icon: "document",
      },
      {
        name: "Sandbox",
        desc: "An iframe on the web, with a bridge to the host page.",
        tone: "platform",
        icon: "shield",
      },
      {
        name: "Feed",
        desc: "Ranking, counters, remix attribution.",
        tone: "platform",
        icon: "feed",
      },
    ] satisfies Stage[],
  },
  pt: {
    eyebrow: "Do prompt ao feed",
    title: "A linha de produção de um gizmo",
    observed: "Observado nas capturas",
    inferred: "Deduzido, não confirmado",
    inferredTag: "deduzido",
    observedTag: "observado",
    caption:
      "As etapas em linha contínua são visíveis a partir de um navegador. As etapas tracejadas são deduzidas de indícios: um comentário sourceMappingURL=app.js.map no fim do bundle e um renderizador de transcrições de agente (tool_call, sub_agent, arquivos sandbox://) no código da aplicação web.",
    stages: [
      {
        name: "Prompt",
        desc: "Texto, uma foto ou um desenho.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Agente",
        desc: "Um modelo com ferramentas escreve um componente React em um espaço de arquivos isolado.",
        tone: "runtime",
        icon: "agent",
        inferred: true,
      },
      {
        name: "Build",
        desc: "Um bundler o junta com o React, o Tailwind e o runtime.",
        tone: "runtime",
        icon: "build",
        inferred: true,
      },
      {
        name: "Documento",
        desc: "Um arquivo HTML autocontido; as mídias ficam na CDN.",
        tone: "create",
        icon: "document",
      },
      {
        name: "Sandbox",
        desc: "Um iframe na web, com uma ponte para a página host.",
        tone: "platform",
        icon: "shield",
      },
      {
        name: "Feed",
        desc: "Ranqueamento, contadores, atribuição dos remixes.",
        tone: "platform",
        icon: "feed",
      },
    ] satisfies Stage[],
  },
  es: {
    eyebrow: "Del prompt al feed",
    title: "La cadena de fabricación de un gizmo",
    observed: "Observado en las capturas",
    inferred: "Deducido, sin confirmar",
    inferredTag: "deducido",
    observedTag: "observado",
    caption:
      "Los pasos con línea continua son visibles desde un navegador. Los pasos con línea discontinua se deducen de indicios: un comentario sourceMappingURL=app.js.map al final del bundle y un visor de transcripciones de agente (tool_call, sub_agent, archivos sandbox://) en el código de la aplicación web.",
    stages: [
      {
        name: "Prompt",
        desc: "Texto, una foto o un dibujo.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Agente",
        desc: "Un modelo con herramientas escribe un componente React en un espacio de archivos aislado.",
        tone: "runtime",
        icon: "agent",
        inferred: true,
      },
      {
        name: "Build",
        desc: "Un bundler lo ensambla con React, Tailwind y el runtime.",
        tone: "runtime",
        icon: "build",
        inferred: true,
      },
      {
        name: "Documento",
        desc: "Un archivo HTML autónomo; los archivos multimedia se quedan en la CDN.",
        tone: "create",
        icon: "document",
      },
      {
        name: "Sandbox",
        desc: "Un iframe en la web, con un puente hacia la página anfitriona.",
        tone: "platform",
        icon: "shield",
      },
      {
        name: "Feed",
        desc: "Ranking, contadores, atribución de los remixes.",
        tone: "platform",
        icon: "feed",
      },
    ] satisfies Stage[],
  },
};

export function PocketPipeline({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <VizLegend
        items={[
          { label: t.observed, line: "solid" },
          { label: t.inferred, line: "dashed" },
        ]}
      />
      <Flow count={t.stages.length}>
        {t.stages.map((stage, index) => (
          <FlowStep
            key={stage.name}
            index={index}
            tone={stage.tone}
            inferred={stage.inferred}
          >
            <span className={clsx(styles.icon, styles.stepIcon)}>
              <Icon name={stage.icon} />
            </span>
            <div className={styles.name}>{stage.name}</div>
            <div className={styles.desc}>{stage.desc}</div>
            <div className={styles.chips}>
              <span className={clsx(styles.chip, stage.inferred && styles.chipHatch)}>
                {stage.inferred ? t.inferredTag : t.observedTag}
              </span>
            </div>
          </FlowStep>
        ))}
      </Flow>
    </VizFigure>
  );
}

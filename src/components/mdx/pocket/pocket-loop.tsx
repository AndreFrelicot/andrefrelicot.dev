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

type Step = { name: string; desc: string; tone: Tone; icon: IconName };

const COPY = {
  fr: {
    eyebrow: "La boucle",
    title: "Le logiciel devient un post",
    creator: "Geste du créateur",
    platform: "Travail de la plateforme",
    back: "↺ chaque remix repart d'un prompt",
    caption:
      "Lecture produit de Pocket. Les étapes sont observées dans l'app et dans son API.",
    steps: [
      {
        name: "Prompt",
        desc: "Une phrase, une photo ou un dessin.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Gizmo",
        desc: "Une mini-app générée en quelques secondes.",
        tone: "create",
        icon: "gizmo",
      },
      {
        name: "Publication",
        desc: "Un profil, une légende, un lien web.",
        tone: "platform",
        icon: "publish",
      },
      {
        name: "Feed",
        desc: "Classement, likes, reposts, playlists.",
        tone: "platform",
        icon: "feed",
      },
      {
        name: "Remix",
        desc: "Reprendre le gizmo d'un autre et le transformer.",
        tone: "create",
        icon: "remix",
      },
    ] satisfies Step[],
  },
  en: {
    eyebrow: "The loop",
    title: "Software becomes a post",
    creator: "What the creator does",
    platform: "What the platform does",
    back: "↺ every remix starts again from a prompt",
    caption:
      "Pocket read as a product. The steps are observed in the app and in its API.",
    steps: [
      {
        name: "Prompt",
        desc: "A sentence, a photo or a drawing.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Gizmo",
        desc: "A mini-app generated in a few seconds.",
        tone: "create",
        icon: "gizmo",
      },
      {
        name: "Post",
        desc: "A profile, a caption, a web link.",
        tone: "platform",
        icon: "publish",
      },
      {
        name: "Feed",
        desc: "Ranking, likes, reposts, playlists.",
        tone: "platform",
        icon: "feed",
      },
      {
        name: "Remix",
        desc: "Take someone else's gizmo and transform it.",
        tone: "create",
        icon: "remix",
      },
    ] satisfies Step[],
  },
  pt: {
    eyebrow: "O ciclo",
    title: "O software vira um post",
    creator: "Ação do criador",
    platform: "Trabalho da plataforma",
    back: "↺ cada remix recomeça de um prompt",
    caption:
      "Leitura de produto do Pocket. As etapas foram observadas no app e na sua API.",
    steps: [
      {
        name: "Prompt",
        desc: "Uma frase, uma foto ou um desenho.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Gizmo",
        desc: "Um miniapp gerado em poucos segundos.",
        tone: "create",
        icon: "gizmo",
      },
      {
        name: "Publicação",
        desc: "Um perfil, uma legenda, um link web.",
        tone: "platform",
        icon: "publish",
      },
      {
        name: "Feed",
        desc: "Ranqueamento, curtidas, reposts, playlists.",
        tone: "platform",
        icon: "feed",
      },
      {
        name: "Remix",
        desc: "Pegar o gizmo de outra pessoa e transformá-lo.",
        tone: "create",
        icon: "remix",
      },
    ] satisfies Step[],
  },
  es: {
    eyebrow: "El bucle",
    title: "El software se convierte en un post",
    creator: "Acción del creador",
    platform: "Trabajo de la plataforma",
    back: "↺ cada remix parte de nuevo de un prompt",
    caption:
      "Lectura de producto de Pocket. Los pasos se han observado en la app y en su API.",
    steps: [
      {
        name: "Prompt",
        desc: "Una frase, una foto o un dibujo.",
        tone: "create",
        icon: "prompt",
      },
      {
        name: "Gizmo",
        desc: "Una miniapp generada en unos segundos.",
        tone: "create",
        icon: "gizmo",
      },
      {
        name: "Publicación",
        desc: "Un perfil, una descripción, un enlace web.",
        tone: "platform",
        icon: "publish",
      },
      {
        name: "Feed",
        desc: "Ranking, likes, reposts, playlists.",
        tone: "platform",
        icon: "feed",
      },
      {
        name: "Remix",
        desc: "Reutilizar el gizmo de otra persona y transformarlo.",
        tone: "create",
        icon: "remix",
      },
    ] satisfies Step[],
  },
};

export function PocketLoop({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <VizLegend
        items={[
          { label: t.creator, tone: "create" },
          { label: t.platform, tone: "platform" },
        ]}
      />
      <Flow count={t.steps.length}>
        {t.steps.map((step, index) => (
          <FlowStep key={step.name} index={index} tone={step.tone}>
            <span className={clsx(styles.icon, styles.stepIcon)}>
              <Icon name={step.icon} />
            </span>
            <div className={styles.name}>{step.name}</div>
            <div className={styles.desc}>{step.desc}</div>
          </FlowStep>
        ))}
      </Flow>
      <svg
        className={styles.returnArc}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M90 0 C90 9 80 9 70 9 H30 C20 9 10 9 10 0" />
      </svg>
      <div className={styles.returnNote}>
        <span className={clsx(styles.chip, styles.tape)}>{t.back}</span>
      </div>
    </VizFigure>
  );
}

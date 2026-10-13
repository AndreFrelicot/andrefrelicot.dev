import clsx from "clsx";
import styles from "./pocket.module.css";
import { type VizLocale, VizFigure, pickCopy } from "./frame";
import { Icon, type IconName } from "./icons";

type Capability = {
  name: string;
  sig: string;
  desc: string;
  icon: IconName;
  web: boolean;
};

const COPY = {
  fr: {
    eyebrow: "window.gizmoRuntime",
    title: "Ce qu'un gizmo a le droit de demander à son hôte",
    web: "aperçu web",
    absentLabel: "Absent du runtime",
    absent: ["Sauvegarde", "Identité de l'utilisateur", "Appels réseau", "Multijoueur"],
    caption:
      "API reconstruite depuis le code minifié de quatre gizmos : les noms de méthodes sont réels, les descriptions sont les miennes. La pastille indique si la visionneuse web branche le service ; l'app native peut en offrir davantage.",
    capabilities: [
      {
        name: "Haptique",
        sig: "performHaptic()",
        desc: "Huit styles de vibration, de « light » à « error ».",
        icon: "haptic",
        web: true,
      },
      {
        name: "Mouvement",
        sig: "addMotionListener()",
        desc: "Inclinaison du téléphone, environ 30 mesures par seconde, et secousse.",
        icon: "motion",
        web: true,
      },
      {
        name: "Audio",
        sig: "audio.createPlayer()",
        desc: "Lecture pilotée par l'hôte, avec position, forme d'onde et spectre.",
        icon: "audio",
        web: true,
      },
      {
        name: "Texte généré",
        sig: "generateText()",
        desc: "Un appel à un modèle de langage pendant la partie.",
        icon: "text",
        web: false,
      },
      {
        name: "Image générée",
        sig: "generateImage()",
        desc: "Une image produite à la demande, renvoyée sous forme d'URL.",
        icon: "image",
        web: false,
      },
      {
        name: "Réglages (Tweaks)",
        sig: "tweaks()",
        desc: "Curseurs, bascules, couleurs, textes, polices et listes déclarés par le code.",
        icon: "tweaks",
        web: false,
      },
      {
        name: "Mesure",
        sig: "logAnalyticsEvent()",
        desc: "Un journal d'événements remonté à la plateforme.",
        icon: "analytics",
        web: true,
      },
    ] satisfies Capability[],
  },
  en: {
    eyebrow: "window.gizmoRuntime",
    title: "What a gizmo is allowed to ask of its host",
    web: "web preview",
    absentLabel: "Absent from the runtime",
    absent: ["Saving", "User identity", "Network calls", "Multiplayer"],
    caption:
      "API reconstructed from the minified code of four gizmos: the method names are real, the descriptions are mine. The badge shows whether the web viewer wires up the service; the native app may offer more.",
    capabilities: [
      {
        name: "Haptics",
        sig: "performHaptic()",
        desc: "Eight vibration styles, from “light” to “error.”",
        icon: "haptic",
        web: true,
      },
      {
        name: "Motion",
        sig: "addMotionListener()",
        desc: "Phone tilt, about 30 readings per second, and shake.",
        icon: "motion",
        web: true,
      },
      {
        name: "Audio",
        sig: "audio.createPlayer()",
        desc: "Playback driven by the host, with position, waveform and spectrum.",
        icon: "audio",
        web: true,
      },
      {
        name: "Generated text",
        sig: "generateText()",
        desc: "A call to a language model during play.",
        icon: "text",
        web: false,
      },
      {
        name: "Generated image",
        sig: "generateImage()",
        desc: "An image produced on demand, returned as a URL.",
        icon: "image",
        web: false,
      },
      {
        name: "Tweaks",
        sig: "tweaks()",
        desc: "Sliders, toggles, colors, text, fonts and lists declared by the code.",
        icon: "tweaks",
        web: false,
      },
      {
        name: "Analytics",
        sig: "logAnalyticsEvent()",
        desc: "An event log reported back to the platform.",
        icon: "analytics",
        web: true,
      },
    ] satisfies Capability[],
  },
  pt: {
    eyebrow: "window.gizmoRuntime",
    title: "O que um gizmo tem permissão para pedir ao host",
    web: "prévia web",
    absentLabel: "Ausente do runtime",
    absent: ["Salvamento", "Identidade do usuário", "Chamadas de rede", "Multiplayer"],
    caption:
      "API reconstruída a partir do código minificado de quatro gizmos: os nomes dos métodos são reais, as descrições são minhas. O selo indica se o visualizador web conecta o serviço; o app nativo pode oferecer mais.",
    capabilities: [
      {
        name: "Feedback háptico",
        sig: "performHaptic()",
        desc: "Oito estilos de vibração, de “light” a “error”.",
        icon: "haptic",
        web: true,
      },
      {
        name: "Movimento",
        sig: "addMotionListener()",
        desc: "Inclinação do telefone, cerca de 30 medições por segundo, e sacudida.",
        icon: "motion",
        web: true,
      },
      {
        name: "Áudio",
        sig: "audio.createPlayer()",
        desc: "Reprodução controlada pelo host, com posição, forma de onda e espectro.",
        icon: "audio",
        web: true,
      },
      {
        name: "Texto gerado",
        sig: "generateText()",
        desc: "Uma chamada a um modelo de linguagem durante a partida.",
        icon: "text",
        web: false,
      },
      {
        name: "Imagem gerada",
        sig: "generateImage()",
        desc: "Uma imagem produzida sob demanda, devolvida na forma de URL.",
        icon: "image",
        web: false,
      },
      {
        name: "Ajustes (Tweaks)",
        sig: "tweaks()",
        desc: "Sliders, toggles, cores, textos, fontes e listas declarados pelo código.",
        icon: "tweaks",
        web: false,
      },
      {
        name: "Métricas",
        sig: "logAnalyticsEvent()",
        desc: "Um log de eventos enviado à plataforma.",
        icon: "analytics",
        web: true,
      },
    ] satisfies Capability[],
  },
  es: {
    eyebrow: "window.gizmoRuntime",
    title: "Lo que un gizmo puede pedirle a su anfitrión",
    web: "vista previa web",
    absentLabel: "Ausente del runtime",
    absent: ["Guardado", "Identidad del usuario", "Llamadas de red", "Multijugador"],
    caption:
      "API reconstruida a partir del código minificado de cuatro gizmos: los nombres de los métodos son reales, las descripciones son mías. La etiqueta indica si el visor web conecta el servicio; la app nativa puede ofrecer más.",
    capabilities: [
      {
        name: "Háptica",
        sig: "performHaptic()",
        desc: "Ocho estilos de vibración, de «light» a «error».",
        icon: "haptic",
        web: true,
      },
      {
        name: "Movimiento",
        sig: "addMotionListener()",
        desc: "Inclinación del teléfono, unas 30 mediciones por segundo, y sacudida.",
        icon: "motion",
        web: true,
      },
      {
        name: "Audio",
        sig: "audio.createPlayer()",
        desc: "Reproducción controlada por el anfitrión, con posición, forma de onda y espectro.",
        icon: "audio",
        web: true,
      },
      {
        name: "Texto generado",
        sig: "generateText()",
        desc: "Una llamada a un modelo de lenguaje durante la partida.",
        icon: "text",
        web: false,
      },
      {
        name: "Imagen generada",
        sig: "generateImage()",
        desc: "Una imagen producida bajo demanda, devuelta en forma de URL.",
        icon: "image",
        web: false,
      },
      {
        name: "Ajustes (Tweaks)",
        sig: "tweaks()",
        desc: "Deslizadores, interruptores, colores, textos, fuentes y listas declarados por el código.",
        icon: "tweaks",
        web: false,
      },
      {
        name: "Medición",
        sig: "logAnalyticsEvent()",
        desc: "Un registro de eventos que se envía a la plataforma.",
        icon: "analytics",
        web: true,
      },
    ] satisfies Capability[],
  },
};

export function PocketRuntime({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={clsx(styles.grid, styles.capGrid)}>
        {t.capabilities.map((capability) => (
          <div key={capability.name} className={clsx(styles.panel, styles.cap, styles.runtime)}>
            <span className={styles.icon}>
              <Icon name={capability.icon} />
            </span>
            <div className={styles.capBody}>
              <div className={styles.name}>{capability.name}</div>
              <span className={styles.sig}>{capability.sig}</span>
              <div className={styles.desc}>{capability.desc}</div>
              <div className={styles.avail}>
                <span
                  className={clsx(
                    styles.chip,
                    capability.web ? styles.availOn : styles.chipHatch,
                  )}
                >
                  {capability.web ? "✓ " : "✕ "}
                  {t.web}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.absent}>
        <span className={styles.label}>{t.absentLabel}</span>
        {t.absent.map((name) => (
          <span key={name} className={styles.absentChip}>
            <span className={styles.markBad}>✕</span>
            {name}
          </span>
        ))}
      </div>
    </VizFigure>
  );
}

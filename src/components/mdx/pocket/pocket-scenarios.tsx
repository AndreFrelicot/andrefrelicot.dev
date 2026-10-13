import clsx from "clsx";
import styles from "./pocket.module.css";
import { type Tone, type VizLocale, VizFigure, pickCopy } from "./frame";

type Scenario = { name: string; tone: Tone; signal: string; clue: string; devs: string };

const COPY = {
  fr: {
    eyebrow: "Prospective",
    title: "Trois issues possibles",
    labels: {
      signal: "Le signal à surveiller",
      clue: "L'indice aujourd'hui",
      devs: "Pour les développeurs",
    },
    caption: "Scénarios de l'auteur. Aucun n'est annoncé par Meta.",
    scenarios: [
      {
        name: "La mode retombe",
        tone: "neutral",
        signal: "Les installations plafonnent et les créateurs ne reviennent pas.",
        clue: "50 000+ installations Android en trois mois et demi, sans chiffre d'usage.",
        devs: "Rien ne change. Le gizmo reste un jouet de démonstration pour modèles.",
      },
      {
        name: "Le format est absorbé",
        tone: "platform",
        signal: "Des gizmos apparaissent dans Threads, Instagram ou les publicités.",
        clue: "threads.com est autorisé à embarquer des gizmos ; l'API prévoit le partage vers Instagram Direct et Messenger.",
        devs: "Le mini-jeu promotionnel devient un format publicitaire que l'on génère au lieu de le commander.",
      },
      {
        name: "Le format dure",
        tone: "create",
        signal: "Des créateurs vivent de leurs gizmos ; les sons et les modèles circulent comme sur TikTok.",
        clue: "Attribution des remixes, page par son et par artiste, playlists : la plomberie sociale est déjà là.",
        devs: "La valeur se déplace vers ce qui ne tient pas dans un gizmo : données, backend, intégration, confiance.",
      },
    ] satisfies Scenario[],
  },
  en: {
    eyebrow: "Outlook",
    title: "Three possible outcomes",
    labels: {
      signal: "The signal to watch",
      clue: "Today's clue",
      devs: "For developers",
    },
    caption: "The author's scenarios. None has been announced by Meta.",
    scenarios: [
      {
        name: "The fad fades",
        tone: "neutral",
        signal: "Installs plateau and creators do not come back.",
        clue: "50,000+ Android installs in three and a half months, with no usage numbers.",
        devs: "Nothing changes. The gizmo remains a demo toy for models.",
      },
      {
        name: "The format gets absorbed",
        tone: "platform",
        signal: "Gizmos show up in Threads, Instagram or ads.",
        clue: "threads.com is allowed to embed gizmos; the API provides for sharing to Instagram Direct and Messenger.",
        devs: "The promotional mini-game becomes an ad format you generate instead of commissioning.",
      },
      {
        name: "The format lasts",
        tone: "create",
        signal: "Creators make a living from their gizmos; sounds and templates circulate the way they do on TikTok.",
        clue: "Remix attribution, a page per sound and per artist, playlists: the social plumbing is already there.",
        devs: "Value shifts to what does not fit in a gizmo: data, backend, integration, trust.",
      },
    ] satisfies Scenario[],
  },
  pt: {
    eyebrow: "Perspectivas",
    title: "Três desfechos possíveis",
    labels: {
      signal: "O sinal a acompanhar",
      clue: "O indício hoje",
      devs: "Para os desenvolvedores",
    },
    caption: "Cenários do autor. Nenhum foi anunciado pela Meta.",
    scenarios: [
      {
        name: "A moda passa",
        tone: "neutral",
        signal: "As instalações estagnam e os criadores não voltam.",
        clue: "50.000+ instalações no Android em três meses e meio, sem números de uso.",
        devs: "Nada muda. O gizmo continua sendo um brinquedo de demonstração para modelos.",
      },
      {
        name: "O formato é absorvido",
        tone: "platform",
        signal: "Gizmos aparecem no Threads, no Instagram ou em anúncios.",
        clue: "threads.com tem autorização para incorporar gizmos; a API prevê o compartilhamento para o Instagram Direct e o Messenger.",
        devs: "O minijogo promocional vira um formato publicitário que se gera em vez de se encomendar.",
      },
      {
        name: "O formato perdura",
        tone: "create",
        signal: "Criadores vivem de seus gizmos; os sons e os templates circulam como no TikTok.",
        clue: "Atribuição dos remixes, página por som e por artista, playlists: o encanamento social já está pronto.",
        devs: "O valor se desloca para o que não cabe em um gizmo: dados, backend, integração, confiança.",
      },
    ] satisfies Scenario[],
  },
  es: {
    eyebrow: "Prospectiva",
    title: "Tres desenlaces posibles",
    labels: {
      signal: "La señal que hay que vigilar",
      clue: "El indicio hoy",
      devs: "Para los desarrolladores",
    },
    caption: "Escenarios del autor. Meta no ha anunciado ninguno.",
    scenarios: [
      {
        name: "La moda se desinfla",
        tone: "neutral",
        signal: "Las instalaciones se estancan y los creadores no vuelven.",
        clue: "50.000+ instalaciones en Android en tres meses y medio, sin cifras de uso.",
        devs: "Nada cambia. El gizmo sigue siendo un juguete de demostración para modelos.",
      },
      {
        name: "El formato es absorbido",
        tone: "platform",
        signal: "Aparecen gizmos en Threads, en Instagram o en los anuncios.",
        clue: "threads.com está autorizado a incrustar gizmos; la API prevé compartir en Instagram Direct y Messenger.",
        devs: "El minijuego promocional se convierte en un formato publicitario que se genera en lugar de encargarse.",
      },
      {
        name: "El formato perdura",
        tone: "create",
        signal: "Hay creadores que viven de sus gizmos; los sonidos y las plantillas circulan como en TikTok.",
        clue: "Atribución de los remixes, página por sonido y por artista, playlists: las tuberías sociales ya están ahí.",
        devs: "El valor se desplaza hacia lo que no cabe en un gizmo: datos, backend, integración, confianza.",
      },
    ] satisfies Scenario[],
  },
};

export function PocketScenarios({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.grid}>
        {t.scenarios.map((scenario, index) => (
          <div
            key={scenario.name}
            className={clsx(styles.panel, styles.scenario, styles[scenario.tone])}
          >
            <div className={styles.stepHead}>
              <span className={styles.scenarioLetter}>{"ABC"[index]}</span>
              <div className={styles.name}>{scenario.name}</div>
            </div>
            {(["signal", "clue", "devs"] as const).map((key) => (
              <div key={key} className={styles.scenarioRow}>
                <div className={styles.label}>{t.labels[key]}</div>
                <div className={styles.desc}>{scenario[key]}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </VizFigure>
  );
}

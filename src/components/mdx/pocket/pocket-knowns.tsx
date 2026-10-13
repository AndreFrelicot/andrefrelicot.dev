import clsx from "clsx";
import styles from "./pocket.module.css";
import { type Tone, type VizLocale, VizFigure, pickCopy } from "./frame";

type Level = "observed" | "inferred" | "unknown";
type Column = { name: string; level: Level; tone: Tone; items: string[] };

const COPY = {
  fr: {
    eyebrow: "Niveau de preuve",
    title: "Ce qui est observé, déduit, et toujours inconnu",
    caption:
      "État au 13 octobre 2026. « Observé » signifie lu dans une page ou un fichier servi publiquement, sans compte ni contournement.",
    columns: [
      {
        name: "Observé",
        level: "observed",
        tone: "platform",
        items: [
          "Un gizmo est un document HTML autonome, écrit en React",
          "Three.js r186 n'est embarqué que pour la 3D",
          "iframe isolée, un sous-domaine par gizmo, réseau fermé",
          "L'API complète du runtime et le protocole du pont",
          "Le stockage local du navigateur fonctionne dans l'iframe",
          "Le schéma de l'API du feed et des profils",
          "Des routes web /create, /studio et /playlists, derrière la connexion",
          "Un écran « Tweaks » dans l'app, du même nom que la fonction du runtime",
        ],
      },
      {
        name: "Déduit",
        level: "inferred",
        tone: "create",
        items: [
          "L'app native affiche les gizmos dans une WebView",
          "La génération passe par un agent outillé, puis un bundler",
          "L'hôte joue lui-même la musique sous licence",
          "Les réglages déclarés par le code sont ceux que cet écran affiche",
          "Le feed sert aussi de banc d'essai pour le modèle",
        ],
      },
      {
        name: "Inconnu",
        level: "unknown",
        tone: "neutral",
        items: [
          "La pile technique de l'app native et du backend",
          "La version du modèle et le coût d'une génération",
          "La rétention, l'usage, le nombre de gizmos créés",
          "Le modèle économique",
        ],
      },
    ] satisfies Column[],
  },
  en: {
    eyebrow: "Level of evidence",
    title: "What is observed, inferred, and still unknown",
    caption:
      "Status as of October 13, 2026. “Observed” means read in a publicly served page or file, with no account and no circumvention.",
    columns: [
      {
        name: "Observed",
        level: "observed",
        tone: "platform",
        items: [
          "A gizmo is a self-contained HTML document, written in React",
          "Three.js r186 is only bundled for 3D",
          "Sandboxed iframe, one subdomain per gizmo, closed network",
          "The full runtime API and the bridge protocol",
          "The browser's local storage works inside the iframe",
          "The schema of the feed and profile API",
          "Web routes /create, /studio and /playlists, behind the login",
          "A “Tweaks” screen in the app, with the same name as the runtime function",
        ],
      },
      {
        name: "Inferred",
        level: "inferred",
        tone: "create",
        items: [
          "The native app displays gizmos in a WebView",
          "Generation goes through a tool-using agent, then a bundler",
          "The host itself plays the licensed music",
          "The tweaks declared by the code are the ones that screen displays",
          "The feed also serves as a testbed for the model",
        ],
      },
      {
        name: "Unknown",
        level: "unknown",
        tone: "neutral",
        items: [
          "The tech stack of the native app and the backend",
          "The model version and the cost of a generation",
          "Retention, usage, the number of gizmos created",
          "The business model",
        ],
      },
    ] satisfies Column[],
  },
  pt: {
    eyebrow: "Nível de evidência",
    title: "O que foi observado, o que foi deduzido e o que segue desconhecido",
    caption:
      "Situação em 13 de outubro de 2026. “Observado” significa lido em uma página ou em um arquivo servido publicamente, sem conta e sem contornar nenhuma barreira.",
    columns: [
      {
        name: "Observado",
        level: "observed",
        tone: "platform",
        items: [
          "Um gizmo é um documento HTML autocontido, escrito em React",
          "O Three.js r186 só é incluído quando há 3D",
          "iframe isolado, um subdomínio por gizmo, rede fechada",
          "A API completa do runtime e o protocolo da ponte",
          "O armazenamento local do navegador funciona no iframe",
          "O esquema da API do feed e dos perfis",
          "Rotas web /create, /studio e /playlists, atrás do login",
          "Uma tela “Tweaks” no app, com o mesmo nome da função do runtime",
        ],
      },
      {
        name: "Deduzido",
        level: "inferred",
        tone: "create",
        items: [
          "O app nativo exibe os gizmos em uma WebView",
          "A geração passa por um agente com ferramentas e, depois, por um bundler",
          "O próprio host toca a música licenciada",
          "Os ajustes declarados pelo código são os que essa tela exibe",
          "O feed também serve de campo de testes para o modelo",
        ],
      },
      {
        name: "Desconhecido",
        level: "unknown",
        tone: "neutral",
        items: [
          "A stack do app nativo e do backend",
          "A versão do modelo e o custo de uma geração",
          "A retenção, o uso, o número de gizmos criados",
          "O modelo de negócio",
        ],
      },
    ] satisfies Column[],
  },
  es: {
    eyebrow: "Nivel de evidencia",
    title: "Lo observado, lo deducido y lo que sigue siendo desconocido",
    caption:
      "Estado a 13 de octubre de 2026. «Observado» significa leído en una página o un archivo servido públicamente, sin cuenta y sin saltarse ninguna protección.",
    columns: [
      {
        name: "Observado",
        level: "observed",
        tone: "platform",
        items: [
          "Un gizmo es un documento HTML autónomo, escrito en React",
          "Three.js r186 solo se incluye para el 3D",
          "iframe aislado, un subdominio por gizmo, red cerrada",
          "La API completa del runtime y el protocolo del puente",
          "El almacenamiento local del navegador funciona dentro del iframe",
          "El esquema de la API del feed y de los perfiles",
          "Rutas web /create, /studio y /playlists, detrás del inicio de sesión",
          "Una pantalla «Tweaks» en la app, con el mismo nombre que la función del runtime",
        ],
      },
      {
        name: "Deducido",
        level: "inferred",
        tone: "create",
        items: [
          "La app nativa muestra los gizmos en una WebView",
          "La generación pasa por un agente con herramientas y luego por un bundler",
          "El propio anfitrión reproduce la música con licencia",
          "Los ajustes declarados por el código son los que muestra esa pantalla",
          "El feed sirve también de banco de pruebas para el modelo",
        ],
      },
      {
        name: "Desconocido",
        level: "unknown",
        tone: "neutral",
        items: [
          "La stack técnica de la app nativa y del backend",
          "La versión del modelo y el coste de una generación",
          "La retención, el uso, el número de gizmos creados",
          "El modelo de negocio",
        ],
      },
    ] satisfies Column[],
  },
};

const BULLETS: Record<Level, string | undefined> = {
  observed: undefined,
  inferred: styles.bulletHalf,
  unknown: styles.bulletEmpty,
};

export function PocketKnowns({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.grid}>
        {t.columns.map((column) => (
          <div
            key={column.name}
            className={clsx(
              styles.panel,
              styles[column.tone],
              column.level === "inferred" && styles.panelInferred,
              column.level === "unknown" && styles.panelUnknown,
            )}
          >
            <div className={styles.stepHead}>
              <span className={clsx(styles.bullet, BULLETS[column.level])} />
              <div className={styles.name}>{column.name}</div>
            </div>
            <div className={styles.items}>
              {column.items.map((item) => (
                <div key={item} className={styles.item}>
                  <span className={clsx(styles.bullet, BULLETS[column.level])} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </VizFigure>
  );
}

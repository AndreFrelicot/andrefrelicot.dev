import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Box,
  Clock,
  Database,
  Globe,
  HardDrive,
  KeyRound,
  Lock,
  Server,
  ShieldCheck,
  Smartphone,
  User,
  Zap,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "./cx";
import {
  Card,
  type Tone,
  type VizLocale,
  pickCopy,
  toneClass,
  VizFigure,
  VizLegend,
} from "./frame";
import styles from "./topology.module.css";

// The topology of the online prototype (ADR 0020, milestone 8 note), drawn in SVG.
// Four tokens follow four real paths: play a gizmo, call the API, start a
// generation, open a console. Under 720 px, the same paths run as vertical lists.

type NodeId =
  | "app"
  | "staff"
  | "dns"
  | "worker"
  | "iap"
  | "site"
  | "api"
  | "aigw"
  | "edge"
  | "forge"
  | "admin"
  | "sql"
  | "gcs"
  | "secrets"
  | "tasks"
  | "gemini"
  | "builder";

// Layout of each node; its label and sub-label are in COPY.nodes.
type Node = {
  id: NodeId;
  x: number;
  y: number;
  w?: number;
  icon: LucideIcon;
  tone: Tone;
};

const NODES: Node[] = [
  { id: "app", x: 92, y: 170, w: 156, icon: Smartphone, tone: "creator" },
  { id: "staff", x: 92, y: 400, w: 156, icon: User, tone: "creator" },
  { id: "dns", x: 290, w: 172, y: 108, icon: Globe, tone: "cloud" },
  { id: "worker", x: 290, y: 215, icon: Zap, tone: "cloud" },
  { id: "iap", x: 290, y: 400, icon: ShieldCheck, tone: "cloud" },
  { id: "site", x: 530, y: 75, icon: Server, tone: "cloud" },
  { id: "api", x: 530, y: 130, icon: Server, tone: "cloud" },
  { id: "aigw", x: 530, y: 185, icon: Server, tone: "cloud" },
  { id: "edge", x: 530, y: 240, icon: Server, tone: "cloud" },
  { id: "forge", x: 530, y: 322, icon: Bot, tone: "ai" },
  { id: "admin", x: 530, w: 160, y: 395, icon: Lock, tone: "cloud" },
  { id: "sql", x: 840, w: 166, y: 90, icon: Database, tone: "cost" },
  { id: "gcs", x: 840, w: 166, y: 170, icon: HardDrive, tone: "cloud" },
  { id: "secrets", x: 840, w: 166, y: 245, icon: KeyRound, tone: "cloud" },
  { id: "tasks", x: 840, w: 166, y: 320, icon: Clock, tone: "cloud" },
  { id: "gemini", x: 840, w: 166, y: 395, icon: Bot, tone: "ai" },
  { id: "builder", x: 840, w: 166, y: 492, icon: Box, tone: "hostile" },
];

const EDGES = [
  "M160 170 C190 170 190 215 215 215",
  "M365 215 C410 215 410 75 455 75",
  "M365 215 C410 215 410 130 455 130",
  "M365 215 C410 215 410 185 455 185",
  "M365 215 C410 215 410 240 455 240",
  "M605 130 C690 130 690 90 765 90",
  "M605 240 C690 240 690 170 765 170",
  "M605 135 C700 135 680 312 765 312",
  "M765 330 C700 330 660 325 605 325",
  "M530 342 C530 450 700 492 765 492",
  "M605 332 C680 345 690 395 765 395",
  "M160 400 L215 400",
  "M365 400 C410 400 410 395 455 395",
];

const TOKENS: { tone: Tone; path: string; dur: number; delay: number }[] = [
  {
    tone: "creator",
    dur: 5,
    delay: 0,
    path: "M160 170 C190 170 190 215 215 215 L365 215 C410 215 410 130 455 130 L605 130 C690 130 690 90 765 90",
  },
  {
    tone: "cloud",
    dur: 5,
    delay: 2.5,
    path: "M160 170 C190 170 190 215 215 215 L365 215 C410 215 410 240 455 240 L605 240 C690 240 690 170 765 170",
  },
  {
    tone: "ai",
    dur: 6,
    delay: 1,
    path: "M605 135 C700 135 680 312 765 312 L765 330 C700 330 660 325 605 325 L530 325 L530 342 C530 450 700 492 765 492",
  },
  {
    tone: "neutral",
    dur: 4,
    delay: 0.5,
    path: "M160 400 L215 400 L365 400 C410 400 410 395 455 395",
  },
];

// The same paths, for a phone: each becomes a vertical rule its marker runs down,
// as on the diagram, and each step lights up as it passes. The tones are those of
// the tokens and the legend. The text of each path is in COPY.paths.
const PATHS: { icon: LucideIcon; tone: Tone; dur: number; delay: number }[] = [
  { icon: Smartphone, tone: "cloud", dur: 5, delay: 0 },
  { icon: Server, tone: "creator", dur: 4.5, delay: 1.2 },
  { icon: Bot, tone: "ai", dur: 6, delay: 0.6 },
  { icon: Lock, tone: "neutral", dur: 4, delay: 1.8 },
];

type Hop = [name: string, sub?: string];
type NodeText = [label: string, sub: string];

const COPY = {
  fr: {
    eyebrow: "Le prototype en ligne",
    title:
      "Le prototype : Cloudflare devant, Cloud Run au milieu, une base qui dort",
    caption: (
      <>
        Rien sur ce schéma ne tourne au repos, sauf le stockage de la base
        arrêtée. Le Worker relaie chaque nom d&apos;hôte vers son service : l&apos;offre
        gratuite de Cloudflare ne sait pas réécrire l&apos;en-tête <code>Host</code>,
        dont Cloud Run se sert pour choisir le service. Les consoles ne passent
        pas par Cloudflare : IAP protège directement leur URL{" "}
        <code>run.app</code>.
      </>
    ),
    aria: "Topologie du prototype en ligne",
    zones: {
      cloudflare: "Cloudflare · gratuit",
      gcp: "projet poptoy-dev · europe-west1",
      sandbox: "projet poptoy-sandbox-dev",
    },
    nodes: {
      app: ["App, navigateur", "joueur, créateur"],
      staff: ["Équipe", "compte Google"],
      dns: ["DNS, TLS, pare-feu", "2 domaines"],
      worker: ["Worker", "poptoy-edge · clé"],
      iap: ["IAP", "sans load balancer"],
      site: ["site", "Cloud Run · min 0"],
      api: ["api", "Cloud Run · min 0"],
      aigw: ["aigw", "Cloud Run · min 0"],
      edge: ["gizmo_edge", "Cloud Run · min 0"],
      forge: ["forge", "privée, réveillée"],
      admin: ["admin, moderation", "consoles derrière IAP"],
      sql: ["Cloud SQL", "IP privée, arrêtée"],
      gcs: ["Cloud Storage", "blobs, pointeurs"],
      secrets: ["Secret Manager", "8 secrets"],
      tasks: ["Tasks, Scheduler", "réveil, arrêt à 2 h"],
      gemini: ["Gemini", "Agent Platform"],
      builder: ["builder", "une sandbox par build"],
    } satisfies Record<NodeId, NodeText>,
    paths: [
      {
        title: "Jouer un gizmo",
        hops: [
          ["App, navigateur"],
          ["Cloudflare", "DNS, TLS, pare-feu"],
          ["Worker", "pose la clé d'edge"],
          ["gizmo_edge", "Cloud Run"],
          ["Cloud Storage", "le gizmo et ses médias"],
        ],
      },
      {
        title: "Appeler l'API",
        hops: [
          ["App, navigateur"],
          ["Worker", "clé d'edge"],
          ["api", "Cloud Run"],
          ["Cloud SQL", "IP privée"],
        ],
      },
      {
        title: "Lancer une génération",
        hops: [
          ["api"],
          ["Cloud Tasks", "réveil"],
          ["forge", "POST /wake"],
          ["Gemini", "Agent Platform"],
          ["builder", "projet sandbox"],
        ],
      },
      {
        title: "Ouvrir une console",
        hops: [
          ["Équipe"],
          ["IAP", "compte Google"],
          ["admin, moderation", "URL run.app"],
        ],
      },
    ] satisfies { title: string; hops: Hop[] }[],
    legend: [
      "Jouer : gizmo et médias",
      "Appeler l'API",
      "Générer",
      "Console derrière IAP",
      "Code non fiable : la sandbox",
    ],
  },
  en: {
    eyebrow: "The online prototype",
    title:
      "The prototype: Cloudflare in front, Cloud Run in the middle, a database that sleeps",
    caption: (
      <>
        Nothing on this diagram runs at rest, except the storage of the stopped
        database. The Worker relays each hostname to its service:
        Cloudflare&apos;s free plan cannot rewrite the <code>Host</code> header,
        which Cloud Run uses to pick the service. The consoles do not go through
        Cloudflare: IAP protects their <code>run.app</code> URL directly.
      </>
    ),
    aria: "Topology of the online prototype",
    zones: {
      cloudflare: "Cloudflare · free",
      gcp: "project poptoy-dev · europe-west1",
      sandbox: "project poptoy-sandbox-dev",
    },
    nodes: {
      app: ["App, browser", "player, creator"],
      staff: ["Team", "Google account"],
      dns: ["DNS, TLS, firewall", "2 domains"],
      worker: ["Worker", "poptoy-edge · key"],
      iap: ["IAP", "no load balancer"],
      site: ["site", "Cloud Run · min 0"],
      api: ["api", "Cloud Run · min 0"],
      aigw: ["aigw", "Cloud Run · min 0"],
      edge: ["gizmo_edge", "Cloud Run · min 0"],
      forge: ["forge", "private, woken up"],
      admin: ["admin, moderation", "consoles behind IAP"],
      sql: ["Cloud SQL", "private IP, stopped"],
      gcs: ["Cloud Storage", "blobs, pointers"],
      secrets: ["Secret Manager", "8 secrets"],
      tasks: ["Tasks, Scheduler", "wake-up, 2 am stop"],
      gemini: ["Gemini", "Agent Platform"],
      builder: ["builder", "one sandbox per build"],
    } satisfies Record<NodeId, NodeText>,
    paths: [
      {
        title: "Play a gizmo",
        hops: [
          ["App, browser"],
          ["Cloudflare", "DNS, TLS, firewall"],
          ["Worker", "adds the edge key"],
          ["gizmo_edge", "Cloud Run"],
          ["Cloud Storage", "the gizmo and its media"],
        ],
      },
      {
        title: "Call the API",
        hops: [
          ["App, browser"],
          ["Worker", "edge key"],
          ["api", "Cloud Run"],
          ["Cloud SQL", "private IP"],
        ],
      },
      {
        title: "Start a generation",
        hops: [
          ["api"],
          ["Cloud Tasks", "wake-up"],
          ["forge", "POST /wake"],
          ["Gemini", "Agent Platform"],
          ["builder", "sandbox project"],
        ],
      },
      {
        title: "Open a console",
        hops: [
          ["Team"],
          ["IAP", "Google account"],
          ["admin, moderation", "run.app URL"],
        ],
      },
    ] satisfies { title: string; hops: Hop[] }[],
    legend: [
      "Play: gizmo and media",
      "Call the API",
      "Generate",
      "Console behind IAP",
      "Untrusted code: the sandbox",
    ],
  },
  es: {
    eyebrow: "El prototipo en línea",
    title:
      "El prototipo: Cloudflare delante, Cloud Run en medio, una base de datos que duerme",
    caption: (
      <>
        Nada de este esquema funciona en reposo, salvo el almacenamiento de la
        base de datos detenida. El Worker reenvía cada nombre de host a su
        servicio: el plan gratuito de Cloudflare no puede reescribir la cabecera{" "}
        <code>Host</code>, que Cloud Run usa para elegir el servicio. Las
        consolas no pasan por Cloudflare: IAP protege directamente su URL{" "}
        <code>run.app</code>.
      </>
    ),
    aria: "Topología del prototipo en línea",
    zones: {
      cloudflare: "Cloudflare · gratis",
      gcp: "proyecto poptoy-dev · europe-west1",
      sandbox: "proyecto poptoy-sandbox-dev",
    },
    nodes: {
      app: ["App, navegador", "jugador, creador"],
      staff: ["Equipo", "cuenta de Google"],
      dns: ["DNS, TLS, cortafuegos", "2 dominios"],
      worker: ["Worker", "poptoy-edge · clave"],
      iap: ["IAP", "sin balanceador"],
      site: ["site", "Cloud Run · min 0"],
      api: ["api", "Cloud Run · min 0"],
      aigw: ["aigw", "Cloud Run · min 0"],
      edge: ["gizmo_edge", "Cloud Run · min 0"],
      forge: ["forge", "privada, a demanda"],
      admin: ["admin, moderation", "consolas tras IAP"],
      sql: ["Cloud SQL", "IP privada, detenida"],
      gcs: ["Cloud Storage", "blobs, punteros"],
      secrets: ["Secret Manager", "8 secretos"],
      tasks: ["Tasks, Scheduler", "inicio, parada 2:00"],
      gemini: ["Gemini", "Agent Platform"],
      builder: ["builder", "una sandbox por build"],
    } satisfies Record<NodeId, NodeText>,
    paths: [
      {
        title: "Jugar un gizmo",
        hops: [
          ["App, navegador"],
          ["Cloudflare", "DNS, TLS, cortafuegos"],
          ["Worker", "añade la clave de edge"],
          ["gizmo_edge", "Cloud Run"],
          ["Cloud Storage", "el gizmo y sus medios"],
        ],
      },
      {
        title: "Llamar a la API",
        hops: [
          ["App, navegador"],
          ["Worker", "clave de edge"],
          ["api", "Cloud Run"],
          ["Cloud SQL", "IP privada"],
        ],
      },
      {
        title: "Lanzar una generación",
        hops: [
          ["api"],
          ["Cloud Tasks", "despertar"],
          ["forge", "POST /wake"],
          ["Gemini", "Agent Platform"],
          ["builder", "proyecto sandbox"],
        ],
      },
      {
        title: "Abrir una consola",
        hops: [
          ["Equipo"],
          ["IAP", "cuenta de Google"],
          ["admin, moderation", "URL run.app"],
        ],
      },
    ] satisfies { title: string; hops: Hop[] }[],
    legend: [
      "Jugar: gizmo y medios",
      "Llamar a la API",
      "Generar",
      "Consola tras IAP",
      "Código no fiable: la sandbox",
    ],
  },
  pt: {
    eyebrow: "O protótipo online",
    title:
      "O protótipo: Cloudflare na frente, Cloud Run no meio, um banco de dados que dorme",
    caption: (
      <>
        Nada neste diagrama roda em repouso, exceto o armazenamento do banco
        parado. O Worker repassa cada nome de host para o seu serviço: o plano
        gratuito da Cloudflare não consegue reescrever o cabeçalho{" "}
        <code>Host</code>, que o Cloud Run usa para escolher o serviço. Os
        consoles não passam pela Cloudflare: o IAP protege diretamente a URL{" "}
        <code>run.app</code> deles.
      </>
    ),
    aria: "Topologia do protótipo online",
    zones: {
      cloudflare: "Cloudflare · grátis",
      gcp: "projeto poptoy-dev · europe-west1",
      sandbox: "projeto poptoy-sandbox-dev",
    },
    nodes: {
      app: ["App, navegador", "jogador, criador"],
      staff: ["Equipe", "conta Google"],
      dns: ["DNS, TLS, firewall", "2 domínios"],
      worker: ["Worker", "poptoy-edge · chave"],
      iap: ["IAP", "sem load balancer"],
      site: ["site", "Cloud Run · min 0"],
      api: ["api", "Cloud Run · min 0"],
      aigw: ["aigw", "Cloud Run · min 0"],
      edge: ["gizmo_edge", "Cloud Run · min 0"],
      forge: ["forge", "privada, acionada"],
      admin: ["admin, moderation", "consoles sob IAP"],
      sql: ["Cloud SQL", "IP privado, parado"],
      gcs: ["Cloud Storage", "blobs, ponteiros"],
      secrets: ["Secret Manager", "8 segredos"],
      tasks: ["Tasks, Scheduler", "acorda, para às 2h"],
      gemini: ["Gemini", "Agent Platform"],
      builder: ["builder", "uma sandbox por build"],
    } satisfies Record<NodeId, NodeText>,
    paths: [
      {
        title: "Jogar um gizmo",
        hops: [
          ["App, navegador"],
          ["Cloudflare", "DNS, TLS, firewall"],
          ["Worker", "adiciona a chave de edge"],
          ["gizmo_edge", "Cloud Run"],
          ["Cloud Storage", "o gizmo e suas mídias"],
        ],
      },
      {
        title: "Chamar a API",
        hops: [
          ["App, navegador"],
          ["Worker", "chave de edge"],
          ["api", "Cloud Run"],
          ["Cloud SQL", "IP privado"],
        ],
      },
      {
        title: "Iniciar uma geração",
        hops: [
          ["api"],
          ["Cloud Tasks", "acordar"],
          ["forge", "POST /wake"],
          ["Gemini", "Agent Platform"],
          ["builder", "projeto sandbox"],
        ],
      },
      {
        title: "Abrir um console",
        hops: [
          ["Equipe"],
          ["IAP", "conta Google"],
          ["admin, moderation", "URL run.app"],
        ],
      },
    ] satisfies { title: string; hops: Hop[] }[],
    legend: [
      "Jogar: gizmo e mídias",
      "Chamar a API",
      "Gerar",
      "Console atrás do IAP",
      "Código não confiável: a sandbox",
    ],
  },
};

function SvgNode({ n, text: [label, sub] }: { n: Node; text: NodeText }) {
  const w = n.w ?? 150;
  const Icon = n.icon;
  return (
    <g
      className={cx(styles.node, toneClass(n.tone))}
      transform={`translate(${String(n.x - w / 2)} ${String(n.y - 20)})`}
    >
      <rect width={w} height={40} rx={1} className={styles.nodeBox} />
      <Icon
        x={10}
        y={12}
        width={16}
        height={16}
        strokeWidth={1.4}
        className={styles.nodeIcon}
      />
      <circle cx={w} cy={20} r={2.5} className={styles.nodeDot} />
      <text x={40} y={18} className={styles.nodeLabel}>
        {label}
      </text>
      <text x={40} y={31} className={styles.nodeSub}>
        {sub}
      </text>
    </g>
  );
}

function MobilePaths({ paths }: { paths: { title: string; hops: Hop[] }[] }) {
  return (
    <div className={styles.mobileMotion}>
      {PATHS.map((p, k) => {
        const { title, hops } = paths[k];
        return (
          <Card key={title} icon={p.icon} tone={p.tone} title={title}>
            <ol
              className={styles.hops}
              style={
                {
                  "--n": hops.length,
                  "--dur": `${String(p.dur)}s`,
                  "--delay": `${String(p.delay)}s`,
                } as CSSProperties
              }
            >
              <span
                className={cx(styles.hopToken, toneClass(p.tone))}
                aria-hidden="true"
              />
              {hops.map(([name, sub], i) => (
                <li
                  key={name}
                  className={toneClass(p.tone)}
                  style={{ "--i": i } as CSSProperties}
                >
                  <span className={styles.hopDot} aria-hidden="true" />
                  <span className={styles.hopName}>{name}</span>
                  {sub && <span className={styles.hopSub}>{sub}</span>}
                </li>
              ))}
            </ol>
          </Card>
        );
      })}
    </div>
  );
}

export function Topology({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.svgWrap}>
        <svg
          viewBox="0 0 1000 545"
          className={styles.svg}
          role="img"
          aria-label={t.aria}
        >
          <rect
            x={196}
            y={55}
            width={188}
            height={215}
            rx={0}
            className={styles.zone}
          />
          <text x={212} y={78} className={styles.zoneLabel}>
            {t.zones.cloudflare}
          </text>
          <rect
            x={420}
            y={20}
            width={570}
            height={420}
            rx={0}
            className={cx(styles.zone, styles.zoneGcp)}
          />
          <text x={436} y={44} className={styles.zoneLabel}>
            {t.zones.gcp}
          </text>
          <rect
            x={620}
            y={452}
            width={370}
            height={82}
            rx={0}
            className={cx(styles.zone, styles.zoneSandbox)}
          />
          <text x={636} y={524} className={styles.zoneLabel}>
            {t.zones.sandbox}
          </text>
          <text x={212} y={258} className={styles.keyLabel}>
            X-Poptoy-Edge-Key
          </text>

          {EDGES.map((d) => (
            <path key={d} d={d} className={styles.edge} />
          ))}
          {TOKENS.map((tk) => (
            <circle
              key={tk.path}
              r={3.5}
              className={cx(styles.token, toneClass(tk.tone))}
              style={{
                offsetPath: `path("${tk.path}")`,
                animationDuration: `${String(tk.dur)}s`,
                animationDelay: `${String(tk.delay)}s`,
              }}
            />
          ))}
          {NODES.map((n) => (
            <SvgNode key={n.id} n={n} text={t.nodes[n.id]} />
          ))}
        </svg>
      </div>
      <MobilePaths paths={t.paths} />
      <VizLegend
        items={[
          { label: t.legend[0], tone: "cloud" },
          { label: t.legend[1], tone: "creator" },
          { label: t.legend[2], tone: "ai" },
          { label: t.legend[3], tone: "neutral" },
          { label: t.legend[4], tone: "hostile" },
        ]}
      />
    </VizFigure>
  );
}

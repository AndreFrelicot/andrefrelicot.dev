import {
  AppWindow,
  Boxes,
  Bot,
  Cpu,
  Database,
  Gauge,
  Globe,
  Hammer,
  Images,
  LayoutDashboard,
  Lock,
  Server,
  ShieldAlert,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "./cx";
import { type Tone, type VizLocale, VizFigure, pickCopy, toneClass } from "./frame";
import styles from "./architecture-map.module.css";

// A logical map: who talks to whom, in which trust zone. The numbers follow one
// creation, replayed in a loop by the animation.
const CYCLE_STEPS = 8;

type Node = { label: string; sub?: string; icon: LucideIcon; step?: number };

function Chip({ node, tone }: { node: Node; tone: Tone }) {
  const Icon = node.icon;
  return (
    <div
      className={cx(styles.chip, toneClass(tone), node.step !== undefined && styles.onPath)}
      style={{ "--s": node.step ?? 0 } as CSSProperties}
    >
      <Icon size={16} strokeWidth={1.35} className={styles.chipIcon} aria-hidden="true" />
      <span className={styles.chipText}>
        <span className={styles.chipLabel}>{node.label.replaceAll(".", ".\u200b")}</span>
        {node.sub && <span className={styles.chipSub}>{node.sub}</span>}
      </span>
      {node.step !== undefined && <span className={styles.step}>{node.step + 1}</span>}
    </div>
  );
}

// A trust zone is a boundary: a one-pixel frame with its name on the rule. A
// plain grouping only gets a label.
function Zone({
  title,
  tone,
  dashed = false,
  framed = true,
  children,
}: {
  title: string;
  tone: Tone;
  dashed?: boolean;
  framed?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(framed ? styles.zone : styles.group, toneClass(tone), dashed && styles.dashed)}
    >
      <div className={styles.zoneTitle}>{title}</div>
      <div className={styles.zoneBody}>{children}</div>
    </div>
  );
}

const COPY = {
  fr: {
    eyebrow: "Vue d'ensemble",
    title: "Huit services, deux domaines, et une frontière qui ne bouge pas",
    caption:
      "Les cadres sont des frontières. En sarcelle, la plateforme : elle peut détenir un secret. En rouge, ce qui touche du code généré et n'en détient aucun : un domaine à part, un service à part, une sandbox sans réseau, en pointillé. Les numéros suivent une création, de l'idée au feed.",
    cols: ["Clients", "Domaines", "Services", "Données et modèles"],
    zones: {
      creators: "Créateurs et joueurs",
      team: "Équipe",
      platform: "La plateforme",
      untrusted: "Le non-fiable",
      core: "Cœur : des secrets",
      hostile: "Contenu hostile",
      sandbox: "Sandbox, sans réseau",
      data: "Données",
      models: "Modèles",
    },
    chips: {
      app: { label: "App Flutter", sub: "iOS, Android" },
      studio: { label: "Studio et site", sub: "React, Vite" },
      admin: { label: "Console d'admin", sub: "derrière IAP" },
      moderation: { label: "Console de modération", sub: "derrière IAP" },
      consoles: { label: "admin. et moderation." },
      postgres: { label: "Postgres", sub: "comptes, versions, file, coûts" },
      blobs: { label: "Blobs", sub: "adressés par empreinte" },
      platform: { label: "Agent Platform", sub: "Gemini, Claude" },
      openrouter: { label: "OpenRouter", sub: "autres familles" },
    },
    subs: {
      site: "site, studio, partage",
      inGame: "IA en cours de partie",
      origin: "une origine par gizmo",
      api: "app et studio",
      forge: "graphe ADK",
      edge: "CSP, en-têtes, pointeurs",
      builder: "une sandbox par build",
    },
    path: [
      "le créateur envoie son idée à l'API",
      "l'API la met en file, dans Postgres",
      "la forge prend le job",
      "un modèle planifie et écrit le code",
      "le builder le construit et le teste, sans réseau",
      "l'artefact devient un blob adressé par son empreinte",
      "gizmo_edge le sert, avec sa CSP",
      "il s'affiche dans une iframe ou une WebView",
    ],
  },
  en: {
    eyebrow: "Overview",
    title: "Eight services, two domains, and one boundary that never moves",
    caption:
      "The frames are boundaries. In teal, the platform: it may hold a secret. In red, whatever touches generated code and holds none: a separate domain, a separate service, a sandbox with no network, dashed. The numbers follow one creation, from idea to feed.",
    cols: ["Clients", "Domains", "Services", "Data and models"],
    zones: {
      creators: "Creators and players",
      team: "Team",
      platform: "The platform",
      untrusted: "The untrusted",
      core: "Core: holds secrets",
      hostile: "Hostile content",
      sandbox: "Sandbox, no network",
      data: "Data",
      models: "Models",
    },
    chips: {
      app: { label: "Flutter app", sub: "iOS, Android" },
      studio: { label: "Studio and site", sub: "React, Vite" },
      admin: { label: "Admin console", sub: "behind IAP" },
      moderation: { label: "Moderation console", sub: "behind IAP" },
      consoles: { label: "admin. and moderation." },
      postgres: { label: "Postgres", sub: "accounts, versions, queue, costs" },
      blobs: { label: "Blobs", sub: "content-addressed" },
      platform: { label: "Agent Platform", sub: "Gemini, Claude" },
      openrouter: { label: "OpenRouter", sub: "other families" },
    },
    subs: {
      site: "site, studio, sharing",
      inGame: "in-game AI",
      origin: "one origin per gizmo",
      api: "app and studio",
      forge: "ADK graph",
      edge: "CSP, headers, pointers",
      builder: "one sandbox per build",
    },
    path: [
      "the creator sends an idea to the API",
      "the API queues it in Postgres",
      "the forge picks up the job",
      "a model plans and writes the code",
      "the builder builds and tests it, with no network",
      "the artifact becomes a content-addressed blob",
      "gizmo_edge serves it, with its CSP",
      "it renders in an iframe or a WebView",
    ],
  },
  es: {
    eyebrow: "Visión general",
    title: "Ocho servicios, dos dominios y una frontera que no se mueve",
    caption:
      "Los marcos son fronteras. En verde azulado, la plataforma: puede guardar un secreto. En rojo, lo que toca código generado y no guarda ninguno: un dominio aparte, un servicio aparte, una sandbox sin red, en línea discontinua. Los números siguen una creación, de la idea al feed.",
    cols: ["Clientes", "Dominios", "Servicios", "Datos y modelos"],
    zones: {
      creators: "Creadores y jugadores",
      team: "Equipo",
      platform: "La plataforma",
      untrusted: "Lo no fiable",
      core: "Núcleo: con secretos",
      hostile: "Contenido hostil",
      sandbox: "Sandbox, sin red",
      data: "Datos",
      models: "Modelos",
    },
    chips: {
      app: { label: "App Flutter", sub: "iOS, Android" },
      studio: { label: "Estudio y sitio", sub: "React, Vite" },
      admin: { label: "Consola de administración", sub: "tras IAP" },
      moderation: { label: "Consola de moderación", sub: "tras IAP" },
      consoles: { label: "admin. y moderation." },
      postgres: { label: "Postgres", sub: "cuentas, versiones, cola, costes" },
      blobs: { label: "Blobs", sub: "direccionados por contenido" },
      platform: { label: "Agent Platform", sub: "Gemini, Claude" },
      openrouter: { label: "OpenRouter", sub: "otras familias" },
    },
    subs: {
      site: "sitio, estudio, compartir",
      inGame: "IA durante la partida",
      origin: "un origen por gizmo",
      api: "app y estudio",
      forge: "grafo ADK",
      edge: "CSP, cabeceras, punteros",
      builder: "una sandbox por build",
    },
    path: [
      "el creador envía su idea a la API",
      "la API la pone en cola, en Postgres",
      "la forja toma el trabajo",
      "un modelo planifica y escribe el código",
      "el builder lo compila y lo prueba, sin red",
      "el artefacto se convierte en un blob direccionado por contenido",
      "gizmo_edge lo sirve, con su CSP",
      "se muestra en un iframe o una WebView",
    ],
  },
  pt: {
    eyebrow: "Visão geral",
    title: "Oito serviços, dois domínios e uma fronteira que não se move",
    caption:
      "As molduras são fronteiras. Em verde-azulado, a plataforma: ela pode guardar um segredo. Em vermelho, o que toca código gerado e não guarda nenhum: um domínio à parte, um serviço à parte, uma sandbox sem rede, tracejada. Os números seguem uma criação, da ideia ao feed.",
    cols: ["Clientes", "Domínios", "Serviços", "Dados e modelos"],
    zones: {
      creators: "Criadores e jogadores",
      team: "Equipe",
      platform: "A plataforma",
      untrusted: "O não confiável",
      core: "Núcleo: com segredos",
      hostile: "Conteúdo hostil",
      sandbox: "Sandbox, sem rede",
      data: "Dados",
      models: "Modelos",
    },
    chips: {
      app: { label: "App Flutter", sub: "iOS, Android" },
      studio: { label: "Estúdio e site", sub: "React, Vite" },
      admin: { label: "Console de administração", sub: "atrás do IAP" },
      moderation: { label: "Console de moderação", sub: "atrás do IAP" },
      consoles: { label: "admin. e moderation." },
      postgres: { label: "Postgres", sub: "contas, versões, fila, custos" },
      blobs: { label: "Blobs", sub: "endereçados por conteúdo" },
      platform: { label: "Agent Platform", sub: "Gemini, Claude" },
      openrouter: { label: "OpenRouter", sub: "outras famílias" },
    },
    subs: {
      site: "site, estúdio, compartilhamento",
      inGame: "IA durante a partida",
      origin: "uma origem por gizmo",
      api: "app e estúdio",
      forge: "grafo ADK",
      edge: "CSP, cabeçalhos, ponteiros",
      builder: "uma sandbox por build",
    },
    path: [
      "o criador envia sua ideia para a API",
      "a API a coloca na fila, no Postgres",
      "a forja pega o job",
      "um modelo planeja e escreve o código",
      "o builder o compila e o testa, sem rede",
      "o artefato vira um blob endereçado por conteúdo",
      "gizmo_edge o serve, com sua CSP",
      "ele aparece em um iframe ou em uma WebView",
    ],
  },
};

export function ArchitectureMap({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  const { zones, chips, subs } = t;
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.map}>
        <div className={styles.col}>
          <div className={styles.colTitle}>{t.cols[0]}</div>
          <Zone title={zones.creators} tone="creator" framed={false}>
            <Chip tone="creator" node={{ ...chips.app, icon: Smartphone, step: 0 }} />
            <Chip tone="creator" node={{ ...chips.studio, icon: AppWindow }} />
          </Zone>
          <Zone title={zones.team} tone="neutral" framed={false}>
            <Chip tone="neutral" node={{ ...chips.admin, icon: LayoutDashboard }} />
            <Chip tone="neutral" node={{ ...chips.moderation, icon: ShieldAlert }} />
          </Zone>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>{t.cols[1]}</div>
          <Zone title={zones.platform} tone="cloud" icon={Lock}>
            <Chip tone="cloud" node={{ label: "poptoy.app", sub: subs.site, icon: Globe }} />
            <Chip tone="cloud" node={{ label: "api.poptoy.app", icon: Globe }} />
            <Chip tone="cloud" node={{ label: "ai.poptoy.app", sub: subs.inGame, icon: Globe }} />
            <Chip tone="cloud" node={{ ...chips.consoles, icon: Lock }} />
          </Zone>
          <Zone title={zones.untrusted} tone="hostile" icon={ShieldAlert}>
            <Chip
              tone="hostile"
              node={{
                label: "{id}.poptoyusercontent.app",
                sub: subs.origin,
                icon: Globe,
                step: 7,
              }}
            />
            <Chip tone="hostile" node={{ label: "media.poptoyusercontent.app", icon: Images }} />
          </Zone>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>{t.cols[2]}</div>
          <Zone title={zones.core} tone="cloud">
            <Chip tone="cloud" node={{ label: "api", sub: subs.api, icon: Server }} />
            <Chip tone="ai" node={{ label: "forge", sub: subs.forge, icon: Sparkles, step: 2 }} />
            <Chip tone="cloud" node={{ label: "aigw", sub: subs.inGame, icon: Gauge }} />
            <div className={styles.twoUp}>
              <Chip tone="cloud" node={{ label: "site", icon: Server }} />
              <Chip tone="cloud" node={{ label: "admin", icon: Server }} />
            </div>
            <Chip tone="cloud" node={{ label: "moderation", icon: Server }} />
          </Zone>
          <Zone title={zones.hostile} tone="hostile">
            <Chip
              tone="hostile"
              node={{ label: "gizmo_edge", sub: subs.edge, icon: Server, step: 6 }}
            />
          </Zone>
          <Zone title={zones.sandbox} tone="hostile" dashed>
            <Chip
              tone="hostile"
              node={{ label: "builder", sub: subs.builder, icon: Hammer, step: 4 }}
            />
          </Zone>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>{t.cols[3]}</div>
          <Zone title={zones.data} tone="neutral" framed={false}>
            <Chip tone="neutral" node={{ ...chips.postgres, icon: Database, step: 1 }} />
            <Chip tone="neutral" node={{ ...chips.blobs, icon: Boxes, step: 5 }} />
          </Zone>
          <Zone title={zones.models} tone="ai" framed={false}>
            <Chip tone="ai" node={{ ...chips.platform, icon: Cpu, step: 3 }} />
            <Chip tone="ai" node={{ ...chips.openrouter, icon: Bot }} />
          </Zone>
        </div>
      </div>

      <ol className={styles.path} style={{ "--n": CYCLE_STEPS } as CSSProperties}>
        {t.path.map((p, i) => (
          <li key={p} style={{ "--s": i } as CSSProperties}>
            <span className={styles.pathNo}>{i + 1}</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </VizFigure>
  );
}

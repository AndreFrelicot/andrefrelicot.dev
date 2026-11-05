import { Bot, FileText, Hammer, type LucideIcon, Wrench } from "lucide-react";
import { cx } from "./cx";
import { type Tone, type VizLocale, VizFigure, VizLegend, pickCopy, toneClass } from "./frame";
import styles from "./ai.module.css";
import { Stage } from "./stage";

// The forge graph (workflow.py), walked by a token: a generation that fails its
// first build, goes through the fix, then succeeds. Positions are in design px
// (920 × 320); the token follows the same path as the edges (offset-path).

type Kind = "agent" | "brief" | "fn" | "end";

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: Kind;
  tone: Tone;
  icon?: LucideIcon;
};

const NODES: GraphNode[] = [
  { id: "start", label: "START", x: 40, y: 130, kind: "end", tone: "creator" },
  { id: "briefPlan", label: "brief_plan", x: 140, y: 130, kind: "brief", tone: "neutral" },
  {
    id: "plan",
    label: "plan",
    x: 265,
    y: 130,
    kind: "agent",
    tone: "ai",
    icon: Bot,
  },
  { id: "briefWrite", label: "brief_write", x: 390, y: 130, kind: "brief", tone: "neutral" },
  {
    id: "write",
    label: "write",
    x: 515,
    y: 130,
    kind: "agent",
    tone: "ai",
    icon: FileText,
  },
  {
    id: "build",
    label: "build",
    x: 650,
    y: 130,
    kind: "fn",
    tone: "cloud",
    icon: Hammer,
  },
  { id: "briefFix", label: "brief_fix", x: 730, y: 255, kind: "brief", tone: "neutral" },
  {
    id: "fix",
    label: "fix",
    x: 570,
    y: 255,
    kind: "agent",
    tone: "ai",
    icon: Wrench,
  },
  { id: "finish", label: "finish", x: 820, y: 55, kind: "end", tone: "cost" },
  { id: "giveUp", label: "give_up", x: 820, y: 215, kind: "end", tone: "hostile" },
];

// The token's route: the main row, the fix loop, then the end.
const TOKEN_PATH = "M40 130 H650 L730 255 H570 L650 130 L820 55";

const EDGES = {
  main: "M40 130 H650",
  fixOut: "M650 130 L730 255",
  fixMid: "M730 255 H570",
  fixBack: "M570 255 L650 130",
  ok: "M650 130 L820 55",
  fail: "M650 130 L820 215",
};

// The same graph, upright, for a phone: the main row runs down, the fix loop goes
// off to the right, both ends sit at the bottom. Same 14 s clock, same lit nodes;
// only the token's path changes.
const VERTICAL: Record<string, [number, number]> = {
  start: [100, 14],
  briefPlan: [100, 52],
  plan: [100, 104],
  briefWrite: [100, 158],
  write: [100, 210],
  build: [100, 290],
  briefFix: [232, 362],
  fix: [232, 242],
  finish: [52, 420],
  giveUp: [150, 420],
};

const V_TOKEN_PATH = "M100 14 V290 L232 362 V242 L100 290 L52 420";

const V_EDGES = {
  main: "M100 14 V290",
  fixOut: "M100 290 L232 362",
  fixMid: "M232 362 V242",
  fixBack: "M232 242 L100 290",
  ok: "M100 290 L52 420",
  fail: "M100 290 L150 420",
};

type Edges = typeof EDGES;

function Graph({
  edges,
  token,
  tags,
  notes,
  pos,
}: {
  edges: Edges;
  token: string;
  tags: [string, number, number][];
  /** The note under a node's label, by node id. */
  notes: Partial<Record<string, string>>;
  pos?: Record<string, [number, number]>;
}) {
  const vertical = pos !== undefined;
  return (
    <>
      <svg
        className={styles.graphSvg}
        viewBox={vertical ? "0 0 300 460" : "0 0 920 320"}
        style={vertical ? { width: 300, height: 460 } : undefined}
        aria-hidden="true"
      >
        <path d={edges.main} className={styles.edge} />
        <path d={edges.fixOut} className={styles.edge} />
        <path d={edges.fixMid} className={styles.edge} />
        <path d={edges.fixBack} className={styles.edge} />
        <path d={edges.ok} className={styles.edge} />
        <path d={edges.fail} className={cx(styles.edge, styles.edgeDashed)} />
        <path d={edges.fixOut} className={cx(styles.edgeHot, styles.hotFix)} />
        <path d={edges.fixMid} className={cx(styles.edgeHot, styles.hotFix)} />
        <path d={edges.fixBack} className={cx(styles.edgeHot, styles.hotFix)} />
        <path d={edges.ok} className={cx(styles.edgeHot, styles.hotOk)} />
      </svg>
      {tags.map(([label, left, top]) => (
        <span key={label} className={styles.routeTag} style={{ left, top }}>
          {label}
        </span>
      ))}
      {NODES.map((n) => {
        const [x, y] = pos?.[n.id] ?? [n.x, n.y];
        return (
          <div
            key={n.id}
            className={cx(
              styles.gnode,
              styles[`g_${n.kind}`],
              styles[`on_${n.id}`],
              vertical && n.id === "start" && styles.gStartSide,
              toneClass(n.tone),
            )}
            style={{ left: x, top: y }}
          >
            {n.kind === "end" ? (
              <>
                <span className={styles.gDot} />
                <span className={styles.gEndLabel}>{n.label}</span>
              </>
            ) : (
              <>
                <span className={styles.gLabel}>
                  {n.icon && <n.icon size={14} strokeWidth={1.4} />}
                  {n.label}
                </span>
                {notes[n.id] && <span className={styles.gNote}>{notes[n.id]}</span>}
              </>
            )}
          </div>
        );
      })}
      <span
        className={cx(styles.token, vertical && styles.tokenV)}
        style={{ offsetPath: `path("${token}")` }}
      />
    </>
  );
}

const COPY = {
  fr: {
    eyebrow: "Le workflow de la forge",
    title: "La forge : un graphe ADK, où le modèle n'a pas la main sur le build",
    caption: (
      <>
        Une génération typique, rejouée en boucle : le premier build échoue, le graphe prend la
        route <code>fix</code>, la correction passe, le graphe prend la route <code>ok</code>. La
        route <code>fail</code> n&apos;est prise qu&apos;au troisième échec. Les nœuds <code>brief_*</code>{" "}
        sont des fonctions : ils écrivent le seul message que l&apos;agent suivant verra.
      </>
    ),
    notes: {
      plan: "sortie structurée",
      write: "≈ 85 % du temps",
      build: "fonction · 3 essais au plus",
      fix: "profil de correction",
    },
    legend: [
      "agent LLM (ADK LlmAgent)",
      "fonction Python",
      "message préparé, sans historique",
      "route prise au troisième échec",
    ],
  },
  en: {
    eyebrow: "The forge workflow",
    title: "The forge: an ADK graph where the model has no say over the build",
    caption: (
      <>
        A typical generation, replayed in a loop: the first build fails, the graph takes the{" "}
        <code>fix</code> route, the fix passes, the graph takes the <code>ok</code> route. The{" "}
        <code>fail</code> route is only taken on the third failure. The <code>brief_*</code> nodes
        are functions: they write the only message the next agent will see.
      </>
    ),
    notes: {
      plan: "structured output",
      write: "≈ 85% of the time",
      build: "function · 3 tries max",
      fix: "fix profile",
    },
    legend: [
      "LLM agent (ADK LlmAgent)",
      "Python function",
      "prepared message, no history",
      "route taken on the third failure",
    ],
  },
  es: {
    eyebrow: "El workflow de la forja",
    title: "La forja: un grafo ADK donde el modelo no controla el build",
    caption: (
      <>
        Una generación típica, repetida en bucle: el primer build falla, el grafo toma la ruta{" "}
        <code>fix</code>, la corrección pasa y el grafo toma la ruta <code>ok</code>. La ruta{" "}
        <code>fail</code> solo se toma al tercer fallo. Los nodos <code>brief_*</code> son
        funciones: escriben el único mensaje que verá el siguiente agente.
      </>
    ),
    notes: {
      plan: "salida estructurada",
      write: "≈ 85\u00a0% del tiempo",
      build: "función · 3 intentos máx.",
      fix: "perfil de corrección",
    },
    legend: [
      "agente LLM (ADK LlmAgent)",
      "función Python",
      "mensaje preparado, sin historial",
      "ruta tomada al tercer fallo",
    ],
  },
  pt: {
    eyebrow: "O workflow da forja",
    title: "A forja: um grafo ADK em que o modelo não controla o build",
    caption: (
      <>
        Uma geração típica, repetida em loop: o primeiro build falha, o grafo toma a rota{" "}
        <code>fix</code>, a correção passa, o grafo toma a rota <code>ok</code>. A rota{" "}
        <code>fail</code> só é tomada na terceira falha. Os nós <code>brief_*</code> são funções:
        eles escrevem a única mensagem que o próximo agente verá.
      </>
    ),
    notes: {
      plan: "saída estruturada",
      write: "≈ 85% do tempo",
      build: "função · até 3 tentativas",
      fix: "perfil de correção",
    },
    legend: [
      "agente LLM (ADK LlmAgent)",
      "função Python",
      "mensagem preparada, sem histórico",
      "rota tomada na terceira falha",
    ],
  },
};

// Under 640 px, the upright graph and its token replace the wide one.
export function ForgeGraph({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  const legend = (
    <VizLegend
      items={[
        { label: t.legend[0], tone: "ai" },
        { label: t.legend[1], tone: "cloud" },
        { label: t.legend[2], tone: "neutral" },
        { label: t.legend[3], tone: "hostile", dashed: true },
      ]}
    />
  );
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.graphDesktop}>
        <Stage width={920} height={320}>
          <Graph
            edges={EDGES}
            token={TOKEN_PATH}
            notes={t.notes}
            tags={[
              ["ok", 735, 78],
              ["fail", 742, 170],
              ["fix", 704, 186],
            ]}
          />
        </Stage>
        {legend}
      </div>
      <div className={styles.graphMobileMotion}>
        <Stage width={300} height={460}>
          <Graph
            edges={V_EDGES}
            token={V_TOKEN_PATH}
            pos={VERTICAL}
            notes={t.notes}
            tags={[
              ["ok", 64, 362],
              ["fail", 140, 372],
              ["fix", 178, 334],
            ]}
          />
        </Stage>
        {legend}
      </div>
    </VizFigure>
  );
}

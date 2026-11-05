import {
  Bot,
  Coins,
  KeyRound,
  ListChecks,
  MousePointerClick,
  ShieldBan,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { cx } from "./cx";
import { type VizLocale, VizFigure, pickCopy, toneClass } from "./frame";
import plate from "./plate.module.css";
import styles from "./agent-contract.module.css";

// Icons of the five checks, in the order of COPY.guards.
const GUARD_ICONS = [ShieldBan, KeyRound, ListChecks, MousePointerClick, Coins];

const COPY = {
  fr: {
    eyebrow: "Avec des agents de code",
    title: "Qui décide, qui écrit, et ce qui vérifie",
    caption:
      "Les agents de code écrivent le code de poptoy ; l'architecture, le périmètre et les dépenses restent mes décisions. Entre les deux, des contrôles qui ne dépendent pas de l'agent : ce qu'il produit n'est accepté qu'après eux.",
    decide: { title: "Je décide", sig: "l'architecte" },
    write: { title: "L'agent écrit", sig: "les agents de code" },
    checks: "Les contrôles",
    decides: [
      ["L'architecture", "les zones de confiance, les invariants de sécurité, la stack"],
      ["Le périmètre", "ce qu'on reprend de Pocket, ce qu'on change, ce qu'on remet à plus tard"],
      ["L'argent", "chaque dépense chiffrée, puis validée, une à une"],
      ["La validation", "ce qui est livré, ce qui attend, ce qui part en ligne"],
    ],
    writes: [
      ["Le code", "backend, interfaces, app, infrastructure"],
      ["Les tests", "plus de 500 : pytest, Vitest, Flutter, OpenTofu"],
      ["Les notes de conception", "une par lot, et les décisions qu'il propose"],
      ["Les estimations", "avant toute action facturable"],
    ],
    guards: [
      [
        "Commandes encadrées",
        "confirmation avant une commande facturable, refus des commandes destructrices et de la lecture des identifiants",
      ],
      ["gitleaks", "recherche de secrets à chaque commit et à chaque push"],
      ["Lint, types, tests", "typage strict et tests, lus au code de sortie"],
      ["Parcours réels", "dans un vrai Chromium piloté par Playwright, à chaque lot"],
      ["Plafonds de coûts", "vérifiés par le code avant chaque appel facturé"],
    ],
  },
  en: {
    eyebrow: "With coding agents",
    title: "Who decides, who writes, and what checks",
    caption:
      "Coding agents write poptoy's code; the architecture, the scope and the spending remain my decisions. In between sit checks that do not depend on the agent: nothing it produces is accepted until it has passed them.",
    decide: { title: "I decide", sig: "the architect" },
    write: { title: "The agent writes", sig: "the coding agents" },
    checks: "The checks",
    decides: [
      ["The architecture", "trust zones, security invariants, the stack"],
      ["The scope", "what to take from Pocket, what to change, what to leave for later"],
      ["The money", "every expense estimated, then approved, one at a time"],
      ["Sign-off", "what ships, what waits, what goes live"],
    ],
    writes: [
      ["The code", "backend, interfaces, app, infrastructure"],
      ["The tests", "more than 500: pytest, Vitest, Flutter, OpenTofu"],
      ["The design notes", "one per milestone, and the decisions it proposes"],
      ["The estimates", "before any billable action"],
    ],
    guards: [
      [
        "Gated commands",
        "confirmation before a billable command; destructive commands and credential reads refused",
      ],
      ["gitleaks", "secret scanning on every commit and every push"],
      ["Lint, types, tests", "strict typing and tests, judged by their exit code"],
      ["Real browser runs", "in a real Chromium driven by Playwright, at every milestone"],
      ["Cost caps", "checked in code before every billed call"],
    ],
  },
  es: {
    eyebrow: "Con agentes de código",
    title: "Quién decide, quién escribe y qué verifica",
    caption:
      "Los agentes de código escriben el código de poptoy; la arquitectura, el alcance y el gasto siguen siendo decisiones mías. Entre ambos, controles que no dependen del agente: lo que produce solo se acepta después de pasarlos.",
    decide: { title: "Yo decido", sig: "el arquitecto" },
    write: { title: "El agente escribe", sig: "los agentes de código" },
    checks: "Los controles",
    decides: [
      ["La arquitectura", "las zonas de confianza, los invariantes de seguridad, el stack"],
      ["El alcance", "qué se toma de Pocket, qué se cambia, qué se deja para más adelante"],
      ["El dinero", "cada gasto estimado y luego aprobado, uno a uno"],
      ["La validación", "qué se entrega, qué espera, qué se pone en línea"],
    ],
    writes: [
      ["El código", "backend, interfaces, app, infraestructura"],
      ["Las pruebas", "más de 500: pytest, Vitest, Flutter, OpenTofu"],
      ["Las notas de diseño", "una por fase, y las decisiones que propone"],
      ["Las estimaciones", "antes de cualquier acción facturable"],
    ],
    guards: [
      [
        "Comandos controlados",
        "confirmación antes de un comando facturable; se rechazan los comandos destructivos y la lectura de credenciales",
      ],
      ["gitleaks", "búsqueda de secretos en cada commit y en cada push"],
      ["Lint, tipos, pruebas", "tipado estricto y pruebas, juzgados por su código de salida"],
      ["Recorridos reales", "en un Chromium real controlado por Playwright, en cada fase"],
      ["Topes de coste", "verificados por el código antes de cada llamada facturada"],
    ],
  },
  pt: {
    eyebrow: "Com agentes de código",
    title: "Quem decide, quem escreve e o que verifica",
    caption:
      "Os agentes de código escrevem o código do poptoy; a arquitetura, o escopo e os gastos continuam sendo decisões minhas. Entre os dois, controles que não dependem do agente: o que ele produz só é aceito depois de passar por eles.",
    decide: { title: "Eu decido", sig: "o arquiteto" },
    write: { title: "O agente escreve", sig: "os agentes de código" },
    checks: "Os controles",
    decides: [
      ["A arquitetura", "as zonas de confiança, as invariantes de segurança, a stack"],
      ["O escopo", "o que aproveitar do Pocket, o que mudar, o que deixar para depois"],
      ["O dinheiro", "cada gasto estimado, depois aprovado, um a um"],
      ["A validação", "o que é entregue, o que espera, o que vai para o ar"],
    ],
    writes: [
      ["O código", "backend, interfaces, app, infraestrutura"],
      ["Os testes", "mais de 500: pytest, Vitest, Flutter, OpenTofu"],
      ["As notas de design", "uma por fase, e as decisões que ele propõe"],
      ["As estimativas", "antes de qualquer ação faturável"],
    ],
    guards: [
      [
        "Comandos controlados",
        "confirmação antes de um comando faturável; recusa de comandos destrutivos e da leitura de credenciais",
      ],
      ["gitleaks", "busca de segredos a cada commit e a cada push"],
      ["Lint, tipos, testes", "tipagem estrita e testes, julgados pelo código de saída"],
      ["Fluxos reais", "em um Chromium de verdade controlado pelo Playwright, a cada fase"],
      ["Tetos de custo", "verificados pelo código antes de cada chamada faturada"],
    ],
  },
};

function Side({
  icon: Icon,
  title,
  sig,
  items,
  tone,
}: {
  icon: typeof UserRound;
  title: string;
  sig: string;
  items: string[][];
  tone: "creator" | "ai";
}) {
  return (
    <section className={cx(plate.block, styles.side, toneClass(tone))}>
      <header className={styles.head}>
        <Icon className={plate.icon} size={20} strokeWidth={1.35} aria-hidden="true" />
        <span>
          <span className={plate.name}>{title}</span>
          <span className={plate.sig}>{sig}</span>
        </span>
      </header>
      <ul className={styles.list}>
        {items.map(([k, v]) => (
          <li key={k}>
            <span className={styles.key}>{k}</span>
            <span className={styles.value}>{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Under 900 px the columns stack, and both links turn vertical with their dot
// still moving towards the checks.
export function AgentContract({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={cx(styles.cols, styles.motion)}>
        <Side
          icon={UserRound}
          title={t.decide.title}
          sig={t.decide.sig}
          items={t.decides}
          tone="creator"
        />

        <div className={styles.link} aria-hidden="true">
          <span className={styles.packet} />
        </div>

        <section className={cx(plate.frame, styles.contract)}>
          <span className={plate.frameTab}>
            <ShieldCheck size={16} strokeWidth={1.35} aria-hidden="true" />
            {t.checks}
          </span>
          <ul className={styles.guards}>
            {t.guards.map(([label, text], i) => {
              const Icon = GUARD_ICONS[i];
              return (
                <li key={label}>
                  <Icon className={plate.icon} size={16} strokeWidth={1.35} aria-hidden="true" />
                  <span>
                    <span className={cx(plate.sig, styles.guardName)}>{label}</span>
                    <span className={styles.value}>{text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className={cx(styles.link, styles.linkBack)} aria-hidden="true">
          <span className={styles.packet} />
        </div>

        <Side
          icon={Bot}
          title={t.write.title}
          sig={t.write.sig}
          items={t.writes}
          tone="ai"
        />
      </div>
    </VizFigure>
  );
}

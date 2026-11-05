import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  Gauge,
  HandCoins,
  MessageSquare,
  PowerOff,
  Unplug,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "./cx";
import {
  Badge,
  type Tone,
  type VizLocale,
  pickCopy,
  toneClass,
  VizFigure,
} from "./frame";
import styles from "./guard-rails.module.css";

// The six guardrails of ADR 0003 (tuned for one month by ADR 0022), sorted by when
// they act: before the spending, during it, or after the fact.
type When = "before" | "during" | "after";

// Layout of each guardrail; its text is in COPY.rails, in the same order.
const RAILS: { icon: LucideIcon; tone: Tone; when: When }[] = [
  { icon: MessageSquare, tone: "creator", when: "before" },
  { icon: PowerOff, tone: "neutral", when: "before" },
  { icon: HandCoins, tone: "cost", when: "during" },
  { icon: Gauge, tone: "cloud", when: "during" },
  { icon: BellRing, tone: "cloud", when: "after" },
  { icon: Unplug, tone: "hostile", when: "after" },
];

const WHENS: When[] = ["before", "during", "after"];

const COPY = {
  fr: {
    eyebrow: "Contrôle des dépenses",
    title: "Les garde-fous, rangés par le moment où ils agissent",
    caption:
      "Seuls les plafonds de l'application arrêtent une boucle qui s'emballe à temps. Le budget et la coupure de Google Cloud arrivent avec des heures de retard : ils bornent l'accident, ils ne l'empêchent pas.",
    when: { before: "Avant", during: "Pendant", after: "Après coup" },
    axis: ["instantané", "en retard"],
    rails: [
      {
        delay: "avant d'agir",
        title: "Annonce préalable",
        text: "Toute action facturable est chiffrée par l'agent, puis validée par moi.",
      },
      {
        delay: "par construction",
        title: "Rien de facturé au repos",
        text: "Postgres local en dev ; en ligne, min-instances=0 et une base arrêtée par défaut.",
      },
      {
        delay: "avant chaque appel",
        title: "Plafonds de l'application",
        text: "Le registre de coûts refuse l'appel suivant : 2 € par jour, 15 € par mois, forge et aigw ensemble.",
      },
      {
        delay: "prévu, impossible",
        title: "Quotas d'API",
        text: "Prévus pour borner la vitesse de dépense. Gemini 2.0 et suivants tournent sur une capacité partagée, sans quota par projet à abaisser.",
      },
      {
        delay: "quelques heures",
        title: "Budget et alertes",
        text: "Un budget mensuel, des alertes à 50, 90 et 100 % : un e-mail, rien de plus.",
      },
      {
        delay: "quelques heures",
        title: "Coupure automatique",
        text: "La facturation est détachée à 100 % du réel. Destructrice, donc en dernier recours.",
      },
    ],
  },
  en: {
    eyebrow: "Spending control",
    title: "The guardrails, sorted by when they act",
    caption:
      "Only the application's caps stop a runaway loop in time. Google Cloud's budget and kill switch arrive hours late: they limit the damage, they do not prevent it.",
    when: { before: "Before", during: "During", after: "After the fact" },
    axis: ["instant", "delayed"],
    rails: [
      {
        delay: "before acting",
        title: "Advance notice",
        text: "Every billable action is estimated by the agent, then approved by me.",
      },
      {
        delay: "by design",
        title: "Nothing billed at rest",
        text: "Local Postgres in dev; online, min-instances=0 and a database stopped by default.",
      },
      {
        delay: "before every call",
        title: "Application caps",
        text: "The cost ledger refuses the next call: €2 per day, €15 per month, forge and aigw combined.",
      },
      {
        delay: "planned, impossible",
        title: "API quotas",
        text: "Meant to bound the spending rate. Gemini 2.0 and later run on shared capacity, with no per-project quota to lower.",
      },
      {
        delay: "a few hours",
        title: "Budget and alerts",
        text: "A monthly budget, alerts at 50, 90 and 100%: an email, nothing more.",
      },
      {
        delay: "a few hours",
        title: "Kill switch",
        text: "Billing is detached at 100% of actual spend. Destructive, so a last resort.",
      },
    ],
  },
  es: {
    eyebrow: "Control del gasto",
    title: "Las salvaguardas, ordenadas según el momento en que actúan",
    caption:
      "Solo los topes de la aplicación detienen a tiempo un bucle desbocado. El presupuesto y el corte automático de Google Cloud llegan con horas de retraso: acotan el accidente, no lo impiden.",
    when: { before: "Antes", during: "Durante", after: "Después" },
    axis: ["instantáneo", "con retraso"],
    rails: [
      {
        delay: "antes de actuar",
        title: "Aviso previo",
        text: "El agente estima cada acción facturable y yo la apruebo.",
      },
      {
        delay: "por diseño",
        title: "Nada facturado en reposo",
        text: "Postgres local en desarrollo; en línea, min-instances=0 y una base de datos detenida por defecto.",
      },
      {
        delay: "antes de cada llamada",
        title: "Topes de la aplicación",
        text: "El registro de costes rechaza la llamada siguiente: 2\u00a0€ al día, 15\u00a0€ al mes, forja y aigw juntos.",
      },
      {
        delay: "previsto, imposible",
        title: "Cuotas de API",
        text: "Previstas para limitar la velocidad del gasto. Gemini 2.0 y posteriores funcionan con capacidad compartida, sin cuota por proyecto que reducir.",
      },
      {
        delay: "unas horas",
        title: "Presupuesto y alertas",
        text: "Un presupuesto mensual, alertas al 50, 90 y 100\u00a0%: un correo, nada más.",
      },
      {
        delay: "unas horas",
        title: "Corte automático",
        text: "La facturación se desvincula al 100\u00a0% del gasto real. Es destructivo: queda como último recurso.",
      },
    ],
  },
  pt: {
    eyebrow: "Controle de gastos",
    title: "As salvaguardas, organizadas pelo momento em que agem",
    caption:
      "Só os tetos da aplicação param a tempo um loop descontrolado. O orçamento e o corte automático do Google Cloud chegam com horas de atraso: eles limitam o acidente, não o impedem.",
    when: { before: "Antes", during: "Durante", after: "Depois" },
    axis: ["instantâneo", "atrasado"],
    rails: [
      {
        delay: "antes de agir",
        title: "Aviso prévio",
        text: "Toda ação faturável é estimada pelo agente e depois aprovada por mim.",
      },
      {
        delay: "por design",
        title: "Nada cobrado em repouso",
        text: "Postgres local em dev; online, min-instances=0 e um banco de dados parado por padrão.",
      },
      {
        delay: "antes de cada chamada",
        title: "Tetos da aplicação",
        text: "O registro de custos recusa a chamada seguinte: €\u00a02 por dia, €\u00a015 por mês, forja e aigw somados.",
      },
      {
        delay: "previsto, impossível",
        title: "Cotas de API",
        text: "Previstas para limitar a velocidade de gasto. O Gemini 2.0 e os seguintes rodam em capacidade compartilhada, sem cota por projeto para reduzir.",
      },
      {
        delay: "algumas horas",
        title: "Orçamento e alertas",
        text: "Um orçamento mensal, alertas em 50, 90 e 100%: um e-mail, nada mais.",
      },
      {
        delay: "algumas horas",
        title: "Corte automático",
        text: "O faturamento é desvinculado a 100% do gasto real. Destrutivo, por isso fica como último recurso.",
      },
    ],
  },
};

export function GuardRails({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  const rails = RAILS.map((r, i) => ({ ...r, ...t.rails[i] }));
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.cols}>
        {WHENS.map((when, c) => (
          <div key={when} className={styles.col}>
            <div className={styles.colHead}>
              <span className={styles.dot} data-when={when} />
              {t.when[when]}
            </div>
            {rails
              .filter((r) => r.when === when)
              .map((r, i) => (
                <div
                  key={r.title}
                  className={cx(styles.rail, toneClass(r.tone))}
                  style={
                    { "--d": `${String((c * 2 + i) * 120)}ms` } as CSSProperties
                  }
                >
                  <Badge icon={r.icon} tone={r.tone} size={20} />
                  <div>
                    <div className={styles.title}>{r.title}</div>
                    <div className={styles.delay}>{r.delay}</div>
                    <div className={styles.text}>{r.text}</div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className={styles.axis} aria-hidden="true">
        <span>{t.axis[0]}</span>
        <span className={styles.arrow} />
        <span>{t.axis[1]}</span>
      </div>
    </VizFigure>
  );
}

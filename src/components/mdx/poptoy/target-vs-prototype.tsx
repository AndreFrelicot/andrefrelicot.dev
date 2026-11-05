import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Database,
  KeyRound,
  Network,
  Package,
  Server,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "./cx";
import { Badge, type Tone, type VizLocale, VizFigure, pickCopy } from "./frame";
import styles from "./target-vs-prototype.module.css";

// What each architecture costs at rest, in dollars per month (milestone 8 note,
// section 12; ADR 0020). Bars are scaled to $35.
type Line = { icon: LucideIcon; cost: number; tone: Tone };

// Layout of each line; its label and amount are in COPY, in the same order.
const TARGET: Line[] = [
  { icon: Network, cost: 18, tone: "neutral" },
  { icon: Database, cost: 8, tone: "neutral" },
  { icon: Shield, cost: 6, tone: "neutral" },
  { icon: Cloud, cost: 3, tone: "neutral" },
];

const PROTO: Line[] = [
  { icon: Zap, cost: 0, tone: "cloud" },
  { icon: ShieldCheck, cost: 0, tone: "cloud" },
  { icon: Server, cost: 0, tone: "cloud" },
  { icon: Database, cost: 1.8, tone: "cost" },
  { icon: Package, cost: 0.25, tone: "cost" },
  { icon: KeyRound, cost: 0.2, tone: "cost" },
];

type Text = [label: string, shown: string];

const COPY = {
  fr: {
    eyebrow: "Au repos, par mois",
    title: "La cible de départ contre le prototype privé",
    caption:
      "Barres à l'échelle de 35 $. La cible coûtait environ 35 $ par mois avant le premier utilisateur. Le prototype tombe à environ 2,3 $, presque tout en stockage. Estimations faites à partir des pages de prix de Google, en dollars, pas encore comparées à la facture réelle.",
    target: { title: "Cible : une production", total: "≈ 35 $" },
    proto: { title: "Prototype : à l'arrêt au repos", total: "≈ 2,3 $" },
    targetLines: [
      ["Load balancer global", "≈ 18 $"],
      ["Cloud SQL toujours allumé", "≈ 8 $"],
      ["Cloud Armor (politique et règles)", "≈ 5 $ et plus"],
      ["Cloud CDN, IP réservées…", "à l'usage"],
    ] satisfies Text[],
    protoLines: [
      ["Cloudflare : DNS, TLS, Worker, pare-feu", "0"],
      ["IAP branché sur Cloud Run", "0"],
      ["Cloud Run, Tasks, Scheduler (au repos)", "0"],
      ["Cloud SQL arrêtée : le stockage", "≈ 1,8 $"],
      ["Artifact Registry (≈ 3 Go)", "≈ 0,25 $"],
      ["Secret Manager, Cloud Storage", "≈ 0,2 $"],
    ] satisfies Text[],
  },
  en: {
    eyebrow: "At rest, per month",
    title: "The original target versus the private prototype",
    caption:
      "Bars scaled to $35. The target cost about $35 a month before the first user. The prototype drops to about $2.30, almost all of it storage. Estimates based on Google's pricing pages, in dollars, not yet checked against the actual bill.",
    target: { title: "Target: a production setup", total: "≈ $35" },
    proto: { title: "Prototype: stopped at rest", total: "≈ $2.30" },
    targetLines: [
      ["Global load balancer", "≈ $18"],
      ["Cloud SQL always on", "≈ $8"],
      ["Cloud Armor (policy and rules)", "≈ $5 and up"],
      ["Cloud CDN, reserved IPs…", "usage-based"],
    ] satisfies Text[],
    protoLines: [
      ["Cloudflare: DNS, TLS, Worker, firewall", "0"],
      ["IAP attached to Cloud Run", "0"],
      ["Cloud Run, Tasks, Scheduler (at rest)", "0"],
      ["Stopped Cloud SQL: its storage", "≈ $1.80"],
      ["Artifact Registry (≈ 3 GB)", "≈ $0.25"],
      ["Secret Manager, Cloud Storage", "≈ $0.20"],
    ] satisfies Text[],
  },
  es: {
    eyebrow: "En reposo, al mes",
    title: "El objetivo inicial frente al prototipo privado",
    caption:
      "Barras a escala de 35\u00a0$. El objetivo costaba unos 35\u00a0$ al mes antes del primer usuario. El prototipo baja a unos 2,3\u00a0$, casi todo en almacenamiento. Estimaciones hechas a partir de las páginas de precios de Google, en dólares, aún sin comparar con la factura real.",
    target: { title: "Objetivo: un entorno de producción", total: "≈ 35\u00a0$" },
    proto: { title: "Prototipo: detenido en reposo", total: "≈ 2,3\u00a0$" },
    targetLines: [
      ["Balanceador de carga global", "≈ 18\u00a0$"],
      ["Cloud SQL siempre encendido", "≈ 8\u00a0$"],
      ["Cloud Armor (política y reglas)", "≈ 5\u00a0$ o más"],
      ["Cloud CDN, IP reservadas…", "según uso"],
    ] satisfies Text[],
    protoLines: [
      ["Cloudflare: DNS, TLS, Worker, cortafuegos", "0"],
      ["IAP conectado a Cloud Run", "0"],
      ["Cloud Run, Tasks, Scheduler (en reposo)", "0"],
      ["Cloud SQL detenido: el almacenamiento", "≈ 1,8\u00a0$"],
      ["Artifact Registry (≈ 3 GB)", "≈ 0,25\u00a0$"],
      ["Secret Manager, Cloud Storage", "≈ 0,2\u00a0$"],
    ] satisfies Text[],
  },
  pt: {
    eyebrow: "Em repouso, por mês",
    title: "O alvo inicial contra o protótipo privado",
    caption:
      "Barras na escala de US$\u00a035. O alvo custava cerca de US$\u00a035 por mês antes do primeiro usuário. O protótipo cai para cerca de US$\u00a02,30, quase tudo em armazenamento. Estimativas feitas a partir das páginas de preços do Google, em dólares, ainda não comparadas com a fatura real.",
    target: { title: "Alvo: um ambiente de produção", total: "≈ US$\u00a035" },
    proto: { title: "Protótipo: parado em repouso", total: "≈ US$\u00a02,30" },
    targetLines: [
      ["Load balancer global", "≈ US$\u00a018"],
      ["Cloud SQL sempre ligado", "≈ US$\u00a08"],
      ["Cloud Armor (política e regras)", "≈ US$\u00a05 ou mais"],
      ["Cloud CDN, IPs reservados…", "conforme o uso"],
    ] satisfies Text[],
    protoLines: [
      ["Cloudflare: DNS, TLS, Worker, firewall", "0"],
      ["IAP conectado ao Cloud Run", "0"],
      ["Cloud Run, Tasks, Scheduler (em repouso)", "0"],
      ["Cloud SQL parado: o armazenamento", "≈ US$\u00a01,80"],
      ["Artifact Registry (≈ 3 GB)", "≈ US$\u00a00,25"],
      ["Secret Manager, Cloud Storage", "≈ US$\u00a00,20"],
    ] satisfies Text[],
  },
};

function Column({
  title,
  total,
  lines,
  text,
  tone,
}: {
  title: string;
  total: string;
  lines: Line[];
  text: Text[];
  tone: Tone;
}) {
  return (
    <div className={styles.col}>
      <div className={styles.head}>
        <span className={styles.colTitle}>{title}</span>
        <span className={cx(styles.total, styles[tone])}>{total}</span>
      </div>
      <ul className={styles.lines}>
        {lines.map((l, i) => {
          const [label, shown] = text[i];
          return (
            <li key={label} className={styles.line}>
              <Badge icon={l.icon} tone={l.tone} size={18} />
              <div className={styles.lineBody}>
                <div className={styles.lineTop}>
                  <span>{label}</span>
                  <span className={styles.amount}>{shown}</span>
                </div>
                <div className={styles.track}>
                  <span
                    className={cx(styles.bar, styles[l.tone])}
                    style={
                      {
                        "--w": l.cost / 35,
                        "--d": `${String(i * 140)}ms`,
                      } as CSSProperties
                    }
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TargetVsPrototype({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.cols}>
        <Column
          title={t.target.title}
          total={t.target.total}
          lines={TARGET}
          text={t.targetLines}
          tone="neutral"
        />
        <div className={styles.vs} aria-hidden="true" />
        <Column
          title={t.proto.title}
          total={t.proto.total}
          lines={PROTO}
          text={t.protoLines}
          tone="cost"
        />
      </div>
    </VizFigure>
  );
}

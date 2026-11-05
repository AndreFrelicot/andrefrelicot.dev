import { Brain, FileSearch, Flag, Gavel, ScanText, type LucideIcon } from "lucide-react";
import { cx } from "./cx";
import { type Tone, type VizLocale, VizFigure, VizLegend, pickCopy, toneClass } from "./frame";
import styles from "./ai.module.css";

// The moderation passes (ADR 0013), the decision engine and the action ladder.
// The classifier is switched off by the moderation_llm switch.

// Layout of each pass; its text is in COPY.passes, in the same order.
const PASSES: { icon: LucideIcon; tone: Tone; off?: boolean }[] = [
  { icon: ScanText, tone: "cloud" },
  { icon: Brain, tone: "ai", off: true },
  { icon: FileSearch, tone: "hostile" },
  { icon: Flag, tone: "creator" },
];

// The action ladder; each effect is in COPY.effects, in the same order.
const ACTIONS: { name: string; tone: Tone }[] = [
  { name: "allow", tone: "cost" },
  { name: "age_restrict", tone: "cloud" },
  { name: "exclude_feed", tone: "cloud" },
  { name: "hold", tone: "hostile" },
  { name: "remove", tone: "hostile" },
];

const COPY = {
  fr: {
    eyebrow: "Modération",
    title: "Des passes produisent des signaux, une politique versionnée décide",
    caption:
      "Chaque signal porte une catégorie (onze dans la taxonomie), une sévérité, une confiance et un code motif. Le moteur garde les signaux au-dessus de la confiance minimale (0,5), applique l'action de la sévérité la plus haute, et ouvre un cas quand un humain doit voir. La politique est un fichier TOML immuable, activé en base comme un profil de génération.",
    passesHead: "Les passes",
    ladderHead: "L'échelle des actions",
    off: "coupé",
    passes: [
      {
        name: "1 · Règles",
        when: "à la demande, dans l'api",
        text: "listes et expressions de la politique, sur le prompt",
      },
      {
        name: "2 · Classifieur",
        when: "au début du job",
        text: "Gemini Flash-Lite en sortie structurée",
      },
      {
        name: "3 · Revue du gizmo",
        when: "après chaque version",
        text: "analyse statique, rapport du build, chaînes extraites",
      },
      { name: "Signalement", when: "à tout moment", text: "ce que dit un joueur" },
    ],
    engine: {
      name: "Moteur de décision",
      text: "politique v2, empreinte, journal d'audit",
      action: "→ une action",
      human: "→ un cas humain ?",
    },
    effects: ["diffusé", "18+", "jouable par lien", "masqué, en revue", "retiré"],
    legend: ["passe active, gratuite", "passe coupée (interrupteur moderation_llm)"],
  },
  en: {
    eyebrow: "Moderation",
    title: "Passes produce signals; a versioned policy decides",
    caption:
      "Each signal carries a category (eleven in the taxonomy), a severity, a confidence and a reason code. The engine keeps the signals above the minimum confidence (0.5), applies the action of the highest severity, and opens a case when a human needs to look. The policy is an immutable TOML file, activated in the database like a generation profile.",
    passesHead: "The passes",
    ladderHead: "The action ladder",
    off: "off",
    passes: [
      {
        name: "1 · Rules",
        when: "at request time, in the api",
        text: "the policy's lists and patterns, applied to the prompt",
      },
      {
        name: "2 · Classifier",
        when: "at the start of the job",
        text: "Gemini Flash-Lite with structured output",
      },
      {
        name: "3 · Gizmo review",
        when: "after every version",
        text: "static analysis, build report, extracted strings",
      },
      { name: "Report", when: "at any time", text: "what a player says" },
    ],
    engine: {
      name: "Decision engine",
      text: "policy v2, hash, audit log",
      action: "→ an action",
      human: "→ a human case?",
    },
    effects: ["distributed", "18+", "playable by link", "hidden, under review", "removed"],
    legend: ["active pass, free", "pass switched off (moderation_llm switch)"],
  },
  es: {
    eyebrow: "Moderación",
    title: "Las pasadas producen señales; una política versionada decide",
    caption:
      "Cada señal lleva una categoría (once en la taxonomía), una severidad, una confianza y un código de motivo. El motor conserva las señales por encima de la confianza mínima (0,5), aplica la acción de la severidad más alta y abre un caso cuando un humano debe revisarlo. La política es un archivo TOML inmutable, activado en la base de datos como un perfil de generación.",
    passesHead: "Las pasadas",
    ladderHead: "La escala de acciones",
    off: "apagado",
    passes: [
      {
        name: "1 · Reglas",
        when: "con la petición, en la api",
        text: "listas y expresiones de la política, sobre el prompt",
      },
      {
        name: "2 · Clasificador",
        when: "al inicio del job",
        text: "Gemini Flash-Lite con salida estructurada",
      },
      {
        name: "3 · Revisión del gizmo",
        when: "tras cada versión",
        text: "análisis estático, informe del build, cadenas extraídas",
      },
      { name: "Denuncia", when: "en cualquier momento", text: "lo que dice un jugador" },
    ],
    engine: {
      name: "Motor de decisión",
      text: "política v2, hash, registro de auditoría",
      action: "→ una acción",
      human: "→ ¿un caso humano?",
    },
    effects: ["difundido", "18+", "jugable por enlace", "oculto, en revisión", "retirado"],
    legend: ["pasada activa, gratuita", "pasada apagada (interruptor moderation_llm)"],
  },
  pt: {
    eyebrow: "Moderação",
    title: "Passadas produzem sinais; uma política versionada decide",
    caption:
      "Cada sinal traz uma categoria (onze na taxonomia), uma severidade, uma confiança e um código de motivo. O motor mantém os sinais acima da confiança mínima (0,5), aplica a ação da severidade mais alta e abre um caso quando um humano precisa ver. A política é um arquivo TOML imutável, ativado no banco de dados como um perfil de geração.",
    passesHead: "As passadas",
    ladderHead: "A escala de ações",
    off: "desligado",
    passes: [
      {
        name: "1 · Regras",
        when: "na requisição, na api",
        text: "listas e expressões da política, aplicadas ao prompt",
      },
      {
        name: "2 · Classificador",
        when: "no início do job",
        text: "Gemini Flash-Lite com saída estruturada",
      },
      {
        name: "3 · Revisão do gizmo",
        when: "após cada versão",
        text: "análise estática, relatório do build, strings extraídas",
      },
      { name: "Denúncia", when: "a qualquer momento", text: "o que um jogador diz" },
    ],
    engine: {
      name: "Motor de decisão",
      text: "política v2, hash, log de auditoria",
      action: "→ uma ação",
      human: "→ um caso humano?",
    },
    effects: ["distribuído", "18+", "jogável por link", "oculto, em revisão", "removido"],
    legend: ["passada ativa, gratuita", "passada desligada (interruptor moderation_llm)"],
  },
};

// Under 760 px the links stay, vertical, and their dot runs down from the passes
// to the engine, then from the engine to the action.
export function ModerationPasses({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure wide eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={cx(styles.modWrap, styles.modMotion)}>
        <div>
          <div className={styles.colHead}>{t.passesHead}</div>
          <div className={styles.modPasses}>
            {PASSES.map((p, i) => {
              const { name, when, text } = t.passes[i];
              return (
                <div
                  key={name}
                  className={cx(
                    styles.modPass,
                    toneClass(p.off ? "neutral" : p.tone),
                    p.off && styles.modOff,
                  )}
                >
                  <p.icon className={styles.modeIcon} size={18} strokeWidth={1.4} />
                  <div>
                    <div className={styles.modeName}>
                      {name} {p.off && <code className={styles.offTag}>{t.off}</code>}
                    </div>
                    <code className={styles.modeApi}>{when}</code>
                    <div className={styles.modeText}>{text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <span className={styles.modLink} aria-hidden="true">
          <span className={styles.modLinkDot} />
        </span>
        <div className={styles.modEngine}>
          <Gavel className={styles.modeIcon} size={20} strokeWidth={1.4} />
          <div className={styles.modeName}>{t.engine.name}</div>
          <div className={styles.modeText}>{t.engine.text}</div>
          <div className={styles.modOut}>
            <code>{t.engine.action}</code>
            <code>{t.engine.human}</code>
          </div>
        </div>
        <span className={styles.modLink} aria-hidden="true">
          <span className={styles.modLinkDot} />
        </span>
        <div>
          <div className={styles.colHead}>{t.ladderHead}</div>
          <div className={styles.modLadder}>
            {ACTIONS.map((a, i) => (
              <div key={a.name} className={cx(styles.modAction, toneClass(a.tone))}>
                <code>{a.name}</code>
                <span>{t.effects[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <VizLegend
        items={[
          { label: t.legend[0], tone: "cloud" },
          { label: t.legend[1], tone: "neutral", dashed: true },
        ]}
      />
    </VizFigure>
  );
}

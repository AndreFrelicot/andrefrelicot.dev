import clsx from "clsx";
import { Fragment } from "react";
import styles from "./pocket.module.css";
import {
  type Tone,
  type VizLocale,
  VizFigure,
  VizLegend,
  pickCopy,
} from "./frame";

type Event = {
  year: string;
  date: string;
  title: string;
  detail: string;
  tone: Tone;
  major?: boolean;
};

const COPY = {
  fr: {
    eyebrow: "Chronologie",
    title: "De Gizmo à Pocket",
    lanes: {
      create: "Atma Sciences et Gizmo",
      platform: "Meta et Pocket",
      runtime: "Le modèle Muse Spark",
    },
    caption:
      "Dates issues de Business Insider, TechCrunch, AlleyWatch, des annonces de Meta et des fiches des stores. La date de sortie de Gizmo n'est pas documentée plus précisément que « 2025 ».",
    events: [
      {
        year: "2024",
        date: "2024",
        title: "Atma Sciences est fondée",
        detail: "À New York, par d'anciens ingénieurs de Snapchat.",
        tone: "create",
      },
      {
        year: "2025",
        date: "3 févr. 2025",
        title: "Amorçage d'environ 5,5 M$",
        detail: "Tour mené par First Round Capital.",
        tone: "create",
      },
      {
        year: "2025",
        date: "2025",
        title: "Gizmo sort sur iOS et Android",
        detail: "Créer une mini-app depuis son téléphone, sans écrire de code.",
        tone: "create",
      },
      {
        year: "2026",
        date: "5 mars 2026",
        title: "Meta recrute l'équipe",
        major: true,
        detail:
          "Licence non exclusive sur la technologie ; l'équipe rejoint Meta Superintelligence Labs.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "8 avr. 2026",
        title: "Muse Spark",
        detail: "Premier modèle du laboratoire, multimodal.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "29 juin 2026",
        title: "Pocket: Make Gizmos apparaît sur les stores",
        major: true,
        detail: "Au Brésil seulement, sans annonce.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "2 juil. 2026",
        title: "La presse le repère",
        detail: "Gizmo compte alors 635 000 installations cumulées.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "9 juil. 2026",
        title: "Muse Spark 1.1",
        detail: "API publique en préversion, contexte d'un million de tokens.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "20 août 2026",
        title: "Déploiement aux États-Unis",
        major: true,
        detail: "Le même jour, Atma annonce qu'elle cesse son activité.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "2 sept. 2026",
        title: "Muse Spark 1.3",
        detail: "Progrès sur le code et les tâches d'agent.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "11 oct. 2026",
        title: "Version 33, plus de 50 000 installations Android",
        detail: "Date des captures de cet article.",
        tone: "platform",
      },
    ] satisfies Event[],
  },
  en: {
    eyebrow: "Timeline",
    title: "From Gizmo to Pocket",
    lanes: {
      create: "Atma Sciences and Gizmo",
      platform: "Meta and Pocket",
      runtime: "The Muse Spark model",
    },
    caption:
      "Dates from Business Insider, TechCrunch, AlleyWatch, Meta's announcements and the store listings. Gizmo's release date is not documented any more precisely than “2025.”",
    events: [
      {
        year: "2024",
        date: "2024",
        title: "Atma Sciences is founded",
        detail: "In New York, by former Snapchat engineers.",
        tone: "create",
      },
      {
        year: "2025",
        date: "Feb 3, 2025",
        title: "Seed round of about $5.5M",
        detail: "Round led by First Round Capital.",
        tone: "create",
      },
      {
        year: "2025",
        date: "2025",
        title: "Gizmo launches on iOS and Android",
        detail: "Create a mini-app from your phone, without writing code.",
        tone: "create",
      },
      {
        year: "2026",
        date: "Mar 5, 2026",
        title: "Meta hires the team",
        major: true,
        detail:
          "Non-exclusive license to the technology; the team joins Meta Superintelligence Labs.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "Apr 8, 2026",
        title: "Muse Spark",
        detail: "The lab's first model, multimodal.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "Jun 29, 2026",
        title: "Pocket: Make Gizmos appears in the app stores",
        major: true,
        detail: "In Brazil only, with no announcement.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "Jul 2, 2026",
        title: "The press spots it",
        detail: "Gizmo has 635,000 lifetime installs at that point.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "Jul 9, 2026",
        title: "Muse Spark 1.1",
        detail: "Public API in preview, one-million-token context.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "Aug 20, 2026",
        title: "US rollout",
        major: true,
        detail: "The same day, Atma announces it is shutting down.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "Sep 2, 2026",
        title: "Muse Spark 1.3",
        detail: "Gains on coding and agentic tasks.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "Oct 11, 2026",
        title: "Version 33, more than 50,000 Android installs",
        detail: "Date of this article's captures.",
        tone: "platform",
      },
    ] satisfies Event[],
  },
  pt: {
    eyebrow: "Cronologia",
    title: "Do Gizmo ao Pocket",
    lanes: {
      create: "Atma Sciences e Gizmo",
      platform: "Meta e Pocket",
      runtime: "O modelo Muse Spark",
    },
    caption:
      "Datas extraídas do Business Insider, do TechCrunch, do AlleyWatch, dos anúncios da Meta e das páginas das lojas de apps. A data de lançamento do Gizmo não está documentada com mais precisão do que “2025”.",
    events: [
      {
        year: "2024",
        date: "2024",
        title: "A Atma Sciences é fundada",
        detail: "Em Nova York, por ex-engenheiros do Snapchat.",
        tone: "create",
      },
      {
        year: "2025",
        date: "3 fev. 2025",
        title: "Rodada seed de cerca de US$ 5,5 milhões",
        detail: "Rodada liderada pela First Round Capital.",
        tone: "create",
      },
      {
        year: "2025",
        date: "2025",
        title: "O Gizmo chega ao iOS e ao Android",
        detail: "Criar um miniapp pelo telefone, sem escrever código.",
        tone: "create",
      },
      {
        year: "2026",
        date: "5 mar. 2026",
        title: "A Meta contrata a equipe",
        major: true,
        detail:
          "Licença não exclusiva sobre a tecnologia; a equipe passa a integrar o Meta Superintelligence Labs.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "8 abr. 2026",
        title: "Muse Spark",
        detail: "Primeiro modelo do laboratório, multimodal.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "29 jun. 2026",
        title: "O Pocket: Make Gizmos aparece nas lojas de apps",
        major: true,
        detail: "Apenas no Brasil, sem anúncio.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "2 jul. 2026",
        title: "A imprensa o descobre",
        detail: "O Gizmo tem então 635.000 instalações acumuladas.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "9 jul. 2026",
        title: "Muse Spark 1.1",
        detail: "API pública em preview, contexto de um milhão de tokens.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "20 ago. 2026",
        title: "Lançamento nos Estados Unidos",
        major: true,
        detail: "No mesmo dia, a Atma anuncia que está encerrando as atividades.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "2 set. 2026",
        title: "Muse Spark 1.3",
        detail: "Avanços em código e em tarefas de agente.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "11 out. 2026",
        title: "Versão 33, mais de 50.000 instalações no Android",
        detail: "Data das capturas deste artigo.",
        tone: "platform",
      },
    ] satisfies Event[],
  },
  es: {
    eyebrow: "Cronología",
    title: "De Gizmo a Pocket",
    lanes: {
      create: "Atma Sciences y Gizmo",
      platform: "Meta y Pocket",
      runtime: "El modelo Muse Spark",
    },
    caption:
      "Fechas procedentes de Business Insider, TechCrunch, AlleyWatch, los anuncios de Meta y las fichas de las tiendas de aplicaciones. La fecha de lanzamiento de Gizmo no está documentada con más precisión que «2025».",
    events: [
      {
        year: "2024",
        date: "2024",
        title: "Se funda Atma Sciences",
        detail: "En Nueva York, por antiguos ingenieros de Snapchat.",
        tone: "create",
      },
      {
        year: "2025",
        date: "3 feb. 2025",
        title: "Ronda semilla de unos 5,5 millones de dólares",
        detail: "Ronda liderada por First Round Capital.",
        tone: "create",
      },
      {
        year: "2025",
        date: "2025",
        title: "Gizmo llega a iOS y Android",
        detail: "Crear una miniapp desde el teléfono, sin escribir código.",
        tone: "create",
      },
      {
        year: "2026",
        date: "5 mar. 2026",
        title: "Meta contrata al equipo",
        major: true,
        detail:
          "Licencia no exclusiva sobre la tecnología; el equipo se incorpora a Meta Superintelligence Labs.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "8 abr. 2026",
        title: "Muse Spark",
        detail: "Primer modelo del laboratorio, multimodal.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "29 jun. 2026",
        title: "Pocket: Make Gizmos aparece en las tiendas de aplicaciones",
        major: true,
        detail: "Solo en Brasil, sin anuncio.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "2 jul. 2026",
        title: "La prensa lo detecta",
        detail: "Gizmo suma entonces 635.000 instalaciones acumuladas.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "9 jul. 2026",
        title: "Muse Spark 1.1",
        detail: "API pública en versión preliminar, contexto de un millón de tokens.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "20 ago. 2026",
        title: "Despliegue en Estados Unidos",
        major: true,
        detail: "El mismo día, Atma anuncia que cesa su actividad.",
        tone: "platform",
      },
      {
        year: "2026",
        date: "2 sept. 2026",
        title: "Muse Spark 1.3",
        detail: "Avances en código y en tareas de agente.",
        tone: "runtime",
      },
      {
        year: "2026",
        date: "11 oct. 2026",
        title: "Versión 33, más de 50.000 instalaciones en Android",
        detail: "Fecha de las capturas de este artículo.",
        tone: "platform",
      },
    ] satisfies Event[],
  },
};

export function PocketTimeline({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <VizLegend
        items={[
          { label: t.lanes.create, tone: "create" },
          { label: t.lanes.platform, tone: "platform" },
          { label: t.lanes.runtime, tone: "runtime" },
        ]}
      />
      <div className={styles.timeline} role="list">
        {t.events.map((event, index) => (
          <Fragment key={event.date + event.title}>
            {event.year !== t.events[index - 1]?.year && (
              <div className={styles.tlYear} aria-hidden="true">
                {event.year}
              </div>
            )}
            <div
              role="listitem"
              className={clsx(styles.tlRow, styles[event.tone], event.major && styles.tlMajor)}
            >
              <div className={styles.tlDate}>{event.date}</div>
              <span className={styles.tlNode} />
              <div className={styles.tlCard}>
                <div className={styles.tlTitle}>{event.title}</div>
                <div className={styles.tlDetail}>{event.detail}</div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </VizFigure>
  );
}

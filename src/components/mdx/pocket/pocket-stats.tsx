import clsx from "clsx";
import styles from "./pocket.module.css";
import { type Tone, type VizLocale, VizFigure, pickCopy } from "./frame";

type Tile = { value: string; label: string; note: string; tone: Tone };

const COPY = {
  fr: {
    eyebrow: "Chiffres publics",
    title: "Ce qu'on peut mesurer de l'extérieur",
    caption:
      "Meta ne publie ni utilisateurs actifs, ni rétention, ni nombre de gizmos créés. Les installations iOS ne sont pas publiques.",
    tiles: [
      {
        value: "50 000+",
        label: "installations Android",
        note: "Google Play, 11 oct. 2026. La fiche affichait 10 000+ le 23 août.",
        tone: "platform",
      },
      {
        value: "635 000",
        label: "installations cumulées de Gizmo",
        note: "Appfigures, cité par TechCrunch le 2 juil. 2026.",
        tone: "create",
      },
      {
        value: "4,9 / 5",
        label: "note sur l'App Store américain",
        note: "Environ 1 600 évaluations, 11 oct. 2026.",
        tone: "platform",
      },
      {
        value: "≈ 5,5 M$",
        label: "levés par Atma avant Meta",
        note: "Amorçage de février 2025.",
        tone: "create",
      },
    ] satisfies Tile[],
  },
  en: {
    eyebrow: "Public numbers",
    title: "What can be measured from the outside",
    caption:
      "Meta does not publish active users, retention or the number of gizmos created. iOS installs are not public.",
    tiles: [
      {
        value: "50,000+",
        label: "Android installs",
        note: "Google Play, Oct 11, 2026. The listing showed 10,000+ on Aug 23.",
        tone: "platform",
      },
      {
        value: "635,000",
        label: "lifetime Gizmo installs",
        note: "Appfigures, cited by TechCrunch on Jul 2, 2026.",
        tone: "create",
      },
      {
        value: "4.9 / 5",
        label: "rating on the US App Store",
        note: "About 1,600 ratings, Oct 11, 2026.",
        tone: "platform",
      },
      {
        value: "≈ $5.5M",
        label: "raised by Atma before Meta",
        note: "Seed round, February 2025.",
        tone: "create",
      },
    ] satisfies Tile[],
  },
  pt: {
    eyebrow: "Números públicos",
    title: "O que dá para medir de fora",
    caption:
      "A Meta não publica usuários ativos, retenção nem número de gizmos criados. As instalações no iOS não são públicas.",
    tiles: [
      {
        value: "50.000+",
        label: "instalações no Android",
        note: "Google Play, 11 out. 2026. A página exibia 10.000+ em 23 de agosto.",
        tone: "platform",
      },
      {
        value: "635.000",
        label: "instalações acumuladas do Gizmo",
        note: "Appfigures, citada pelo TechCrunch em 2 jul. 2026.",
        tone: "create",
      },
      {
        value: "4,9 / 5",
        label: "nota na App Store dos Estados Unidos",
        note: "Cerca de 1.600 avaliações, 11 out. 2026.",
        tone: "platform",
      },
      {
        value: "≈ 5,5 mi",
        label: "de dólares levantados pela Atma antes da Meta",
        note: "Rodada seed de fevereiro de 2025.",
        tone: "create",
      },
    ] satisfies Tile[],
  },
  es: {
    eyebrow: "Cifras públicas",
    title: "Lo que se puede medir desde fuera",
    caption:
      "Meta no publica usuarios activos, ni retención, ni número de gizmos creados. Las instalaciones en iOS no son públicas.",
    tiles: [
      {
        value: "50.000+",
        label: "instalaciones en Android",
        note: "Google Play, 11 oct. 2026. La ficha mostraba 10.000+ el 23 de agosto.",
        tone: "platform",
      },
      {
        value: "635.000",
        label: "instalaciones acumuladas de Gizmo",
        note: "Appfigures, citado por TechCrunch el 2 jul. 2026.",
        tone: "create",
      },
      {
        value: "4,9 / 5",
        label: "valoración en App Store de EE. UU.",
        note: "Unas 1.600 valoraciones, 11 oct. 2026.",
        tone: "platform",
      },
      {
        value: "≈ 5,5 M",
        label: "de dólares captados por Atma antes de Meta",
        note: "Ronda semilla de febrero de 2025.",
        tone: "create",
      },
    ] satisfies Tile[],
  },
};

export function PocketStats({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.tiles}>
        {t.tiles.map((tile) => (
          <div key={tile.label} className={clsx(styles.tile, styles[tile.tone])}>
            <div className={styles.tileValue}>
              <span className={styles.hl}>{tile.value}</span>
            </div>
            <div className={styles.tileLabel}>{tile.label}</div>
            <div className={styles.tileNote}>{tile.note}</div>
          </div>
        ))}
      </div>
    </VizFigure>
  );
}

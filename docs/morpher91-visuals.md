# Visuels du devlog Morpher91 — français

Production du 5 septembre 2026. Intégration uniquement dans `src/content/fr/2026/morpher91-effet-special-1991-recode-webgpu.mdx`.

## Révision éditoriale v2

Les quatre schémas ont été redessinés avec `image_gen` intégré : personnages graphiques inspirés de Foxy, Bunny et Claire, accents menthe, filets fins, typographie plus discrète et bandes de frames pour expliquer l’horloge et le scrub. Les fichiers finaux portent le suffixe `-light-v2.png`. Les v1 restent disponibles pour comparaison ; la couverture et les captures réelles sont conservées.

Les [prompts v2 et leurs corrections](./morpher91-visuals-prompts-v2.json), les [prompts v1](./morpher91-visuals-prompts.json) et les [briefs des placeholders](./morpher91-visuals-placeholders.json) sont archivés. Les douze briefs sont à nouveau visibles directement sous leur image ou galerie ; le placeholder iPad reste à son emplacement. Les prompts actuels sont lisibles dans ces blocs et les anciens prompts dans des volets dépliables. **Ne pas supprimer ces textes lors du remplacement d’un visuel sans demande explicite.**

La proposition de logo montrée par André — renard orange / lapin bleu anguleux, repères menthe, fond noir — est retenue comme piste d’identité. Elle n’a pas été installée dans l’application dans cette révision.

Après réintégration des briefs, le temps de lecture affiché inclut ces textes de travail (51 minutes). Les 23 visuels actifs se chargent sans image cassée ; deux formules KaTeX et les blocs de code restent rendus. Les vérifications détaillées ci-dessous décrivent la première intégration ; les contrôles de build et de lint ont également réussi pour cette révision, avec les mêmes avertissements préexistants.

## Fichiers

Les 23 images finales sont dans [`public/images/2026/morpher91/`](../public/images/2026/morpher91/). Cinq illustrations ont été produites avec l’outil **image_gen intégré** ; les prompts et les sources sont conservés dans [`morpher91-visuals-prompts.json`](./morpher91-visuals-prompts.json). La couverture est une illustration conceptuelle, légendée comme telle. Les quatre schémas gardent leur fond blanc dans les deux thèmes.

Les dix-huit autres images sont de **vraies captures de Chromium**, prises sur le studio local à `http://localhost:5174/`, avec WebGPU actif et l’interface française. Aucun rendu ni aucune interface de ces captures n’a été généré ou retouché. Les captures cadrées proviennent directement du rectangle du canvas dans la page ; les galeries MDX les disposent côte à côte.

## Reproduire les captures

| Images | État du studio |
| --- | --- |
| `screenshot-four-methods-v1.png` | Preset « Comparer — quatre algorithmes », vue Comparer, τ = 2 s sur 4 s. |
| `screenshot-timeline-keyframes-v1.png` | « Marche — morph de corps entier », vue Triple, Menton sélectionné, τ = 3 s, inspecteur Images clés visible. |
| `screenshot-video-tracking-v1.png` | Même projet, τ = 2,5 s, commandes superposées masquées, repères conservés. |
| `mask-{final,debug}-{25,50,75}-v1.png` | « Masque peint — suivre le morph », calque peint sélectionné, vue Aperçu, τ = 1 / 2 / 3 s. Alterner Final et Masque sans changer le cadrage. |
| `transition-{standard,classicMorph}-{25,50,75}-v1.png` | « Transition — morph classique », vue Aperçu, Mesh et repères inchangés. Préréglages Standard puis Morph classique, τ = 1 / 2 / 3 s. Les rendus à 50 % sont identiques, comme attendu. |
| `screenshot-contextual-guide-v1.png` | Preset de transition, ajout d’un calque utilisateur, Aide → « Opacité, fusion, clip et transition », étape 5/8. Le guide surligne la vraie section Transition. |
| `screenshot-push-{before,after}-v1.png` | « Contours — sculpter avec Pousser », vue Triple, contour sélectionné, outil K. Glisser la joue de Bunny de 10 px vers la droite et de 5 px vers le haut. Retour au contour initial vérifié après une seule annulation. |

L’accès CUA général ne recensait aucun navigateur ; les captures ont été prises avec le connecteur Chrome DevTools disponible. L’écriture directe des screenshots par ce connecteur refusait les chemins du projet : les octets PNG renvoyés par l’outil ont donc été enregistrés avec les outils de fichiers, sans transformation.

## Vérifications

- Les 23 images se chargent dans la page française, sans image cassée.
- Lecture visuelle des illustrations et des captures ; correction du titre du schéma des calques.
- Aperçu de la page en thèmes sombre et clair, galeries et légendes vérifiées ; les images restent agrandissables.
- Métadonnées de l’article présentes ; 26 minutes de lecture, deux formules KaTeX et quatre blocs de code rendus.
- `pnpm lint` : aucune erreur ; trois avertissements préexistants dans `share-menu.tsx`, `site-header.tsx` et `theme-toggle.tsx`.
- `pnpm build` : réussi, 70 pages exportées ; avertissement Turbopack existant sur le traçage de fichiers depuis `next.config.ts`.

## À compléter sur matériel réel

Le seul emplacement visuel conservé est celui de l’iPad. Il demande une photographie ou une capture de l’appareil réel ; une simulation Chromium ne démontrerait pas le fonctionnement dans Safari/WebKit sur iPad. Les consignes restent dans le Callout de l’article.

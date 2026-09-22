# 2brain — préparation des visuels et relecture locale

> Mise à jour du 22 septembre 2026 : la version active est désormais `src/content/fr/2026/2brain-second-cerveau-agentique-rag-convex.mdx`, visible sur `/fr/2026/09/2brain-second-cerveau-agentique-rag-convex/`. Le dossier `/Users/andre/code/andre-brain/docs/devlog-2brain/` conserve le texte, les PNG originaux, les WebP qualité 90 et tous les briefs et prompts. Les images publiques utilisent maintenant `ThemeImage` et `ScreenshotGallery` pour le zoom. Le statut ci-dessous décrit la préparation antérieure à cette intégration.

## Statut éditorial initial (historique)

- Le fichier `2brain-second-cerveau-rag-agents.fr.mdx` est le **brouillon français canonique** : les futures traductions partiront de cette version.
- Il reste dans `docs/` pendant la relecture. Tout fichier sous `src/content/` participe à la publication ; le site ne possède pas de drapeau de brouillon.
- Titre retenu : « 2brain : mon second cerveau agentique & RAG basé sur Convex ».
- Trois illustrations générées sur fond blanc sont intégrées aux emplacements prévus, avec légendes et notes de production repliables. Les visuels du graphe et de la consolidation sont explicitement conceptuels ; ils ne constituent pas des captures de l’application.
- Huit captures réelles fournies par André complètent le texte : parcours Chrome vers la note, graphe, édition Markdown, création de lien, accueil et consultation depuis ChatGPT web via MCP. Le détail de l’édition, du lien et de l’accueil reste repliable pour préserver une lecture courte.
- Conserver ces briefs et prompts après intégration des images. Les notes de production ne font pas partie du texte public.
- À la préparation de publication : régler les correspondances de langues et la canonicalisation du site. L’image de couverture est renseignée. Ne pas inventer des fichiers de traduction pour satisfaire le frontmatter.

## Série intégrée — 22 septembre 2026

À la demande d’André, les trois visuels ont été générés avec une direction claire, épurée et professionnelle : fond blanc, texte sombre, traits fins et accents bleu et vert sauge. L’outil utilisé est **imagegen intégré**, et non le modèle Google Imagen. Aucun fichier ni source privée n’a été transmis ; les prompts décrivent uniquement les concepts et l’architecture exposés dans l’article.

Les PNG originaux ont été copiés dans le projet en 1536 × 1024 pixels (environ 1,1 Mo chacun). Chaque image peut être ouverte en pleine taille depuis le brouillon. Les [prompts exacts et les chemins de génération](./2brain-visuels-prompts.json) sont conservés séparément.

| Emplacement | Fichier intégré | Nature |
| --- | --- | --- |
| Ouverture / couverture | `public/images/2026/2brain/graphe-et-notes.png` | Illustration conceptuelle des sources, concepts et projets |
| Après Convex | `public/images/2026/2brain/architecture-convex.png` | Schéma simplifié de l’architecture |
| Après Jev et le rêve | `public/images/2026/2brain/consolidation-validation.png` | Illustration conceptuelle des preuves et de la validation |

Les libellés et les liaisons principales ont été contrôlés visuellement. L’OCR est une fonction de l’application exécutée dans Convex, pas une fonctionnalité OCR native du BaaS ; la légende le précise. La génération des embeddings reste externe. Le schéma explique les échanges sans décrire toutes les garanties du protocole.

Les briefs initiaux ci-dessous sont conservés comme historique et pour préparer d’éventuelles captures réelles. La direction actuelle remplace leur fond ivoire par un fond blanc.

## Captures réelles — sélection et dédoublonnage

Onze fichiers initiaux ont été analysés, puis une nouvelle version de la première capture et une capture ChatGPT web ont été fournies. Les captures **5, 6, 7, 8 et 9 sont identiques pixel par pixel** ; seule la 5 est intégrée. Les originaux fournis n’ont été ni modifiés ni supprimés. Huit PNG ont été copiés sans recadrage, retouche, changement de couleur ou recompression dans `public/images/2026/2brain/screenshots/`.

La capture 1 est écartée : l’extension affiche une confirmation de capture d’un article Eiffage alors que l’onglet est sur Anthropic. Il peut s’agir d’une confirmation précédente ; l’image seule ne permet pas de conclure à une erreur d’ingestion. André a ensuite fourni une nouvelle capture avec une confirmation Anthropic cohérente : elle est intégrée en pleine largeur avant la galerie aperçu → note, sans retouche. Elle porte le numéro 12 dans le manifeste pour préserver l’historique.

| Capture fournie | Décision et emplacement | Fichier |
| --- | --- | --- |
| 1 initiale | Écartée : confirmation différente de la page courante ; remplacée par la nouvelle capture | Aucun |
| 1 refaite (12 dans le manifeste) | Pleine largeur après le paragraphe Chrome : capture et confirmation cohérente | `extension-capture-confirmee.png` |
| 2 | Galerie après le paragraphe sur Chrome : aperçu avant enregistrement | `extension-apercu.png` |
| 3 | Même galerie : note source avec URL, résumé et capture conservée | `note-source.png` |
| 4 | Bloc repliable après le graphe : édition Markdown et sélection à lier | `edition-markdown.png` |
| 5 | Même bloc : dialogue de choix de la cible du lien | `lier-une-entite.png` |
| 6 à 9 | Doublons exacts de la 5, exclus | Aucun |
| 10 | Après l’explication du graphe : vue réelle avec libellés masqués | `graphe-anonymise.png` |
| 11 | Bloc repliable après projets/tâches/workflows : accueil | `accueil-anonymise.png` |
| ChatGPT web (13 dans le manifeste) | Section agents, après le paragraphe MCP/CLI : résumé de la source Anthropic | `chatgpt-web-mcp.png` |

Chaque image s’ouvre en pleine résolution au clic. Les captures 10 et 11 conservent le masquage visible déjà présent dans les fichiers fournis ; les autres sont reproduites telles quelles. L’adresse du compte apparaît dans la barre latérale des captures 3 et 4. Les fonds de l’interface réelle sont conservés ; le fond blanc demandé pour les illustrations générées n’est pas appliqué aux screenshots.

Ces images documentent la capture, l’édition, les liens, le graphe, l’organisation et la consultation du cerveau depuis ChatGPT web. La capture ChatGPT montre deux appels d’outils et une réponse référençant la note Anthropic ; André précise que la connexion utilise MCP via un tunnel. Les appels étant repliés, leurs arguments et les passages retournés ne sont pas visibles. Il ne s’agit pas d’une session CLI. Les images ne montrent pas une exécution OCR, les workers en activité ni une proposition Review. Les légendes ne leur attribuent donc pas ces démonstrations. Le schéma de consolidation conserve sa mention « illustration conceptuelle ».

Le [manifeste des captures](./2brain-screenshots-manifest.json) conserve la correspondance entre les fichiers reçus, leurs dimensions, empreintes et destinations.

## Direction initiale et briefs conservés

Trois visuels suffisent : une vue du produit, une vue de son architecture et une preuve de son fonctionnement. Privilégier les **captures réelles** pour l’interface. Ne pas utiliser une image générée comme preuve d’une fonctionnalité.

Format cible : paysage, environ 1600 × 1000 pixels pour les captures et 1800 × 1100 pour le schéma. Vérifier les textes à la largeur d’affichage de l’article et sur mobile ; le zoom ne doit pas être nécessaire pour comprendre le message principal. Exports WebP pour l’article, PNG ou JPEG pour l’image sociale. Les noms ci-dessous sont proposés pour la future intégration, aucun fichier n’est attendu actuellement.

Utiliser un corpus public de démonstration ou le mode de présentation anonyme de 2brain pour la vue d’ensemble. Pour lire les preuves et le diff, préférer quelques sources publiques choisies. Recadrer la barre d’adresse et les informations de compte. Le mode anonyme masque visuellement les données : partager une capture raster, pas un export HTML. Aucune référence à Eiffage, à la candidature ou aux notes personnelles ne doit apparaître.

## Visuel 1 — Un cerveau consultable et relié

**Emplacement :** ouverture de l’article, avant le premier paragraphe. Cette capture peut également servir de couverture.

**Objectif :** montrer immédiatement le produit réalisé, les liens entre connaissances et la possibilité de consulter une note.

**À capturer :** le graphe réel, centré sur un petit ensemble lisible de notes, avec une note ouverte si l’interface permet ce cadrage. Choisir un sujet public de veille technique. Montrer deux ou trois catégories reconnaissables et quelques liens ; éviter un graphe global réduit à un nuage de points. Si les deux vues ne tiennent pas ensemble, réaliser un montage clairement composé de deux captures du même parcours.

**Légende proposée :** « Sources, concepts et projets reliés dans 2brain ; chaque idée reste accessible depuis ses notes. »

**Texte alternatif :** « Graphe de connaissances de 2brain et détail d’une note reliée à ses sources. »

**Fichier prévu :** `public/images/2026/2brain/graphe-et-note.webp`.

**Prompt Imagen — uniquement pour un fond de composition facultatif :**

> Créer un fond éditorial minimaliste pour accompagner une capture réelle d’un outil de connaissance personnel. Format paysage 16:10, rendu net à 1600 pixels de large. Fond ivoire très clair, grille technique extrêmement discrète, quelques petits nœuds reliés en bleu ardoise et vert sauge sur les marges. Laisser les 85 % centraux entièrement libres et uniformes pour insérer ensuite une vraie capture d’écran. Style sobre de carnet d’ingénierie contemporain, lignes fines, contraste doux. Aucun texte, aucun logo, aucune interface inventée, aucun cerveau anatomique, aucun robot, aucun effet holographique. Le décor doit rester secondaire et ne suggérer aucune fonctionnalité.

**Assemblage :** ajouter la capture après génération, sans la redessiner avec Imagen. Une capture seule est préférable si le fond nuit à la lisibilité.

## Visuel 2 — Convex au centre, plusieurs interfaces et des workers

**Emplacement :** entre « Convex pour expérimenter vite » et « Des agents intégrés à un système observable ».

**Objectif :** comprendre en quelques secondes les responsabilités du backend et des workers, ainsi que l’accès partagé à la connaissance.

**Contenu exact à représenter :**

- À gauche, quatre entrées : « Extension Chrome », « Interface web React », « CLI » et « Assistants via MCP ».
- Au centre, un bloc principal « Convex — BaaS », contenant « Base documentaire ACID », « Stockage de fichiers », « Index vectoriels + full-text », « Backend TypeScript réactif » et « Workflows / jobs ». Les notes et les relations du graphe vivent dans la base documentaire ; ne pas représenter une base de données graphe distincte.
- À droite, « Workers externes » avec « Extraction » et « Traitements IA », connecté à « Claude / Codex ».
- Sous Convex, « Services IA » avec « Embeddings / reranking » et « Jev via OpenRouter ».
- Relier les interfaces au backend. Entre Convex et les workers, montrer deux flèches : « Abonnement aux jobs » vers les workers, « Progression / résultats » vers Convex. Ajouter une flèche de Convex vers l’interface React, intitulée « Mises à jour temps réel ». Relier Convex aux services IA et les workers à Claude / Codex.
- En pied de figure, un petit parcours distinct : « Capturer → Retrouver → Répondre avec des sources → Proposer → Valider ».

Cette vue est simplifiée : ne pas représenter une connexion directe de l’extension aux modèles, ni tous les appels IA comme passant nécessairement par les workers. Les workers externes ne sont pas des Cloudflare Workers. La validation humaine est celle des propositions de consolidation, pas une étape obligatoire de chaque réponse RAG.

L’OCR Tesseract.js tourne dans une action Node.js de Convex, avec suivi par workflow : ne pas le placer dans les workers externes. Ajouter une petite annotation « OCR images / PDF » à la ligne « Workflows / jobs » du bloc Convex. Cette précision s’applique également au prompt Imagen ci-dessous.

**Légende proposée :** « Convex réunit données, fichiers, recherche et backend réactif. Les workers s’abonnent aux jobs ; leur progression enregistrée dans Convex se reflète en temps réel dans l’interface. »

**Texte alternatif :** « Architecture de 2brain : Chrome, web, CLI et MCP accèdent à Convex, relié aux workers externes et aux services IA. »

**Fichier prévu :** `public/images/2026/2brain/architecture.webp`.

**Prompt Imagen — maquette du schéma :**

> Concevoir une infographie technique éditoriale en français, paysage 18:11, fond ivoire, typographie sans serif très lisible, traits fins bleu ardoise et accents vert sauge. Mise en page en trois colonnes avec beaucoup d’espace. À gauche quatre cartes empilées : « Extension Chrome », « Interface web React », « CLI », « Assistants via MCP ». Au centre une grande carte « Convex — BaaS », avec cinq lignes « Base documentaire ACID », « Stockage de fichiers », « Index vectoriels + full-text », « Backend TypeScript réactif », « Workflows / jobs », avec une petite annotation « OCR images / PDF » sous cette dernière ligne. À droite une carte « Workers externes », contenant « Extraction » et « Traitements IA », reliée à une petite carte « Claude / Codex ». Sous la carte centrale, une carte « Services IA » contenant « Embeddings / reranking » et « Jev via OpenRouter ». Relier les quatre cartes de gauche à Convex. Une flèche de Convex vers les workers porte « Abonnement aux jobs », une flèche retour porte « Progression / résultats ». Une flèche de Convex vers Interface web React porte « Mises à jour temps réel ». Relier Convex à Services IA. Ne tracer aucune autre liaison. En bas, une bande séparée montre « Capturer → Retrouver → Répondre avec des sources → Proposer → Valider ». Rendu plat, précis, professionnel, sans perspective, sans personnages, sans cerveau, sans logos de marques. Hiérarchie claire et textes courts. Le schéma doit rester lisible à 900 pixels de large.

**Contrôle après génération :** vérifier chaque libellé et chaque flèche. Si Imagen déforme le texte ou ajoute des liaisons, reprendre la composition dans un outil vectoriel et exporter le schéma corrigé. Le prompt ne remplace pas la validation de l’architecture.

## Visuel 3 — Une proposition explicable avant validation

**Emplacement :** à la fin de « Jev et le “rêve” », avant le dernier paragraphe.

**Objectif :** montrer ce que produit réellement la consolidation et comment l’utilisateur garde la main.

**À capturer :** dans Review, une proposition réelle sur un sujet public de veille, avec la section avant/après et les passages justificatifs dépliés. Garder visibles les commandes de validation et de refus. Choisir une modification courte dont l’intérêt se comprend sans lire toute la fiche. Si possible montrer la couverture des sources et le coût, mais uniquement s’ils sont lisibles et effectivement disponibles. Ne pas inventer une valeur absente.

Si l’écran est trop dense, faire deux recadrages du même exemple : le changement proposé et ses preuves. Ajouter ensuite deux repères éditoriaux discrets, « Proposition » et « Sources », sans masquer l’interface ni donner l’impression que ces repères appartiennent au produit.

**Légende proposée :** « Le cycle de consolidation propose des changements justifiés par des sources. Je les examine avant de les appliquer. »

**Texte alternatif :** « Proposition de consolidation dans Review, avec différences avant/après, extraits sources et commandes de validation. »

**Fichier prévu :** `public/images/2026/2brain/consolidation-review.webp`.

**Prompt Imagen — fond facultatif pour assembler les deux recadrages :**

> Créer un gabarit éditorial vide au format paysage 16:10 pour accueillir deux captures réelles d’une application. Fond ivoire, grand emplacement rectangulaire neutre occupant 60 % de la largeur à gauche, second emplacement de 30 % à droite, alignés verticalement, marges généreuses. Bordures fines bleu ardoise, léger accent vert sauge reliant visuellement les deux zones. Laisser les deux emplacements totalement vides ; les captures et leurs annotations seront ajoutées après génération. Style sobre et précis, sans texte, sans logo, sans fausse interface, sans statistiques ni icônes de validation. Aucun élément ne doit simuler le résultat d’un agent IA.

Une capture réelle recadrée reste le premier choix ; le fond généré est seulement une possibilité de mise en page.

## Option seulement si nécessaire — la capture Chrome

Si le parcours d’entrée manque à la relecture, ajouter une petite capture réelle de l’extension ouverte sur une page publique, avec une consigne courte telle que « Compare cet article aux sources de mon projet de veille ». Ne pas ajouter un quatrième grand visuel par défaut. Aucun prompt Imagen n’est nécessaire : il faut montrer l’extension existante.

## Repères factuels pour la relecture

- Le gain de MRR (0,771 → 0,822, 33 questions) est une mesure historique du jeu interne, documentée dans le dépôt 2brain, `docs/DECISIONS.md`, entrée du 4 septembre 2026 sur le reranker. Ce n’est ni un taux d’exactitude des réponses ni une mesure de charge en entreprise.
- Le statut de Jev et du rêve s’appuie sur l’acceptation du pilote manuel du 19 septembre 2026 dans ce même journal. La qualification humaine complète et l’automatisation ne sont pas revendiquées.
- Le texte présente une réalisation TypeScript / React / Convex. Il ne revendique pas de réalisation Python, GCP ou ADK sur ce projet.
- La mention « sans fichiers locaux » concerne la source de vérité des notes et leur accès courant ; elle n’exclut ni les pièces jointes ni les exports Markdown.
- L’OCR est documenté dans le dépôt 2brain, `docs/ATTACHMENTS-OCR.md`, et dans la livraison du 22 septembre 2026 de `docs/PLAN.md` : images/PDF, Tesseract.js français/anglais dans Convex, extraction explicite et indexation avec provenance document-page. Il s’agit de reconnaissance de texte, pas de description d’images par un modèle de vision.
- Les fonctionnalités intégrées de Convex ont été vérifiées dans la documentation officielle : [base et réactivité](https://docs.convex.dev/understanding/overview), [stockage de fichiers](https://docs.convex.dev/file-storage/overview), [recherche vectorielle](https://docs.convex.dev/search/vector-search) et [recherche full-text](https://docs.convex.dev/search/text-search). Les garanties ACID concernent les transactions de base de données, pas l’ensemble d’un workflow incluant des appels externes. La recherche vectorielle s’exécute dans une action ; les abonnements évoqués dans l’article portent sur les queries des jobs et de l’interface.

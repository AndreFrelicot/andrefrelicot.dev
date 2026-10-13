import clsx from "clsx";
import styles from "./pocket.module.css";
import { type VizLocale, VizFigure, pickCopy } from "./frame";
import { Icon } from "./icons";

const COPY = {
  fr: {
    eyebrow: "Schéma de l'API",
    title: "Ce que le feed sait, et ce que chaque gizmo transporte",
    caption:
      "Champs lus dans les descripteurs protobuf embarqués dans le JavaScript public de l'application web (services.feed.FeedService). Le schéma dit ce qui est prévu, pas comment le classement s'en sert.",
    request: {
      name: "L'app envoie",
      sig: "FetchRankedItemsRequest",
      items: [
        "Permissions caméra et micro de l'appareil",
        "Gizmos vus récemment, avec l'heure",
        "Identifiant de session",
      ],
    },
    response: {
      name: "Le classement répond",
      sig: "FetchRankedItemsResponse",
      items: [
        "Une liste ordonnée de gizmos",
        "Un mode : personnalisé ou non personnalisé",
        "Un identifiant de requête de classement",
      ],
    },
    item: {
      name: "Chaque gizmo porte",
      sig: "FeedItem",
      countersLabel: "Sept compteurs",
      counters: [
        ["like_count", "likes"],
        ["comment_count", "commentaires"],
        ["remix_count", "remixes"],
        ["share_count", "partages"],
        ["view_count", "vues"],
        ["repost_count", "reposts"],
        ["playlist_count", "playlists"],
      ],
      capabilitiesLabel: "Capacités inférées",
      capabilities: ["caméra", "micro", "audio"],
      attributionLabel: "Attributions et statut",
      attributions: [
        "Remix : le gizmo et l'auteur d'origine",
        "Musique : titre, artiste, contenu explicite",
        "Statut de modération et restriction d'âge",
      ],
    },
  },
  en: {
    eyebrow: "API schema",
    title: "What the feed knows, and what each gizmo carries",
    caption:
      "Fields read from the protobuf descriptors embedded in the web app's public JavaScript (services.feed.FeedService). The schema says what is provided for, not how the ranking uses it.",
    request: {
      name: "The app sends",
      sig: "FetchRankedItemsRequest",
      items: [
        "The device's camera and microphone permissions",
        "Recently viewed gizmos, with timestamps",
        "Session identifier",
      ],
    },
    response: {
      name: "The ranking responds",
      sig: "FetchRankedItemsResponse",
      items: [
        "An ordered list of gizmos",
        "A mode: personalized or non-personalized",
        "A ranking request identifier",
      ],
    },
    item: {
      name: "Each gizmo carries",
      sig: "FeedItem",
      countersLabel: "Seven counters",
      counters: [
        ["like_count", "likes"],
        ["comment_count", "comments"],
        ["remix_count", "remixes"],
        ["share_count", "shares"],
        ["view_count", "views"],
        ["repost_count", "reposts"],
        ["playlist_count", "playlists"],
      ],
      capabilitiesLabel: "Inferred capabilities",
      capabilities: ["camera", "microphone", "audio"],
      attributionLabel: "Attributions and status",
      attributions: [
        "Remix: the original gizmo and its author",
        "Music: title, artist, explicit content",
        "Moderation status and age restriction",
      ],
    },
  },
  pt: {
    eyebrow: "Esquema da API",
    title: "O que o feed sabe, e o que cada gizmo carrega",
    caption:
      "Campos lidos nos descritores protobuf embutidos no JavaScript público da aplicação web (services.feed.FeedService). O esquema diz o que está previsto, não como o ranqueamento usa isso.",
    request: {
      name: "O app envia",
      sig: "FetchRankedItemsRequest",
      items: [
        "Permissões de câmera e microfone do aparelho",
        "Gizmos vistos recentemente, com o horário",
        "Identificador de sessão",
      ],
    },
    response: {
      name: "O ranqueamento responde",
      sig: "FetchRankedItemsResponse",
      items: [
        "Uma lista ordenada de gizmos",
        "Um modo: personalizado ou não personalizado",
        "Um identificador da requisição de ranqueamento",
      ],
    },
    item: {
      name: "Cada gizmo carrega",
      sig: "FeedItem",
      countersLabel: "Sete contadores",
      counters: [
        ["like_count", "curtidas"],
        ["comment_count", "comentários"],
        ["remix_count", "remixes"],
        ["share_count", "compartilhamentos"],
        ["view_count", "visualizações"],
        ["repost_count", "reposts"],
        ["playlist_count", "playlists"],
      ],
      capabilitiesLabel: "Capacidades inferidas",
      capabilities: ["câmera", "microfone", "áudio"],
      attributionLabel: "Atribuições e status",
      attributions: [
        "Remix: o gizmo e o autor originais",
        "Música: título, artista, conteúdo explícito",
        "Status de moderação e restrição de idade",
      ],
    },
  },
  es: {
    eyebrow: "Esquema de la API",
    title: "Lo que sabe el feed y lo que transporta cada gizmo",
    caption:
      "Campos leídos en los descriptores protobuf incluidos en el JavaScript público de la aplicación web (services.feed.FeedService). El esquema dice lo que está previsto, no cómo lo usa el ranking.",
    request: {
      name: "La app envía",
      sig: "FetchRankedItemsRequest",
      items: [
        "Permisos de cámara y micrófono del dispositivo",
        "Gizmos vistos recientemente, con la hora",
        "Identificador de sesión",
      ],
    },
    response: {
      name: "El ranking responde",
      sig: "FetchRankedItemsResponse",
      items: [
        "Una lista ordenada de gizmos",
        "Un modo: personalizado o no personalizado",
        "Un identificador de solicitud de ranking",
      ],
    },
    item: {
      name: "Cada gizmo lleva",
      sig: "FeedItem",
      countersLabel: "Siete contadores",
      counters: [
        ["like_count", "likes"],
        ["comment_count", "comentarios"],
        ["remix_count", "remixes"],
        ["share_count", "compartidos"],
        ["view_count", "vistas"],
        ["repost_count", "reposts"],
        ["playlist_count", "playlists"],
      ],
      capabilitiesLabel: "Capacidades inferidas",
      capabilities: ["cámara", "micrófono", "audio"],
      attributionLabel: "Atribuciones y estado",
      attributions: [
        "Remix: el gizmo y el autor originales",
        "Música: título, artista, contenido explícito",
        "Estado de moderación y restricción de edad",
      ],
    },
  },
};

export function PocketFeedSignals({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={styles.wire}>
        <div className={styles.wireStack}>
          {[
            { ...t.request, tone: "create" as const, icon: "request" as const },
            { ...t.response, tone: "platform" as const, icon: "ranking" as const },
          ].map((block, index) => (
            <div key={block.sig} className={styles.wireStack}>
              {index === 1 && (
                <div className={styles.wireLink} aria-hidden="true">
                  <span className={styles.token} />
                </div>
              )}
              <div className={clsx(styles.panel, styles[block.tone])}>
                <div className={styles.stepHead}>
                  <span className={styles.icon}>
                    <Icon name={block.icon} />
                  </span>
                  <div>
                    <div className={styles.name}>{block.name}</div>
                    <span className={styles.sig} style={{ marginTop: "0.2rem" }}>
                      {block.sig}
                    </span>
                  </div>
                </div>
                <div className={styles.items}>
                  {block.items.map((item) => (
                    <div key={item} className={styles.item}>
                      <span className={styles.bullet} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={clsx(styles.panel, styles.runtime)}>
          <div className={styles.stepHead}>
            <span className={styles.icon}>
              <Icon name="gizmo" />
            </span>
            <div>
              <div className={styles.name}>{t.item.name}</div>
              <span className={styles.sig} style={{ marginTop: "0.2rem" }}>
                {t.item.sig}
              </span>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>{t.item.countersLabel}</div>
            <div className={styles.counters}>
              {t.item.counters.map(([field, name]) => (
                <div key={field} className={styles.counter}>
                  <b>{field}</b>
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>{t.item.capabilitiesLabel}</div>
            <div className={styles.chips}>
              {t.item.capabilities.map((capability) => (
                <span key={capability} className={styles.chip}>
                  {capability}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>{t.item.attributionLabel}</div>
            <div className={styles.items}>
              {t.item.attributions.map((item) => (
                <div key={item} className={styles.item}>
                  <span className={styles.bullet} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VizFigure>
  );
}

import clsx from "clsx";
import styles from "./pocket.module.css";
import { type VizLocale, VizFigure, pickCopy } from "./frame";
import { Icon } from "./icons";

const COPY = {
  fr: {
    eyebrow: "Isolation",
    title: "Trois couches, un seul canal de sortie",
    caption:
      "En-têtes et attributs relevés les 11 et 13 octobre 2026 sur quatre gizmos publics. Chaque gizmo reçoit son propre sous-domaine, donc sa propre origine. L'identifiant est remplacé ici par un emplacement.",
    host: {
      name: "Page hôte",
      sub: "madewithpocket.com/p/… · Next.js, application « gizmo-web »",
    },
    bridge: { name: "pont postMessage", host: "hôte", gizmo: "gizmo" },
    frame: {
      name: "iframe isolée",
      sub: '<identifiant>-gizmo.fbsbx.com · sandbox="allow-scripts allow-same-origin"',
    },
    gizmo: {
      name: "Document gizmo",
      sub: "un seul fichier HTML : React, runtime, code généré",
    },
    allowedLabel: "Ce qui passe",
    allowed: [
      "Images, sons et polices servis par fbcdn.net",
      "Caméra, micro, gyroscope et accéléromètre, si l'hôte les accorde",
      "Scripts inline et eval, que la politique de sécurité laisse passer",
    ],
    blockedLabel: "Ce qui est bloqué",
    blocked: [
      "Tout appel réseau externe (connect-src limité à fbcdn.net)",
      "Ouverture directe de l'URL du gizmo : 404 hors de l'iframe",
      "Formulaires, pop-ups, navigation de la page parente",
      "Caméra sur la visionneuse web : la page hôte l'interdit",
    ],
  },
  en: {
    eyebrow: "Isolation",
    title: "Three layers, a single channel out",
    caption:
      "Headers and attributes recorded on October 11 and 13, 2026, on four public gizmos. Each gizmo gets its own subdomain, and therefore its own origin. The identifier is replaced here with a placeholder.",
    host: {
      name: "Host page",
      sub: "madewithpocket.com/p/… · Next.js, “gizmo-web” app",
    },
    bridge: { name: "postMessage bridge", host: "host", gizmo: "gizmo" },
    frame: {
      name: "Sandboxed iframe",
      sub: '<id>-gizmo.fbsbx.com · sandbox="allow-scripts allow-same-origin"',
    },
    gizmo: {
      name: "Gizmo document",
      sub: "a single HTML file: React, runtime, generated code",
    },
    allowedLabel: "What gets through",
    allowed: [
      "Images, sounds and fonts served by fbcdn.net",
      "Camera, microphone, gyroscope and accelerometer, if the host grants them",
      "Inline scripts and eval, which the security policy lets through",
    ],
    blockedLabel: "What is blocked",
    blocked: [
      "Any external network call (connect-src limited to fbcdn.net)",
      "Opening the gizmo's URL directly: 404 outside the iframe",
      "Forms, pop-ups, navigating the parent page",
      "Camera in the web viewer: the host page forbids it",
    ],
  },
  pt: {
    eyebrow: "Isolamento",
    title: "Três camadas, um único canal de saída",
    caption:
      "Cabeçalhos e atributos registrados em 11 e 13 de outubro de 2026 em quatro gizmos públicos. Cada gizmo recebe seu próprio subdomínio e, portanto, sua própria origem. O identificador é substituído aqui por um placeholder.",
    host: {
      name: "Página host",
      sub: "madewithpocket.com/p/… · Next.js, aplicação “gizmo-web”",
    },
    bridge: { name: "ponte postMessage", host: "host", gizmo: "gizmo" },
    frame: {
      name: "iframe isolado",
      sub: '<identificador>-gizmo.fbsbx.com · sandbox="allow-scripts allow-same-origin"',
    },
    gizmo: {
      name: "Documento gizmo",
      sub: "um único arquivo HTML: React, runtime, código gerado",
    },
    allowedLabel: "O que passa",
    allowed: [
      "Imagens, sons e fontes servidos por fbcdn.net",
      "Câmera, microfone, giroscópio e acelerômetro, se o host os conceder",
      "Scripts inline e eval, que a política de segurança deixa passar",
    ],
    blockedLabel: "O que é bloqueado",
    blocked: [
      "Qualquer chamada de rede externa (connect-src limitado a fbcdn.net)",
      "Abertura direta da URL do gizmo: 404 fora do iframe",
      "Formulários, pop-ups, navegação da página pai",
      "Câmera no visualizador web: a página host a proíbe",
    ],
  },
  es: {
    eyebrow: "Aislamiento",
    title: "Tres capas, un único canal de salida",
    caption:
      "Cabeceras y atributos registrados el 11 y el 13 de octubre de 2026 en cuatro gizmos públicos. Cada gizmo recibe su propio subdominio y, por tanto, su propio origen. Aquí el identificador se sustituye por un marcador de posición.",
    host: {
      name: "Página anfitriona",
      sub: "madewithpocket.com/p/… · Next.js, aplicación «gizmo-web»",
    },
    bridge: { name: "puente postMessage", host: "anfitrión", gizmo: "gizmo" },
    frame: {
      name: "iframe aislado",
      sub: '<identificador>-gizmo.fbsbx.com · sandbox="allow-scripts allow-same-origin"',
    },
    gizmo: {
      name: "Documento gizmo",
      sub: "un único archivo HTML: React, runtime, código generado",
    },
    allowedLabel: "Lo que se permite",
    allowed: [
      "Imágenes, sonidos y fuentes servidos por fbcdn.net",
      "Cámara, micrófono, giroscopio y acelerómetro, si el anfitrión los concede",
      "Scripts inline y eval, que la política de seguridad deja pasar",
    ],
    blockedLabel: "Lo que se bloquea",
    blocked: [
      "Cualquier llamada de red externa (connect-src limitado a fbcdn.net)",
      "Apertura directa de la URL del gizmo: 404 fuera del iframe",
      "Formularios, pop-ups, navegación de la página padre",
      "Cámara en el visor web: la página anfitriona la prohíbe",
    ],
  },
};

export function PocketSandbox({ locale }: { locale?: VizLocale }) {
  const t = pickCopy(COPY, locale);
  return (
    <VizFigure eyebrow={t.eyebrow} title={t.title} caption={t.caption}>
      <div className={clsx(styles.layer, styles.platform)}>
        <span className={styles.layerTab}>
          <Icon name="globe" />
          {t.host.name}
        </span>
        <div className={styles.layerSub}>{t.host.sub}</div>
        <div className={styles.channel}>
          <span>{t.bridge.host}</span>
          <div className={styles.channelTrack} aria-hidden="true">
            <i />
            <i />
          </div>
          <span>{t.bridge.gizmo}</span>
          <span className={styles.channelName}>{t.bridge.name}</span>
        </div>
        <div className={clsx(styles.layer, styles.runtime)}>
          <span className={styles.layerTab}>
            <Icon name="lock" />
            {t.frame.name}
          </span>
          <div className={styles.layerSub}>{t.frame.sub}</div>
          <div className={clsx(styles.layer, styles.create)}>
            <span className={styles.layerTab}>
              <Icon name="document" />
              {t.gizmo.name}
            </span>
            <div className={styles.layerSub}>{t.gizmo.sub}</div>
          </div>
        </div>
      </div>
      <div className={clsx(styles.split, styles.rules)}>
        <div className={styles.panel}>
          <div className={styles.label}>{t.allowedLabel}</div>
          <div className={styles.items}>
            {t.allowed.map((rule) => (
              <div key={rule} className={styles.item}>
                <span className={styles.markGood}>✓</span>
                {rule}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.label}>{t.blockedLabel}</div>
          <div className={styles.items}>
            {t.blocked.map((rule) => (
              <div key={rule} className={styles.item}>
                <span className={styles.markBad}>✕</span>
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </VizFigure>
  );
}

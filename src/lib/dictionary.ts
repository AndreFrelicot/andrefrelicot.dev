import type { Locale } from "./mdx";
import { DEFAULT_LOCALE } from "./mdx";

export type Dictionary = {
  site: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    content: string;
    apps: string;
    about: string;
  };
  home: {
    headline: string;
    tagline: string;
    callToAction: string;
    linksHeading: string;
  };
  content: {
    heading: string;
    intro: string;
    searchPlaceholder: string;
    allTag: string;
    empty: string;
    showTags: string;
    hideTags: string;
    loadMore: string;
  };
  post: {
    publishedOnPrefix: string;
    modifiedOnPrefix: string;
    readingTimeLabel: string;
  };
  notFound: {
    title: string;
    heading: string;
    message: string;
    backHome: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    site: {
      title: "André Frélicot",
      description: "TechLead & Solopreneur devlogs.",
    },
    nav: {
      home: "Home",
      content: "Devlogs",
      apps: "Apps",
      about: "About",
    },
    home: {
      headline: "André Frélicot",
      tagline:
        "TechLead & Solopreneur",
      callToAction: "View content",
      linksHeading: "Selected Reading",
    },
    content: {
      heading: "Content",
      intro: "A curated collection of my software development writing and projects.",
      searchPlaceholder: "Search content by title or body...",
      allTag: "All",
      empty: "No matching entries yet.",
      showTags: "Show tags & search",
      hideTags: "Hide tags & search",
      loadMore: "Load more results",
    },
    post: {
      publishedOnPrefix: "Published",
      modifiedOnPrefix: "Modified",
      readingTimeLabel: "{minutes} min read",
    },
    notFound: {
      title: "404 - Page Not Found",
      heading: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
      backHome: "Back to Home",
    },
  },
  fr: {
    site: {
      title: "André Frélicot",
      description:
        "Un site statique Next.js alimenté par des articles MDX.",
    },
    nav: {
      home: "Accueil",
      content: "Devlogs",
      apps: "Apps",
      about: "À propos",
    },
    home: {
      headline: "André Frélicot",
      tagline:
        "TechLead & Solopreneur",
      callToAction: "Voir les contenus",
      linksHeading: "Lectures sélectionnées",
    },
    content: {
      heading: "Contenus",
      intro: "Une sélection de mes écrits et projets.",
      searchPlaceholder: "Rechercher un contenu par titre ou corps...",
      allTag: "Tous",
      empty: "Aucun contenu correspondant pour le moment.",
      showTags: "Afficher les étiquettes & la recherche",
      hideTags: "Masquer les étiquettes & la recherche",
      loadMore: "Charger plus de résultats",
    },
    post: {
      publishedOnPrefix: "Publié",
      modifiedOnPrefix: "Modifié",
      readingTimeLabel: "{minutes} min de lecture",
    },
    notFound: {
      title: "404 - Page non trouvée",
      heading: "Page non trouvée",
      message: "La page que vous recherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'accueil",
    },
  },
  pt: {
    site: {
      title: "André Frélicot",
      description:
        "TechLead & Solopreneur",
    },
    nav: {
      home: "Início",
      content: "Devlogs",
      apps: "Apps",
      about: "Sobre",
    },
    home: {
      headline: "André Frélicot",
      tagline:
        "TechLead & Solopreneur",
      callToAction: "Ver conteúdo",
      linksHeading: "Leituras em destaque",
    },
    content: {
      heading: "Conteúdo",
      intro: "Uma seleção dos meus textos e projetos.",
      searchPlaceholder: "Busque conteúdo pelo título ou corpo...",
      allTag: "Todos",
      empty: "Nenhum conteúdo correspondente ainda.",
      showTags: "Mostrar tags e busca",
      hideTags: "Ocultar tags e busca",
      loadMore: "Carregar mais resultados",
    },
    post: {
      publishedOnPrefix: "Publicado",
      modifiedOnPrefix: "Atualizado",
      readingTimeLabel: "{minutes} min de leitura",
    },
    notFound: {
      title: "404 - Página não encontrada",
      heading: "Página não encontrada",
      message: "A página que você está procurando não existe ou foi movida.",
      backHome: "Voltar ao início",
    },
  },
  es: {
    site: {
      title: "André Frélicot",
      description:
        "Un sitio estático de Next.js impulsado por artículos MDX.",
    },
    nav: {
      home: "Inicio",
      content: "Devlogs",
      apps: "Apps",
      about: "Acerca de",
    },
    home: {
      headline: "André Frélicot",
      tagline:
        "TechLead & Solopreneur",
      callToAction: "Ver contenidos",
      linksHeading: "Lecturas destacadas",
    },
    content: {
      heading: "Contenido",
      intro: "Una selección de mis textos y proyectos.",
      searchPlaceholder: "Busca contenido por título o cuerpo...",
      allTag: "Todos",
      empty: "No hay entradas que coincidan todavía.",
      showTags: "Mostrar etiquetas y búsqueda",
      hideTags: "Ocultar etiquetas y búsqueda",
      loadMore: "Cargar más resultados",
    },
    post: {
      publishedOnPrefix: "Publicado",
      modifiedOnPrefix: "Actualizado",
      readingTimeLabel: "{minutes} min de lectura",
    },
    notFound: {
      title: "404 - Página no encontrada",
      heading: "Página no encontrada",
      message: "La página que buscas no existe o ha sido movida.",
      backHome: "Volver al inicio",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function formatReadingTime(
  dictionary: Dictionary,
  minutes: number,
): string {
  return dictionary.post.readingTimeLabel.replace(
    "{minutes}",
    String(minutes),
  );
}

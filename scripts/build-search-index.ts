import {
  SUPPORTED_LOCALES,
  getAllPostsWithFallback,
  refreshTranslationIndex,
} from "../src/lib/mdx";
import { buildSearchIndex } from "../src/lib/search";

// Build the search index before static export
refreshTranslationIndex();
SUPPORTED_LOCALES.forEach((locale) => {
  const posts = getAllPostsWithFallback(locale);
  buildSearchIndex(posts, locale);
  console.log(
    `Search index built for ${posts.length} posts (locale: ${locale}).`,
  );
});

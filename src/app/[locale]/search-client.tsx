"use client";

import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/mdx";
import type { SearchDoc } from "@/lib/search";
import { buildPostPath } from "@/lib/post-path";

type Doc = SearchDoc;

const DEFAULT_VISIBLE_RESULTS = 20;
const LOAD_INCREMENT = 20;

function isHiddenTag(tag: string | undefined | null): boolean {
  return Boolean(tag && tag.startsWith("_"));
}

function onlyVisibleTags(tags: string[] | undefined): string[] {
  return (tags ?? []).filter((tag) => !isHiddenTag(tag));
}

function hasHiddenTag(tags: string[] | undefined): boolean {
  return (tags ?? []).some(isHiddenTag);
}

function hasAnyTag(tags: string[] | undefined): boolean {
  return Boolean(tags && tags.length > 0);
}

function matchHiddenAlias(candidate: string | undefined, target: string): boolean {
  if (!candidate) return false;
  if (candidate === target) return true;
  if (!isHiddenTag(target)) return false;
  const normalized = target.slice(1);
  return normalized ? candidate === normalized : false;
}

function formatCardDate(value: string | undefined): string {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  const day = parsed.getUTCDate();
  const year = parsed.getUTCFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[parsed.getUTCMonth()] ?? "";
  return `${day} ${month} ${year}`.trim();
}

export function ClientSearch({
  locale,
  copy,
  initialDocs,
  pathsBySlug,
}: {
  locale: Locale;
  copy: {
    placeholder: string;
    allLabel: string;
    empty: string;
    showTags: string;
    hideTags: string;
    loadMore: string;
  };
  initialDocs?: Doc[];
  pathsBySlug?: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams?.get("q") ?? "");
  const [tag, setTag] = useState<string | undefined>(() => searchParams?.get("tag") ?? undefined);
  const [docs, setDocs] = useState<Doc[] | null>(initialDocs ?? null);
  const [showTags, setShowTags] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_RESULTS);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const syncToUrl = useCallback(
    (nextTag: string | undefined, nextQuery: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (nextTag) {
        params.set("tag", nextTag);
      } else {
        params.delete("tag");
      }

      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }

      const next = params.toString();
      router.replace(next ? `?${next}` : "", { scroll: false });
    },
    [router, searchParams],
  );

  useLayoutEffect(() => {
    if (!searchParams) return;

    const urlTag = searchParams.get("tag") ?? undefined;
    const urlQuery = searchParams.get("q") ?? "";

    setTag((prev) => (prev === urlTag ? prev : urlTag));
    setQuery((prev) => (prev === urlQuery ? prev : urlQuery));

    if (urlQuery) {
      setShowTags((prev) => (prev ? prev : true));
    }
  }, [searchParams]);

  useEffect(() => {
    setShowTags(false);
  }, [tag]);

  useEffect(() => {
    if (initialDocs) {
      setDocs(initialDocs);
    }
  }, [initialDocs]);

  useEffect(() => {
    if (initialDocs) return;

    let cancelled = false;
    fetch(`/search-index.${locale}.json`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setDocs(d.docs as Doc[]);
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });

    return () => {
      cancelled = true;
    };
  }, [locale, initialDocs]);

  const results = useMemo(() => {
    if (!docs) return [] as Doc[];

    const filtered = docs.filter((doc) => {
      if (!tag) {
        return hasAnyTag(doc.tags) && !hasHiddenTag(doc.tags);
      }

      if (isHiddenTag(tag)) {
        return (doc.tags ?? []).some((candidate) => matchHiddenAlias(candidate, tag));
      }

      if (!hasAnyTag(doc.tags) || hasHiddenTag(doc.tags)) {
        return false;
      }

      return onlyVisibleTags(doc.tags).includes(tag);
    });

    if (!query) return filtered;
    const fuse = new Fuse(filtered, {
      includeScore: false,
      minMatchCharLength: 2,
      threshold: 0.35,
      keys: ["title", "content", "tags"],
    });
    return fuse.search(query).map((r) => r.item);
  }, [docs, query, tag]);

  const { tagCounts, allTags } = useMemo(() => {
    if (!docs) {
      return { tagCounts: new Map<string, number>(), allTags: [] as string[] };
    }

    const counts = new Map<string, number>();
    docs
      .filter((doc) => hasAnyTag(doc.tags) && !hasHiddenTag(doc.tags))
      .forEach((doc) => {
        onlyVisibleTags(doc.tags).forEach((candidate) => {
          counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
        });
      });

    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    return { tagCounts: counts, allTags: tags };
  }, [docs]);

  const resultsCount = results.length;
  const limitedCount = Math.min(visibleCount, resultsCount);
  const visibleResults = results.slice(0, limitedCount);
  const hasMore = limitedCount < resultsCount;

  useEffect(() => {
    setVisibleCount(DEFAULT_VISIBLE_RESULTS);
  }, [query, tag, resultsCount]);

  useEffect(() => {
    if (!hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisibleCount((prev) =>
            Math.min(prev + LOAD_INCREMENT, resultsCount),
          );
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, resultsCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_INCREMENT, resultsCount));
  };

  return (
    <div className="mt-6">
      {allTags.length ? (
        <div className="space-y-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            onClick={() => setShowTags((current) => !current)}
            aria-expanded={showTags}
          >
            {showTags ? copy.hideTags : copy.showTags}
          </button>

          {showTags ? (
            <div className="space-y-4 rounded-md border border-foreground/15 p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors ${
                    !tag
                      ? "bg-foreground text-background"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  onClick={() => {
                    if (!tag) return;
                    setTag(undefined);
                    syncToUrl(undefined, query);
                  }}
                >
                  {copy.allLabel}
                </button>
                {allTags.map((candidate) => (
                  <button
                    type="button"
                    key={candidate}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors ${
                      candidate === tag
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    onClick={() => {
                      const nextTag = candidate === tag ? undefined : candidate;
                      if (nextTag === tag) return;
                      setTag(nextTag);
                      syncToUrl(nextTag, query);
                    }}
                  >
                    <span>{candidate}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        candidate === tag
                          ? "bg-background/20 text-background"
                          : "bg-foreground/10 text-foreground/70"
                      }`}
                    >
                      {tagCounts.get(candidate) ?? 0}
                    </span>
                  </button>
                ))}
              </div>

              <input
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === query) return;
                  setQuery(value);
                  syncToUrl(tag, value);
                }}
                type="search"
                placeholder={copy.placeholder}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {allTags.length === 0 ? (
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            if (value === query) return;
            setQuery(value);
            syncToUrl(tag, value);
          }}
          type="search"
          placeholder={copy.placeholder}
          className="mt-4 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
        />
      ) : null}

      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {visibleResults.map((p, index) => (
          <li key={p.slug} className="overflow-hidden rounded-lg border border-foreground/10 dark:border-foreground/15">
            <Link
              href={pathsBySlug?.[p.slug] ?? buildPostPath(locale, p.slug, p.date)}
              className="group block h-full"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
                <Image
                  src={p.image ?? "/images/placeholders/article-card.png"}
                  alt={p.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 ease-out motion-safe:group-focus-visible:scale-105 motion-safe:group-hover:scale-105"
                  priority={index === 0}
                  unoptimized
                />
              </div>
              <div className="p-5">
                {(() => {
                  const formattedDate = formatCardDate(p.date);
                  if (!formattedDate) return null;
                  return (
                    <time
                      className="text-xs font-semibold uppercase tracking-wide text-foreground/60"
                      dateTime={p.date ?? undefined}
                    >
                      {formattedDate}
                    </time>
                  );
                })()}
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                {p.description ? (
                  <p className="mt-1 text-sm opacity-80">{p.description}</p>
                ) : null}
                {p.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {onlyVisibleTags(p.tags).map((t) => (
                      <span
                        key={t}
                        className="rounded border border-foreground/10 dark:border-foreground/15 px-2 py-0.5 text-xs opacity-80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {docs && resultsCount === 0 ? (
        <p className="mt-4 text-sm opacity-70">{copy.empty}</p>
      ) : null}
      {hasMore ? (
        <div ref={loadMoreRef} className="mt-6 flex justify-center">
          <button
            type="button"
            className="rounded-full border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
            onClick={handleLoadMore}
          >
            {copy.loadMore}
          </button>
        </div>
      ) : null}
    </div>
  );
}

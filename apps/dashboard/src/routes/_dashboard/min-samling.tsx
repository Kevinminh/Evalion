import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fagpratsQueries } from "@workspace/api/fagprats";
import { FagPratCardSkeleton } from "@workspace/features/components/skeletons/fagprat-card-skeleton";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CustomDropdown } from "@/components/custom-dropdown";
import { FagPratCard } from "@/components/fagprat-card";
import { LEVEL_OPTIONS, SKELETON_COUNT } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const SORT_OPTIONS = [
  { value: "sist-endret", label: "Sist endret" },
  { value: "opprettet", label: "Opprettet" },
  { value: "fag", label: "Fag" },
  { value: "trinn", label: "Trinn" },
] as const;

type SortBy = (typeof SORT_OPTIONS)[number]["value"];

const LEVEL_ORDER = new Map<string, number>(LEVEL_OPTIONS.map((opt, i) => [opt.value, i]));
const compareLevel = (a: string, b: string) => {
  const aIdx = LEVEL_ORDER.get(a) ?? Number.POSITIVE_INFINITY;
  const bIdx = LEVEL_ORDER.get(b) ?? Number.POSITIVE_INFINITY;
  if (aIdx !== bIdx) return aIdx - bIdx;
  return a.localeCompare(b, "nb");
};

const isSortBy = (value: string): value is SortBy =>
  value === "sist-endret" || value === "opprettet" || value === "fag" || value === "trinn";

interface MinSamlingSearch {
  q?: string;
  sort?: SortBy;
}

export const Route = createFileRoute("/_dashboard/min-samling")({
  validateSearch: (search: Record<string, unknown>): MinSamlingSearch => {
    const { sort } = search;
    return {
      q: typeof search.q === "string" && search.q ? search.q : undefined,
      sort:
        sort === "fag" || sort === "trinn" || sort === "opprettet" ? sort : undefined,
    };
  },
  component: MinSamlingPage,
});

function MinSamlingPage() {
  const { q, sort } = Route.useSearch();
  const sortBy: SortBy = sort ?? "sist-endret";
  const navigate = useNavigate({ from: Route.fullPath });

  const [searchQuery, setSearchQuery] = useState(() => q ?? "");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 250);

  useEffect(() => {
    const next = debouncedSearchQuery || undefined;
    if (next === q) return;
    navigate({
      search: (prev) => ({ ...prev, q: next }),
      replace: true,
    });
  }, [debouncedSearchQuery, q, navigate]);

  const setSortBy = useCallback(
    (value: SortBy) => {
      navigate({
        search: (prev) => ({ ...prev, sort: value === "sist-endret" ? undefined : value }),
        replace: true,
      });
    },
    [navigate],
  );

  const { data: allFagPrats, isPending, isError } = useQuery(fagpratsQueries.listByAuthor());

  // Backend returns docs ordered by updatedAt desc (via `by_author_updatedAt` index),
  // so "sist-endret" needs no client-side sort.
  const filtered = useMemo(() => {
    if (!allFagPrats) return [];
    if (!searchQuery) return allFagPrats;
    const query = searchQuery.toLowerCase();
    return allFagPrats.filter(
      (fp) => fp.title.toLowerCase().includes(query) || fp.subject.toLowerCase().includes(query),
    );
  }, [allFagPrats, searchQuery]);

  const sortedList = useMemo(() => {
    if (sortBy === "opprettet") {
      return [...filtered].sort((a, b) => b._creationTime - a._creationTime);
    }
    return filtered;
  }, [filtered, sortBy]);

  const groups = useMemo(() => {
    if (sortBy !== "fag" && sortBy !== "trinn") return [];
    const useSubject = sortBy === "fag";
    const map = new Map<string, typeof filtered>();
    for (const fp of filtered) {
      const key = useSubject ? fp.subject : fp.level;
      const bucket = map.get(key);
      if (bucket) {
        bucket.push(fp);
      } else {
        map.set(key, [fp]);
      }
    }
    const entries = Array.from(map);
    if (!useSubject) {
      entries.sort(([a], [b]) => compareLevel(a, b));
    }
    return entries;
  }, [filtered, sortBy]);

  const showLinear = sortBy === "sist-endret" || sortBy === "opprettet";

  return (
    <>
      <div className="page-header-inline">
        <h1 className="page-title">Min samling</h1>
        <div className="page-header-controls">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Søk i samlingen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input search-input--inline"
            />
          </div>

          <div className="sort-pill">
            <CustomDropdown
              label=""
              value={sortBy}
              onChange={(v) => {
                if (isSortBy(v)) setSortBy(v);
              }}
              placeholder="Sorter"
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </div>

      {isError && <ErrorState className="py-12 text-center" />}

      {isPending && (
        <div className="fp-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <FagPratCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && showLinear && sortedList.length > 0 && (
        <div className="fp-grid">
          {sortedList.map((fp) => (
            <FagPratCard key={fp._id} fagprat={fp} variant="collection" />
          ))}
        </div>
      )}

      {!isPending &&
        !showLinear &&
        groups.map(([title, items]) => (
          <div key={title} className="fag-group">
            <h2 className="fag-group-title">{title}</h2>
            <div className="fp-grid">
              {items.map((fp) => (
                <FagPratCard key={fp._id} fagprat={fp} variant="collection" />
              ))}
            </div>
          </div>
        ))}

      {!isPending && filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          {searchQuery
            ? `Ingen FagPrater funnet for "${searchQuery}"`
            : "Du har ingen FagPrater i samlingen din ennå."}
        </p>
      )}
    </>
  );
}

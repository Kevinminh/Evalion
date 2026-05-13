import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CustomDropdown } from "@/components/custom-dropdown";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { FagPratCard } from "@/components/fagprat-card";
import { FagPratCardSkeleton } from "@workspace/evalion/components/skeletons/fagprat-card-skeleton";
import { SKELETON_COUNT } from "@/lib/constants";
import { fagpratQueries } from "@/lib/convex";
import { useDebouncedValue } from "@/lib/use-debounced-value";

type SortBy = "sist-endret" | "fag";

interface MinSamlingSearch {
  q?: string;
  sort?: SortBy;
}

export const Route = createFileRoute("/_dashboard/min-samling")({
  validateSearch: (search: Record<string, unknown>): MinSamlingSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    sort: search.sort === "fag" ? "fag" : undefined,
  }),
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

  const { data: allFagPrats, isPending, isError } = useQuery(fagpratQueries.listByAuthor());

  const filtered = useMemo(() => {
    if (!allFagPrats) return [];
    if (!searchQuery) return allFagPrats;
    const query = searchQuery.toLowerCase();
    return allFagPrats.filter(
      (fp) =>
        fp.title.toLowerCase().includes(query) ||
        fp.subject.toLowerCase().includes(query),
    );
  }, [allFagPrats, searchQuery]);

  const grouped = useMemo(
    () =>
      filtered.reduce(
        (acc, fp) => {
          const key = fp.subject;
          if (!acc[key]) acc[key] = [];
          acc[key].push(fp);
          return acc;
        },
        {} as Record<string, typeof filtered>,
      ),
    [filtered],
  );

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
              onChange={(v) => { setSortBy(v as SortBy); }}
              placeholder="Sorter"
              options={[
                { value: "sist-endret", label: "Sist endret" },
                { value: "fag", label: "Fag" },
              ]}
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

      {!isPending && sortBy === "sist-endret" && filtered.length > 0 && (
        <div className="fp-grid">
          {filtered.map((fp) => (
            <FagPratCard key={fp._id} fagprat={fp} variant="collection" />
          ))}
        </div>
      )}

      {!isPending &&
        sortBy === "fag" &&
        Object.entries(grouped).map(([subject, items]) => (
          <div key={subject} className="fag-group">
            <h2 className="fag-group-title">{subject}</h2>
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

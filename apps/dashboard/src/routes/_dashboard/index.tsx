import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/convex/_generated/api";
import { FagPratCardSkeleton } from "@workspace/evalion/components/skeletons/fagprat-card-skeleton";
import { usePaginatedQuery } from "convex/react";
import { useRef, useState } from "react";

import { CustomDropdown } from "@/components/custom-dropdown";
import { FagPratCard } from "@/components/fagprat-card";
import { TypeIcon } from "@/components/type-icon";
import { LEVEL_OPTIONS, SKELETON_COUNT, SUBJECT_OPTIONS } from "@/lib/constants";
import { useClickOutside } from "@/lib/use-click-outside";
import { useDebouncedValue } from "@/lib/use-debounced-value";

export const Route = createFileRoute("/_dashboard/")({
  component: UtforskPage,
});

const PAGE_SIZE = 6;

function UtforskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 250);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"relevant" | "newest">("relevant");
  const [forkunnskapIntro, setForkunnskapIntro] = useState(true);
  const [forkunnskapOppsummering, setForkunnskapOppsummering] = useState(true);
  const [selectedFag, setSelectedFag] = useState("");
  const [selectedTrinn, setSelectedTrinn] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  const typeFilter =
    forkunnskapIntro && forkunnskapOppsummering
      ? undefined
      : forkunnskapIntro
        ? ("intro" as const)
        : forkunnskapOppsummering
          ? ("oppsummering" as const)
          : undefined;

  const showNone = !forkunnskapIntro && !forkunnskapOppsummering;

  const { results, status, loadMore } = usePaginatedQuery(
    api.fagprats.search,
    showNone
      ? "skip"
      : {
          searchText: debouncedSearchQuery || undefined,
          subject: selectedFag || undefined,
          level: selectedTrinn || undefined,
          type: typeFilter,
          sortBy: sortBy === "newest" ? "recent" : "relevant",
        },
    { initialNumItems: PAGE_SIZE },
  );

  useClickOutside(filterRef, () => setFilterOpen(false));

  const isFirstLoad = !showNone && status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";
  const items = showNone ? [] : (results ?? []);
  const isEmpty = !isFirstLoad && items.length === 0;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Utforsk</h1>
        <p className="page-subtitle">Finn FagPrater som andre lærere har delt</p>
      </div>

      <div className="search-bar" ref={filterRef}>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Søk etter tittel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            type="button"
            title="Filtrer"
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen(!filterOpen);
            }}
            className={`filter-toggle${filterOpen ? " active" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
          </button>
        </div>

        {filterOpen && (
          <div className="filter-panel">
            <div className="filter-section">
              <div className="filter-section-label">Sortering</div>
              <div className="filter-sort-options">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "relevant"}
                    onChange={() => setSortBy("relevant")}
                  />
                  Mest relevant
                </label>
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "newest"}
                    onChange={() => setSortBy("newest")}
                  />
                  Nyeste
                </label>
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-label">Forkunnskaper</div>
              <div className="filter-forkunnskap-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={forkunnskapIntro}
                    onChange={() => setForkunnskapIntro(!forkunnskapIntro)}
                  />
                  <TypeIcon type="intro" />
                  Introduksjon
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={forkunnskapOppsummering}
                    onChange={() => setForkunnskapOppsummering(!forkunnskapOppsummering)}
                  />
                  <TypeIcon type="oppsummering" />
                  Oppsummering
                </label>
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-row">
                <CustomDropdown
                  label="Fag"
                  value={selectedFag}
                  onChange={setSelectedFag}
                  placeholder="Alle fag"
                  options={[{ value: "", label: "Alle fag" }, ...SUBJECT_OPTIONS]}
                />
                <CustomDropdown
                  label="Trinn"
                  value={selectedTrinn}
                  onChange={setSelectedTrinn}
                  placeholder="Alle trinn"
                  options={[{ value: "", label: "Alle trinn" }, ...LEVEL_OPTIONS]}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="section-title">Populære FagPrater</h2>

      {isFirstLoad && (
        <div className="fp-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <FagPratCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isFirstLoad && items.length > 0 && (
        <div className="fp-grid">
          {items.map((fp) => (
            <FagPratCard key={fp._id} fagprat={fp} variant="browse" />
          ))}
          {isLoadingMore &&
            Array.from({ length: 3 }).map((_, i) => <FagPratCardSkeleton key={`more-${i}`} />)}
        </div>
      )}

      {(canLoadMore || isLoadingMore) && (
        <div className="flex justify-center py-8">
          <button
            type="button"
            onClick={() => loadMore(PAGE_SIZE)}
            disabled={isLoadingMore}
            className="rounded-xl border-2 border-input bg-background px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Laster…" : "Last inn flere"}
          </button>
        </div>
      )}

      {isEmpty && (
        <p className="py-12 text-center text-muted-foreground">
          {debouncedSearchQuery
            ? `Ingen FagPrater funnet for "${debouncedSearchQuery}"`
            : "Ingen FagPrater funnet"}
        </p>
      )}
    </>
  );
}

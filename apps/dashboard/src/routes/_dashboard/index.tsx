import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { CustomDropdown } from "@/components/custom-dropdown";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { FagPratCard } from "@/components/fagprat-card";
import { FagPratCardSkeleton } from "@workspace/evalion/components/skeletons/fagprat-card-skeleton";
import { TypeIcon } from "@/components/type-icon";
import { LEVEL_OPTIONS, SKELETON_COUNT, SUBJECT_OPTIONS } from "@/lib/constants";
import { fagpratQueries } from "@/lib/convex";
import { useClickOutside } from "@/lib/use-click-outside";

export const Route = createFileRoute("/_dashboard/")({
  component: UtforskPage,
});

function UtforskPage() {
  const [searchQuery, setSearchQuery] = useState("");
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

  const {
    data: searchResults,
    isPending,
    isError,
  } = useQuery(
    fagpratQueries.search({
      searchText: searchQuery || undefined,
      subject: selectedFag || undefined,
      level: selectedTrinn || undefined,
      type: typeFilter,
      sortBy: sortBy === "newest" ? "recent" : "relevant",
    }),
  );

  const filtered = showNone ? [] : (searchResults ?? []);

  useClickOutside(filterRef, () => setFilterOpen(false));

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
            placeholder="Søk etter fag, tema, trinn..."
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

      {isError && <ErrorState className="py-12 text-center" />}

      {isPending && (
        <div className="fp-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <FagPratCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && (
        <div className="fp-grid">
          {filtered.map((fp) => (
            <FagPratCard key={fp._id} fagprat={fp} variant="browse" />
          ))}
        </div>
      )}

      {!isPending && filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          Ingen FagPrater funnet for &quot;{searchQuery}&quot;
        </p>
      )}
    </>
  );
}

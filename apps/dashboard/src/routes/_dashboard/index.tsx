import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Sprout, Target } from "lucide-react";
import { useState, useRef } from "react";

import { CustomDropdown } from "@/components/custom-dropdown";
import { ErrorState } from "@/components/error-state";
import { FagPratCard } from "@/components/fagprat-card";
import { FagPratCardSkeleton } from "@workspace/ui/components/skeletons/fagprat-card-skeleton";
import { SUBJECT_OPTIONS, LEVEL_OPTIONS, CARD_GRID_CLASS, SKELETON_COUNT } from "@/lib/constants";
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

  // Determine type filter: both checked = no filter, one checked = that type, neither = show nothing
  const typeFilter =
    forkunnskapIntro && forkunnskapOppsummering
      ? undefined
      : forkunnskapIntro
        ? ("intro" as const)
        : forkunnskapOppsummering
          ? ("oppsummering" as const)
          : undefined;

  const showNone = !forkunnskapIntro && !forkunnskapOppsummering;

  const { data: searchResults, isPending, isError } = useQuery(
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
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-extrabold text-foreground sm:text-3xl">Utforsk</h1>
        <p className="text-base text-muted-foreground">Finn FagPrater som andre lærere har delt</p>
      </div>

      {/* Search + Filter */}
      <div className="relative mb-10" ref={filterRef}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Søk etter fag, tema, trinn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card py-4 pr-14 pl-12 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:ring-3 focus:ring-primary/20"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen(!filterOpen);
            }}
            className={`absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] transition-all ${
              filterOpen
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <SlidersHorizontal className="size-[18px]" />
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="absolute right-0 top-full z-10 mt-2 w-[calc(100vw-2rem)] rounded-2xl border-[1.5px] border-border bg-card p-5 px-6 shadow-lg sm:w-[420px]">
            {/* Sortering */}
            <div className="mb-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
                Sortering
              </div>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "relevant"}
                    onChange={() => setSortBy("relevant")}
                    className="size-4 accent-primary"
                  />
                  Mest relevant
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "newest"}
                    onChange={() => setSortBy("newest")}
                    className="size-4 accent-primary"
                  />
                  Nyeste
                </label>
              </div>
            </div>

            {/* Forkunnskaper */}
            <div className="mb-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
                Forkunnskaper
              </div>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={forkunnskapIntro}
                    onChange={() => setForkunnskapIntro(!forkunnskapIntro)}
                    className="size-4 accent-primary"
                  />
                  <Sprout className="size-3.5 text-teal-500" />
                  Introduksjon
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={forkunnskapOppsummering}
                    onChange={() => setForkunnskapOppsummering(!forkunnskapOppsummering)}
                    className="size-4 accent-primary"
                  />
                  <Target className="size-3.5 text-amber-500" />
                  Oppsummering
                </label>
              </div>
            </div>

            {/* Fag + Trinn */}
            <div className="grid grid-cols-2 gap-3">
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
        )}
      </div>

      {/* Section title */}
      <h2 className="mb-4 text-xl font-extrabold text-foreground sm:mb-6 sm:text-2xl">Populære FagPrater</h2>

      {/* Error state */}
      {isError && <ErrorState className="py-12 text-center" />}

      {/* Loading state */}
      {isPending && (
        <div className={CARD_GRID_CLASS}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <FagPratCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Card grid */}
      {!isPending && (
        <div className={CARD_GRID_CLASS}>
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
    </div>
  );
}

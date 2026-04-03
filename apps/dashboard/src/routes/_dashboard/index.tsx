import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Search, SlidersHorizontal, Sprout, Target } from "lucide-react";
import { useState, useRef, useEffect, useId } from "react";

import { FagPratCard } from "@/components/fagprat-card";
import { FagPratCardSkeleton } from "@workspace/ui/components/skeletons/fagprat-card-skeleton";
import { SUBJECT_OPTIONS, LEVEL_OPTIONS } from "@/lib/constants";
import { fagpratQueries } from "@/lib/convex";

export const Route = createFileRoute("/_dashboard/")({
  component: UtforskPage,
});

function CustomDropdown({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex w-full items-center justify-between rounded-lg border-[1.5px] border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-3 focus:ring-primary/20"
      >
        <span className={!value ? "text-muted-foreground" : ""}>{selected?.label ?? placeholder}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border-[1.5px] border-border bg-card py-1 shadow-lg"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-primary/5 ${
                opt.value === value ? "font-bold text-primary" : "text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      {isError && (
        <p className="py-12 text-center text-destructive">
          Noe gikk galt. Prøv å laste siden på nytt.
        </p>
      )}

      {/* Loading state */}
      {isPending && (
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <FagPratCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Card grid */}
      {!isPending && (
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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

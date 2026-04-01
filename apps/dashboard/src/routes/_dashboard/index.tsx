import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { FagPratCard } from "@/components/fagprat-card";
import { fagpratQueries } from "@/lib/convex";

export const Route = createFileRoute("/_dashboard/")({
  component: UtforskPage,
});

function UtforskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const { data: allFagPrats, isPending } = useQuery(fagpratQueries.list());

  const filtered = allFagPrats
    ? searchQuery
      ? allFagPrats.filter(
          (fp) =>
            fp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fp.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fp.level.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : allFagPrats
    : [];

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
        <h1 className="mb-1 text-3xl font-extrabold text-foreground">Utforsk</h1>
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
          <div className="absolute right-0 top-full z-10 mt-2 w-[420px] rounded-2xl border-[1.5px] border-border bg-card p-5 px-6 shadow-lg">
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
                    defaultChecked
                    className="size-4 accent-primary"
                  />
                  Mest relevant
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="sort" className="size-4 accent-primary" />
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
                  <input type="checkbox" defaultChecked className="size-4 accent-primary" />
                  Introduksjon
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="size-4 accent-primary" />
                  Oppsummering
                </label>
              </div>
            </div>

            {/* Fag + Trinn */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                  Fag
                </label>
                <select className="w-full appearance-none rounded-lg border-[1.5px] border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/20">
                  <option>Alle fag</option>
                  <option>Naturfag</option>
                  <option>Matematikk</option>
                  <option>Samfunnsfag</option>
                  <option>Norsk</option>
                  <option>Engelsk</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                  Trinn
                </label>
                <select className="w-full appearance-none rounded-lg border-[1.5px] border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/20">
                  <option>Alle trinn</option>
                  <option>8. trinn</option>
                  <option>9. trinn</option>
                  <option>10. trinn</option>
                  <option>VG1</option>
                  <option>VG2</option>
                  <option>VG3</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section title */}
      <h2 className="mb-6 text-2xl font-extrabold text-foreground">Populære FagPrater</h2>

      {/* Loading state */}
      {isPending && <p className="py-12 text-center text-muted-foreground">Laster FagPrater...</p>}

      {/* Card grid */}
      {!isPending && (
        <div className="grid auto-rows-fr grid-cols-3 gap-6">
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

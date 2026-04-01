import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

import { getAllFagPrats } from "@/data/fagprat-data";
import { FagPratCard } from "@/components/fagprat-card";

export const Route = createFileRoute("/_dashboard/min-samling")({
  component: MinSamlingPage,
});

function MinSamlingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"sist-endret" | "fag">("sist-endret");
  const [sortOpen, setSortOpen] = useState(false);

  const allFagPrats = getAllFagPrats();
  const filtered = searchQuery
    ? allFagPrats.filter(
        (fp) =>
          fp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fp.subject.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allFagPrats;

  // Group by subject for "fag" view
  const grouped = filtered.reduce(
    (acc, fp) => {
      const key = fp.subject;
      if (!acc[key]) acc[key] = [];
      acc[key].push(fp);
      return acc;
    },
    {} as Record<string, typeof filtered>,
  );

  return (
    <div className="max-w-[1100px]">
      {/* Header row */}
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <h1 className="text-3xl font-extrabold text-foreground">Min samling</h1>
        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Søk i samlingen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[280px] rounded-2xl border-2 border-border bg-card py-3 pr-4 pl-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:ring-3 focus:ring-primary/20"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className={`inline-flex items-center gap-2 rounded-full border-[1.5px] bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-all ${
                sortOpen
                  ? "border-primary/50 ring-3 ring-primary/20"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              {sortBy === "sist-endret" ? "Sist endret" : "Fag"}
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] overflow-hidden rounded-xl border-[1.5px] border-border bg-card shadow-md">
                <button
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    sortBy === "sist-endret"
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSortBy("sist-endret");
                    setSortOpen(false);
                  }}
                >
                  Sist endret
                </button>
                <button
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    sortBy === "fag"
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSortBy("fag");
                    setSortOpen(false);
                  }}
                >
                  Fag
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flat view */}
      {sortBy === "sist-endret" && (
        <div className="grid auto-rows-fr grid-cols-3 gap-6">
          {filtered.map((fp) => (
            <FagPratCard key={fp.id} fagprat={fp} variant="collection" />
          ))}
        </div>
      )}

      {/* Grouped view */}
      {sortBy === "fag" &&
        Object.entries(grouped).map(([subject, items]) => (
          <div key={subject} className="mb-10">
            <h2 className="mb-6 text-2xl font-extrabold text-foreground">{subject}</h2>
            <div className="grid auto-rows-fr grid-cols-3 gap-6">
              {items.map((fp) => (
                <FagPratCard key={fp.id} fagprat={fp} variant="collection" />
              ))}
            </div>
          </div>
        ))}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          Ingen FagPrater funnet for &quot;{searchQuery}&quot;
        </p>
      )}
    </div>
  );
}

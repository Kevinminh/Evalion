import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CustomDropdown } from "@/components/custom-dropdown";
import { ErrorState } from "@/components/error-state";
import { FagPratCard } from "@/components/fagprat-card";
import { FagPratCardSkeleton } from "@workspace/ui/components/skeletons/fagprat-card-skeleton";
import { CARD_GRID_CLASS, SKELETON_COUNT } from "@/lib/constants";
import { fagpratQueries } from "@/lib/convex";

export const Route = createFileRoute("/_dashboard/min-samling")({
  component: MinSamlingPage,
});

function MinSamlingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"sist-endret" | "fag">("sist-endret");

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

  // Group by subject for "fag" view
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
    <div className="max-w-[1100px]">
      {/* Header row */}
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Min samling</h1>
        <div className="ml-auto flex w-full items-center gap-4 sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Søk i samlingen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-2 border-border bg-card py-3 pr-4 pl-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:ring-3 focus:ring-primary/20 sm:w-[280px]"
            />
          </div>

          {/* Sort dropdown */}
          <CustomDropdown
            label=""
            value={sortBy}
            onChange={(v) => setSortBy(v as "sist-endret" | "fag")}
            placeholder="Sorter"
            options={[
              { value: "sist-endret", label: "Sist endret" },
              { value: "fag", label: "Fag" },
            ]}
          />
        </div>
      </div>

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

      {/* Flat view */}
      {!isPending && sortBy === "sist-endret" && (
        <div className={CARD_GRID_CLASS}>
          {filtered.map((fp) => (
            <FagPratCard key={fp._id} fagprat={fp} variant="collection" />
          ))}
        </div>
      )}

      {/* Grouped view */}
      {!isPending &&
        sortBy === "fag" &&
        Object.entries(grouped).map(([subject, items]) => (
          <div key={subject} className="mb-10">
            <h2 className="mb-6 text-2xl font-extrabold text-foreground">{subject}</h2>
            <div className={CARD_GRID_CLASS}>
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
    </div>
  );
}

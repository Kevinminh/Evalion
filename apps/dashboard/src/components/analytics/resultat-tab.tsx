import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";
import { VOTE_DOT_COLORS, VOTE_LABELS, LEVEL_CIRCLE_COLORS } from "@workspace/evalion/lib/constants";
import { cn } from "@workspace/ui/lib/utils";

import { ColumnChart } from "./column-chart";
import { ConfidenceCircles } from "./confidence-circles";
import type { RoundDistribution, StudentData } from "./types";

import type { Fasit } from "@/lib/types";

interface ResultatTabProps {
  round1: RoundDistribution;
  round2: RoundDistribution;
  fasit: Fasit;
  statementText: string;
  avgRating: number;
  ratingDistribution: Array<{ score: number; count: number }>;
  students: StudentData[];
}

export function ResultatTab({
  round1,
  round2,
  fasit,
  statementText,
  avgRating,
  ratingDistribution,
  students,
}: ResultatTabProps) {
  const [showRatingDetail, setShowRatingDetail] = useState(false);

  const makeItems = (dist: RoundDistribution) => [
    { label: "Sant", count: dist.sant, pct: dist.santPct, colorClass: "bg-neutral-300", isCorrect: fasit === "sant" },
    { label: "Delvis", count: dist.delvis, pct: dist.delvisPct, colorClass: "bg-delvis", isCorrect: fasit === "delvis" },
    { label: "Usant", count: dist.usant, pct: dist.usantPct, colorClass: "bg-neutral-300", isCorrect: fasit === "usant" },
  ];

  const sortedStudents = useMemo(
    () =>
      [...students]
        .filter((s) => s.round1 || s.round2)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [students],
  );

  return (
    <div className="flex flex-col gap-3.5">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="mx-3.5 mt-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-2.5 text-center">
          <p className="text-xs font-semibold italic leading-relaxed text-purple-800">
            «{statementText}»
          </p>
        </div>

        <div className="px-3.5 pt-4 pb-0">
          <div className="text-[10px] font-semibold text-muted-foreground">Stemmefordeling</div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 px-3.5 pb-2">
          <div>
            <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Runde 1
            </div>
            <ColumnChart items={makeItems(round1)} />
          </div>
          <div>
            <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Runde 2
            </div>
            <ColumnChart items={makeItems(round2)} />
          </div>
        </div>

        {avgRating > 0 && (
          <>
            <div className="flex items-center justify-between border-t border-neutral-100 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Gjennomsnittlig forståelse:
                </span>
                <span className="font-mono text-[22px] font-extrabold text-secondary-foreground">
                  {avgRating.toFixed(1)}
                </span>
              </div>
              <button
                onClick={() => setShowRatingDetail(!showRatingDetail)}
                className={`flex size-8 items-center justify-center rounded-[10px] border-[1.5px] transition-all ${
                  showRatingDetail
                    ? "border-primary/30 bg-primary/5"
                    : "border-neutral-200 bg-white hover:bg-neutral-100"
                }`}
              >
                <BarChart3
                  className={`size-4 ${showRatingDetail ? "text-primary" : "text-muted-foreground"}`}
                />
              </button>
            </div>
            {showRatingDetail && (
              <div className="border-t border-neutral-100 px-3.5 py-2.5">
                <ConfidenceCircles
                  distribution={ratingDistribution.map((r) => ({
                    level: r.score,
                    count: r.count,
                  }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-3.5 py-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Alle elever
          </span>
        </div>
        <div className="flex flex-col px-3.5">
          {sortedStudents.map((s) => (
            <div
              key={s.studentId}
              className="flex items-center gap-2.5 border-b border-neutral-100 py-2 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-foreground">{s.name}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {s.round1 && (
                  <div className="flex items-center gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.round1.vote as Fasit]}`}
                    >
                      {VOTE_LABELS[s.round1.vote as Fasit]}
                    </span>
                    {s.round2 && (
                      <>
                        <span className="text-[10px] text-muted-foreground">→</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.round2.vote as Fasit]}`}
                        >
                          {VOTE_LABELS[s.round2.vote as Fasit]}
                        </span>
                      </>
                    )}
                  </div>
                )}
                {s.rating != null && (
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full border-[2.5px] text-xs font-extrabold",
                      LEVEL_CIRCLE_COLORS[s.rating]?.border ?? "border-neutral-300",
                      LEVEL_CIRCLE_COLORS[s.rating]?.text ?? "text-neutral-500",
                    )}
                  >
                    {s.rating}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

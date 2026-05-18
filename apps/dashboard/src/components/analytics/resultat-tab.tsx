import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import {
  VOTE_DOT_COLORS,
  VOTE_LABELS,
  LEVEL_CIRCLE_COLORS,
} from "@workspace/features/lib/constants";
import { cn } from "@workspace/ui/lib/utils";
import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";

import type { Fasit } from "@/lib/types";

import { ColumnChart } from "./column-chart";
import { ConfidenceCircles } from "./confidence-circles";
import { HighlightedReorderPanel } from "./highlighted-reorder-panel";
import { getStatementGradient, type RoundDistribution, type StudentData } from "./types";

interface ResultatTabProps {
  round1: RoundDistribution;
  round2: RoundDistribution;
  fasit: Fasit;
  statementText: string;
  statementColor: string | undefined;
  statementIndex: number;
  sessionId: Id<"liveSessions">;
  avgRating: number;
  ratingDistribution: Array<{ score: number; count: number }>;
  students: StudentData[];
  onToggleHighlight?: (id: Id<"sessionJustifications">, next: boolean) => void;
}

/** Bucket students by round-2 correctness × confidence so teachers can
 * prioritise feedback. Order: confident-correct → unsure-correct → unsure-wrong
 * → confident-wrong (the last is the most worth addressing). Students without a
 * round-2 vote land at the very end so they don't crowd out the meaningful
 * buckets. */
function r2Bucket(s: StudentData): number {
  if (!s.round2) return 5;
  const correct = s.round2.correct;
  const high = (s.round2.confidence ?? 0) >= 4;
  if (correct && high) return 1;
  if (correct) return 2;
  if (!high) return 3;
  return 4;
}

export function ResultatTab({
  round1,
  round2,
  fasit,
  statementText,
  statementColor,
  statementIndex,
  sessionId,
  avgRating,
  ratingDistribution,
  students,
  onToggleHighlight,
}: ResultatTabProps) {
  const [showRatingDetail, setShowRatingDetail] = useState(false);
  const gradient = getStatementGradient(statementColor, statementIndex);

  const makeItems = (dist: RoundDistribution) => [
    { label: "Sant", count: dist.sant, pct: dist.santPct, isCorrect: fasit === "sant" },
    {
      label: "Delvis sant",
      count: dist.delvis,
      pct: dist.delvisPct,
      isCorrect: fasit === "delvis",
    },
    { label: "Usant", count: dist.usant, pct: dist.usantPct, isCorrect: fasit === "usant" },
  ];

  const sortedStudents = useMemo(
    () =>
      [...students]
        .filter((s) => s.round1 || s.round2)
        .sort((a, b) => {
          const bucketDiff = r2Bucket(a) - r2Bucket(b);
          if (bucketDiff !== 0) return bucketDiff;
          // Within a bucket, the loudest voices first — highest R2 confidence
          // bubbles up so the most overconfident wrong / strongest correct
          // answers are at the top of their bucket.
          const confDiff = (b.round2?.confidence ?? 0) - (a.round2?.confidence ?? 0);
          if (confDiff !== 0) return confDiff;
          return a.name.localeCompare(b.name, "nb");
        }),
    [students],
  );

  return (
    <div className="flex flex-col gap-3.5">
      <HighlightedReorderPanel sessionId={sessionId} statementIndex={statementIndex} />
      <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
        <div
          className="mx-3.5 mt-3.5 rounded-[12px] p-2.5 text-center"
          style={{ background: gradient.background }}
        >
          <p
            className="text-xs font-semibold italic leading-relaxed"
            style={{ color: gradient.text }}
          >
            «{statementText}»
          </p>
        </div>

        <div className="px-3.5 pt-4 pb-0">
          <div className="text-[10px] font-semibold text-muted-foreground">Stemmefordeling</div>
        </div>

        <div className="flex flex-col gap-4 px-3.5 pt-2 pb-2">
          <div>
            <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Runde 1
            </div>
            <ColumnChart items={makeItems(round1)} compact />
          </div>
          <div>
            <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Runde 2
            </div>
            <ColumnChart items={makeItems(round2)} compact />
          </div>
        </div>

        {avgRating > 0 && (
          <>
            <div className="flex items-center justify-between border-t border-neutral-100 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Gjennomsnittlig forståelse:
                </span>
                <span className="font-mono text-[22px] font-extrabold text-foreground">
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

      <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-3.5 py-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Alle elever
          </span>
        </div>
        <div className="flex max-h-96 flex-col overflow-y-auto">
          {sortedStudents.map((s) => {
            const r1 = s.round1;
            const r2 = s.round2;
            // Collapse the R1 → R2 display when both votes AND confidences match;
            // showing "sant/4 → sant/4" carries no information beyond "sant/4".
            const collapseRounds =
              r1 && r2 && r1.vote === r2.vote && r1.confidence === r2.confidence;
            // Prefer R2 begrunnelse, fall back to R1 (which is what most
            // students actually wrote — during the step-2 discussion).
            const j = s.justificationR2 ?? s.justificationR1;
            const highlighted = j?.highlighted ?? false;
            const canHighlight = !!j && !!onToggleHighlight;
            const toggleHighlight = () => {
              if (j && onToggleHighlight) onToggleHighlight(j._id, !j.highlighted);
            };

            return (
              <div
                key={s.studentId}
                className={cn(
                  "flex flex-col gap-1.5 border-b border-l-[3px] border-l-transparent border-neutral-100 px-3.5 py-2.5 last:border-b-0",
                  highlighted && "border-l-primary bg-primary/8",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-foreground">{s.name}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {r1 && <VoteWithConfidence vote={r1.vote} confidence={r1.confidence} />}
                    {!collapseRounds && r1 && r2 && (
                      <span className="text-[10px] text-muted-foreground">→</span>
                    )}
                    {!collapseRounds && r2 && (
                      <VoteWithConfidence vote={r2.vote} confidence={r2.confidence} />
                    )}
                  </div>
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
                {j && (
                  <button
                    type="button"
                    onClick={toggleHighlight}
                    disabled={!canHighlight}
                    aria-pressed={highlighted}
                    aria-label={
                      highlighted ? "Fjern fremheving av begrunnelse" : "Fremhev begrunnelse"
                    }
                    className={cn(
                      "rounded-md border border-transparent px-2 py-1.5 text-left text-[11px] italic leading-relaxed text-muted-foreground transition-colors",
                      canHighlight ? "cursor-pointer hover:bg-neutral-50" : "cursor-default",
                      highlighted &&
                        "border-primary/40 bg-primary/10 text-foreground hover:bg-primary/15",
                    )}
                  >
                    «{j.text}»
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VoteWithConfidence({
  vote,
  confidence,
}: {
  vote: string;
  confidence: number | null;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[vote as Fasit]}`}
      >
        {VOTE_LABELS[vote as Fasit]}
      </span>
      {confidence != null && (
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full border-[2px] text-[10px] font-extrabold leading-none",
            LEVEL_CIRCLE_COLORS[confidence]?.border ?? "border-neutral-300",
            LEVEL_CIRCLE_COLORS[confidence]?.text ?? "text-neutral-500",
          )}
        >
          {confidence}
        </div>
      )}
    </div>
  );
}

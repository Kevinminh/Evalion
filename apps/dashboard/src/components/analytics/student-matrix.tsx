import { VOTE_DOT_COLORS, VOTE_LABELS, LEVEL_CIRCLE_COLORS } from "@workspace/ui/lib/constants";
import type { Fasit } from "@workspace/ui/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";

interface MatrixCell {
  label: string;
  count: number;
  colorClass: string;
  textClass: string;
  students: Array<{
    name: string;
    vote: "sant" | "usant" | "delvis";
    confidence: number | null;
    begrunnelse?: string | null;
    vote2?: "sant" | "usant" | "delvis";
  }>;
}

interface StudentMatrixProps {
  cells: MatrixCell[];
  title?: string;
}

export function StudentMatrix({ cells, title = "Elevkategorisering" }: StudentMatrixProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="px-3.5 py-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="px-3.5 pb-3.5">
        <div className="grid grid-cols-2 gap-2">
          {cells.map((cell, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-[14px] p-3 text-center transition-all",
                cell.colorClass,
                selectedIdx === i && "ring-2 ring-primary ring-offset-1",
              )}
            >
              <span className={cn("text-[11px] font-bold leading-tight", cell.textClass)}>
                {cell.label}
              </span>
              <span className={cn("text-[22px] font-extrabold leading-none", cell.textClass)}>
                {cell.count}
              </span>
            </button>
          ))}
        </div>

        {/* Student list for selected category */}
        {selectedIdx !== null && cells[selectedIdx] && (
          <div className="mt-3 border-t border-neutral-100 pt-2">
            <div className="pb-2 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {cells[selectedIdx]!.label} ({cells[selectedIdx]!.students.length})
            </div>
            <div className="flex flex-col">
              {cells[selectedIdx]!.students.map((s, j) => (
                <div key={j} className="flex items-start gap-2.5 border-b border-neutral-100 py-2 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-foreground">{s.name}</div>
                    {s.begrunnelse && (
                      <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {s.begrunnelse}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {s.vote2 ? (
                      <div className="flex items-center gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.vote as Fasit]}`}>
                          {VOTE_LABELS[s.vote as Fasit]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">→</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.vote2 as Fasit]}`}>
                          {VOTE_LABELS[s.vote2 as Fasit]}
                        </span>
                      </div>
                    ) : (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.vote as Fasit]}`}>
                        {VOTE_LABELS[s.vote as Fasit]}
                      </span>
                    )}
                    {s.confidence != null && (
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full border-[2.5px] text-[11px] font-extrabold",
                          LEVEL_CIRCLE_COLORS[s.confidence]?.border ?? "border-neutral-300",
                          LEVEL_CIRCLE_COLORS[s.confidence]?.text ?? "text-neutral-500",
                        )}
                      >
                        {s.confidence}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

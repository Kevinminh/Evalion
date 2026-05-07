import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import {
  VOTE_DOT_COLORS,
  VOTE_LABELS,
  LEVEL_CIRCLE_COLORS,
} from "@workspace/evalion/lib/constants";
import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

import type { BegrunnelseRef } from "./types";

interface MatrixCell {
  label: string;
  count: number;
  colorClass?: string;
  textClass?: string;
  students: Array<{
    name: string;
    vote: "sant" | "usant" | "delvis";
    confidence: number | null;
    begrunnelse?: BegrunnelseRef | null;
    vote2?: "sant" | "usant" | "delvis";
  }>;
}

interface StudentMatrixProps {
  cells: MatrixCell[];
  title?: string;
  layout?: "r1" | "r2";
  selectedIdx: number | null;
  onSelect: (idx: number | null) => void;
  onToggleHighlight?: (id: Id<"sessionBegrunnelser">, next: boolean) => void;
}

export function StudentMatrix({
  cells,
  title = "Elevkategorisering",
  layout = "r1",
  selectedIdx,
  onSelect,
  onToggleHighlight,
}: StudentMatrixProps) {
  const selected = selectedIdx !== null ? cells[selectedIdx] : null;

  const handleSelect = (i: number) => onSelect(selectedIdx === i ? null : i);

  return (
    <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
      <div className="px-3.5 py-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="px-3.5 pb-3.5">
        {layout === "r1" ? (
          <R1Matrix cells={cells} selectedIdx={selectedIdx} onSelect={handleSelect} />
        ) : (
          <R2Matrix cells={cells} selectedIdx={selectedIdx} onSelect={handleSelect} />
        )}

        {selected && (
          <div className="mt-3 border-t border-neutral-100 pt-2">
            <div className="pb-2 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {selected.label} ({selected.students.length})
            </div>
            <div className="-mx-3.5 flex flex-col">
              {selected.students.map((s, j) => {
                const canHighlight = !!s.begrunnelse && !!onToggleHighlight;
                const highlighted = s.begrunnelse?.highlighted ?? false;
                const handleClick = () => {
                  if (s.begrunnelse && onToggleHighlight) {
                    onToggleHighlight(s.begrunnelse._id, !s.begrunnelse.highlighted);
                  }
                };
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={handleClick}
                    disabled={!canHighlight}
                    aria-pressed={highlighted}
                    className={cn(
                      "flex w-full items-start gap-2.5 border-b border-neutral-100 px-3.5 py-2 text-left transition-colors last:border-b-0",
                      canHighlight ? "cursor-pointer hover:bg-neutral-50" : "cursor-default",
                      highlighted &&
                        "border-l-[3px] border-l-primary bg-primary/8 hover:bg-primary/10",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-foreground">{s.name}</div>
                      {s.begrunnelse?.text ? (
                        <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          {s.begrunnelse.text}
                        </div>
                      ) : (
                        <div className="mt-0.5 text-[11px] italic leading-relaxed text-muted-foreground/70">
                          Ingen begrunnelse skrevet
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {s.vote2 ? (
                        <div className="flex items-center gap-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.vote as Fasit]}`}
                          >
                            {VOTE_LABELS[s.vote as Fasit]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">→</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.vote2 as Fasit]}`}
                          >
                            {VOTE_LABELS[s.vote2 as Fasit]}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[s.vote as Fasit]}`}
                        >
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
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MatrixHint() {
  return (
    <div className="flex justify-center">
      <span className="rounded-[16px] border border-primary/20 bg-primary/5 px-5 py-2.5 text-center text-[12px] font-semibold text-primary/80">
        Trykk på kategoriene for å se de individuelle elevbidragene
      </span>
    </div>
  );
}

function R1Matrix({
  cells,
  selectedIdx,
  onSelect,
}: {
  cells: MatrixCell[];
  selectedIdx: number | null;
  onSelect: (i: number) => void;
}) {
  const cellAt = (i: number) => cells[i];
  const cellButton = (i: number) => {
    const c = cellAt(i);
    if (!c) return null;
    const isSelected = selectedIdx === i;
    return (
      <button
        type="button"
        onClick={() => onSelect(i)}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-[12px] border-2 px-3 py-2.5 text-center transition-all",
          isSelected
            ? "border-primary/40 bg-primary/10 ring-2 ring-primary/15"
            : "border-neutral-200 bg-white hover:bg-neutral-50",
        )}
      >
        <span className="text-base font-extrabold leading-tight text-foreground">
          {c.count} stk
        </span>
      </button>
    );
  };

  return (
    <div
      className="grid items-center gap-x-2 gap-y-2"
      style={{ gridTemplateColumns: "auto 1fr 1fr" }}
    >
      <div />
      <div className="text-center text-[11px] font-bold text-muted-foreground">
        Riktig standpunkt
      </div>
      <div className="text-center text-[11px] font-bold text-muted-foreground">Feil standpunkt</div>

      <div className="pr-2 text-right text-[11px] font-bold whitespace-nowrap text-muted-foreground">
        Høy sikkerhet (4-5)
      </div>
      {cellButton(0)}
      {cellButton(1)}

      <div className="pr-2 text-right text-[11px] font-bold whitespace-nowrap text-muted-foreground">
        Lav sikkerhet (1-3)
      </div>
      {cellButton(2)}
      {cellButton(3)}
    </div>
  );
}

function R2Matrix({
  cells,
  selectedIdx,
  onSelect,
}: {
  cells: MatrixCell[];
  selectedIdx: number | null;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {cells.map((cell, i) => {
        const isSelected = selectedIdx === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-[14px] border-2 border-transparent p-3 text-center transition-all",
              cell.colorClass,
              isSelected && "border-primary/40 ring-2 ring-primary/15",
            )}
          >
            <span className={cn("text-[11px] font-bold leading-tight", cell.textClass)}>
              {cell.label}
            </span>
            <span className={cn("text-[22px] font-extrabold leading-none", cell.textClass)}>
              {cell.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

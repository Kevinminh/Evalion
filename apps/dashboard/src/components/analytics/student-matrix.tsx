import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import {
  VOTE_DOT_COLORS,
  VOTE_LABELS,
  LEVEL_CIRCLE_COLORS,
} from "@workspace/features/lib/constants";
import type { Fasit } from "@workspace/api/types";
import { cn } from "@workspace/ui/lib/utils";

import type { JustificationRef } from "./types";

interface MatrixStudent {
  name: string;
  /** R1 vote (or the sole vote in round-1 layout). */
  vote: Fasit;
  /** R1 confidence (or the sole confidence in round-1 layout). */
  confidence: number | null;
  /** R1 begrunnelse (or the sole begrunnelse in round-1 layout). */
  justification?: JustificationRef | null;
  /** R2 vote — only set in round-2 layout. */
  vote2?: Fasit;
  /** R2 confidence — only set in round-2 layout. */
  confidence2?: number | null;
  /** R2 begrunnelse — only set in round-2 layout. */
  justification2?: JustificationRef | null;
}

interface MatrixCell {
  label: string;
  count: number;
  colorClass?: string;
  textClass?: string;
  students: MatrixStudent[];
}

interface StudentMatrixProps {
  cells: MatrixCell[];
  title?: string;
  layout?: "r1" | "r2";
  selectedIdx: number | null;
  onSelect: (idx: number | null) => void;
  onToggleHighlight?: (id: Id<"sessionJustifications">, next: boolean) => void;
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
            <div className="-mx-3.5 flex max-h-96 flex-col overflow-y-auto">
              {selected.students.map((s, j) =>
                s.vote2 ? (
                  <R2StudentRow key={j} s={s} onToggleHighlight={onToggleHighlight} />
                ) : (
                  <R1StudentRow key={j} s={s} onToggleHighlight={onToggleHighlight} />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function R1StudentRow({
  s,
  onToggleHighlight,
}: {
  s: MatrixStudent;
  onToggleHighlight?: (id: Id<"sessionJustifications">, next: boolean) => void;
}) {
  const canHighlight = !!s.justification && !!onToggleHighlight;
  const highlighted = s.justification?.highlighted ?? false;
  const handleClick = () => {
    if (s.justification && onToggleHighlight) {
      onToggleHighlight(s.justification._id, !s.justification.highlighted);
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canHighlight}
      aria-pressed={highlighted}
      className={cn(
        "flex w-full items-start gap-2.5 border-b border-neutral-100 px-3.5 py-2 text-left transition-colors last:border-b-0",
        canHighlight ? "cursor-pointer hover:bg-neutral-50" : "cursor-default",
        highlighted && "border-l-[3px] border-l-primary bg-primary/8 hover:bg-primary/10",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-foreground">{s.name}</div>
        {s.justification?.text ? (
          <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            {s.justification.text}
          </div>
        ) : (
          <div className="mt-0.5 text-[11px] italic leading-relaxed text-muted-foreground/70">
            Ingen begrunnelse skrevet
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <VoteChip vote={s.vote} />
        {s.confidence != null && <ConfBadge value={s.confidence} />}
      </div>
    </button>
  );
}

function R2StudentRow({
  s,
  onToggleHighlight,
}: {
  s: MatrixStudent;
  onToggleHighlight?: (id: Id<"sessionJustifications">, next: boolean) => void;
}) {
  const j1 = s.justification ?? null;
  const j2 = s.justification2 ?? null;
  // Unchanged stance: show the vote once with both confidences side-by-side
  // (e.g. "Delvis sant (3) (5)"). Changed stance: show "Sant (3) → Usant (4)".
  const collapseStance = s.vote === s.vote2;
  return (
    <div className="flex flex-col gap-1 border-b border-neutral-100 px-3.5 py-2 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 truncate text-[13px] font-bold text-foreground">
          {s.name}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <VoteChip vote={s.vote} />
          {s.confidence != null && <ConfBadge value={s.confidence} />}
          {!collapseStance && (
            <>
              <span className="text-[10px] text-muted-foreground">→</span>
              {s.vote2 && <VoteChip vote={s.vote2} />}
            </>
          )}
          {s.confidence2 != null && <ConfBadge value={s.confidence2} />}
        </div>
      </div>
      {j1 || j2 ? (
        <div className="flex flex-col gap-1">
          {j1 && (
            <JustificationButton label="Runde 1" j={j1} onToggleHighlight={onToggleHighlight} />
          )}
          {j2 && (
            <JustificationButton label="Runde 2" j={j2} onToggleHighlight={onToggleHighlight} />
          )}
        </div>
      ) : (
        <div className="text-[11px] italic leading-relaxed text-muted-foreground/70">
          Ingen begrunnelse skrevet
        </div>
      )}
    </div>
  );
}

function JustificationButton({
  label,
  j,
  onToggleHighlight,
}: {
  label: string;
  j: JustificationRef;
  onToggleHighlight?: (id: Id<"sessionJustifications">, next: boolean) => void;
}) {
  const canHighlight = !!onToggleHighlight;
  const highlighted = j.highlighted;
  return (
    <button
      type="button"
      onClick={() => onToggleHighlight?.(j._id, !j.highlighted)}
      disabled={!canHighlight}
      aria-pressed={highlighted}
      className={cn(
        "rounded-md border border-transparent px-2 py-1 text-left text-[11px] leading-relaxed transition-colors",
        canHighlight ? "cursor-pointer hover:bg-neutral-50" : "cursor-default",
        highlighted && "border-primary/40 bg-primary/10 hover:bg-primary/15",
      )}
    >
      <span className="font-bold text-muted-foreground">{label}: </span>
      {j.text ? (
        <span className={cn("italic", highlighted ? "text-foreground" : "text-muted-foreground")}>
          «{j.text}»
        </span>
      ) : (
        <span className="italic text-muted-foreground/70">Ingen begrunnelse skrevet</span>
      )}
    </button>
  );
}

function VoteChip({ vote }: { vote: Fasit }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${VOTE_DOT_COLORS[vote]}`}
    >
      {VOTE_LABELS[vote]}
    </span>
  );
}

function ConfBadge({ value }: { value: number }) {
  return (
    <div
      className={cn(
        "flex size-6 items-center justify-center rounded-full border-[2.5px] text-[11px] font-extrabold",
        LEVEL_CIRCLE_COLORS[value]?.border ?? "border-neutral-300",
        LEVEL_CIRCLE_COLORS[value]?.text ?? "text-neutral-500",
      )}
    >
      {value}
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
          "flex w-full flex-col items-center justify-center rounded-[12px] border-2 px-7 py-2.5 text-center transition-all",
          isSelected
            ? "border-primary/40 bg-primary/10 ring-2 ring-primary/15"
            : "border-neutral-200 bg-white hover:bg-neutral-50",
        )}
      >
        <span
          className={cn(
            "text-base font-extrabold leading-tight",
            isSelected ? "text-primary" : "text-foreground",
          )}
        >
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

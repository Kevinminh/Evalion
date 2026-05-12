import { useQuery } from "@tanstack/react-query";
import {
  LEVEL_CIRCLE_COLORS,
  VOTE_DOT_COLORS,
  VOTE_LABELS,
} from "@workspace/evalion/lib/constants";
import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";

import { liveSessionQueries } from "@/lib/convex";

import { useStudentGame } from "./student-game-context";

interface RoundData {
  vote: Fasit;
  confidence: number;
  reason?: string;
}

interface ColumnProps {
  label: string;
  data: RoundData | null;
}

function Column({ label, data }: ColumnProps) {
  const ring = data ? LEVEL_CIRCLE_COLORS[data.confidence] : null;
  return (
    <div className="min-w-0 text-center">
      <div className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {data ? (
        <div className="flex items-center justify-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-[3px] text-xs font-bold text-white",
              VOTE_DOT_COLORS[data.vote],
            )}
          >
            {VOTE_LABELS[data.vote]}
          </span>
          <span
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-full border-[2.5px] bg-transparent text-[11px] font-extrabold",
              ring?.border,
              ring?.text,
            )}
          >
            {data.confidence}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-neutral-400 px-2.5 py-[3px] text-xs font-bold text-transparent">
            Usant
          </span>
          <span className="inline-flex size-6 items-center justify-center rounded-full border-[1.5px] border-dashed border-neutral-400" />
        </div>
      )}
    </div>
  );
}

export function MineSvarPanel() {
  const { session, student, statementIndex, votes } = useStudentGame();
  const [open, setOpen] = useState(false);

  // Subscribe to begrunnelser only while the panel is open — keeps the
  // long-running Convex WebSocket cost off all the other students' steps.
  const { data: begrunnelser } = useQuery(
    liveSessionQueries.getMyBegrunnelser(
      open ? session._id : "skip",
      student._id,
      statementIndex,
    ),
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  let myR1Vote: (typeof votes)[number] | undefined;
  let myR2Vote: (typeof votes)[number] | undefined;
  for (const v of votes) {
    if (v.studentId !== student._id) continue;
    if (v.round === 1) myR1Vote = v;
    else if (v.round === 2) myR2Vote = v;
  }

  if (!myR1Vote && !myR2Vote) return null;

  const r1Begrunnelse = begrunnelser?.find((b) => b.round === 1)?.text;

  const r1: RoundData | null = myR1Vote
    ? { vote: myR1Vote.vote, confidence: myR1Vote.confidence ?? 0, reason: r1Begrunnelse }
    : null;
  const r2: RoundData | null = myR2Vote
    ? { vote: myR2Vote.vote, confidence: myR2Vote.confidence ?? 0 }
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Mine svar"
        aria-label="Mine svar"
        className="fixed bottom-6 left-4 z-40 flex size-10 items-center justify-center rounded-full bg-neutral-400 text-white shadow-md transition-all hover:scale-110 hover:bg-neutral-500 active:scale-95"
      >
        <MessageSquare className="size-5" strokeWidth={2} />
      </button>

      {open && (
        <div
          role="presentation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 pt-12"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mine svar"
            onClick={(e) => e.stopPropagation()}
            className="w-[60%] max-w-[420px] animate-mine-svar-slide-up overflow-y-auto rounded-2xl bg-white text-left shadow-lg"
          >
            <div className="relative flex items-center justify-center border-b border-neutral-100 px-4 py-3">
              <span className="text-[15px] font-extrabold text-foreground">Mine svar</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Lukk"
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 text-muted-foreground transition-colors hover:bg-neutral-200"
              >
                <X className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="flex gap-10">
                <Column label="Runde 1" data={r1} />
                <Column label="Runde 2" data={r2} />
              </div>
              {r1?.reason && (
                <div className="mt-3 w-full rounded-lg bg-neutral-50 px-3 py-2 text-xs italic leading-relaxed text-muted-foreground">
                  {r1.reason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

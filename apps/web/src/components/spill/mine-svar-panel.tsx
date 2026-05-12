import { useQuery } from "@tanstack/react-query";
import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";

import { liveSessionQueries } from "@/lib/convex";

import { useStudentGame } from "./student-game-context";

const VOTE_LABEL: Record<Fasit, string> = {
  sant: "Sant",
  delvis: "Delvis sant",
  usant: "Usant",
};

const VOTE_BADGE_BG: Record<Fasit, string> = {
  sant: "bg-sant",
  delvis: "bg-delvis",
  usant: "bg-usant",
};

const CONF_RING: Record<number, string> = {
  1: "border-[var(--color-rating-1)] text-[var(--color-rating-1)]",
  2: "border-[var(--color-rating-2)] text-[var(--color-rating-2)]",
  3: "border-[var(--color-rating-3)] text-[var(--color-rating-3-text)]",
  4: "border-[var(--color-rating-4)] text-[var(--color-rating-4)]",
  5: "border-[var(--color-rating-5)] text-[var(--color-rating-5)]",
};

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
              VOTE_BADGE_BG[data.vote],
            )}
          >
            {VOTE_LABEL[data.vote]}
          </span>
          <span
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-full border-[2.5px] text-[11px] font-extrabold",
              CONF_RING[data.confidence],
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

  const { data: begrunnelser } = useQuery(
    liveSessionQueries.getMyBegrunnelser(session._id, student._id, statementIndex),
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const myR1Vote = votes.find((v) => v.studentId === student._id && v.round === 1);
  const myR2Vote = votes.find((v) => v.studentId === student._id && v.round === 2);

  // Only show the FAB once the student has voted at least once.
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
            style={{ animation: "mineSvarSlideUp 0.25s ease both" }}
            className="w-[60%] max-w-[420px] overflow-y-auto rounded-2xl bg-white text-left shadow-lg"
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

      <style>{`
        @keyframes mineSvarSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

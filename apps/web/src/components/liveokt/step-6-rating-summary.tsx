import { BackButton } from "@workspace/evalion/components/live/back-button";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import type { Fasit } from "@workspace/evalion/lib/types";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useState } from "react";

import { DestructiveButton } from "@workspace/ui/components/destructive-button";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";
import type { TeacherStep } from "@/types/teacher-step";
import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useTeacherSession } from "./teacher-session-context";

const CIRCLE_STYLE: { border: string; text: string }[] = [
  { border: "#EF5350", text: "#EF5350" },
  { border: "#FF9800", text: "#FF9800" },
  { border: "#FDD835", text: "#b8a000" },
  { border: "#66BB6A", text: "#66BB6A" },
  { border: "#2E7D32", text: "#2E7D32" },
];

const CORRECT_FILL: Record<Fasit, string> = {
  sant: "#66BB6A",
  delvis: "#FF9800",
  usant: "#EF5350",
};

const CORRECT_TEXT: Record<Fasit, string> = {
  sant: "#2E7D32",
  delvis: "#b8860b",
  usant: "#C62828",
};

const VOTE_LABELS: Record<Fasit, string> = {
  sant: "Sant",
  delvis: "Delvis",
  usant: "Usant",
};

function countByVote(votes: Doc<"sessionVotes">[]) {
  const counts: Record<Fasit, number> = { sant: 0, delvis: 0, usant: 0 };
  for (const v of votes) counts[v.vote]++;
  return counts;
}

interface DualDistColumnProps {
  title: string;
  votes: Doc<"sessionVotes">[];
  correctKey?: Fasit;
}

function DualDistColumn({ title, votes, correctKey }: DualDistColumnProps) {
  const counts = countByVote(votes);
  const total = votes.length;
  const order: Fasit[] = ["sant", "delvis", "usant"];
  const maxCount = Math.max(counts.sant, counts.delvis, counts.usant, 1);

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div
        className="text-center text-[11px] font-bold uppercase text-[#616161]"
        style={{ letterSpacing: "0.4px" }}
      >
        {title}
      </div>
      <div className="flex items-end justify-center gap-2 px-0 py-1">
        {order.map((key) => {
          const count = counts[key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const fillHeight = total > 0 ? (count / maxCount) * 100 : 0;
          const isCorrect = key === correctKey;
          const fillBg = isCorrect ? CORRECT_FILL[key] : "#E0E0E0";
          const textColor = isCorrect ? CORRECT_TEXT[key] : "#9E9E9E";

          return (
            <div
              key={key}
              className="flex max-w-[90px] flex-1 flex-col items-center gap-0.5"
            >
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  isCorrect ? "font-extrabold" : "font-semibold",
                )}
                style={{ color: textColor }}
              >
                {count} stk
              </span>
              <div className="relative flex h-[55px] w-full items-end overflow-hidden rounded-md bg-[#F5F5F5]">
                <div
                  className="flex w-full items-center justify-center rounded-b-md transition-[height] duration-[400ms]"
                  style={{
                    backgroundColor: fillBg,
                    height: `${Math.max(fillHeight, count > 0 ? 30 : 0)}%`,
                    minHeight: count > 0 ? 16 : 0,
                  }}
                >
                  {count > 0 && (
                    <span
                      className={cn(
                        "text-[9px] tabular-nums",
                        isCorrect ? "font-extrabold text-white" : "font-semibold text-[#616161]",
                      )}
                    >
                      {pct}%
                    </span>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "mt-0.5 text-[10px]",
                  isCorrect ? "font-extrabold" : "font-semibold",
                )}
                style={{ color: textColor }}
              >
                {VOTE_LABELS[key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function useStep6(): TeacherStep {
  const {
    statement,
    fagprat,
    selectedIdx,
    usedStatements,
    markStatementUsed,
    goToStep,
    endSession,
    ratingDistribution,
    avgRating,
    r1Votes,
    r2Votes,
  } = useTeacherSession();
  const [confDetailOpen, setConfDetailOpen] = useState(false);

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <TeacherStepLayout
      top={
        <div className="flex w-full items-center justify-between">
          <BackButton onClick={() => goToStep(0)} />
          {statement && <FasitBadge fasit={statement.fasit} size="lg" />}
        </div>
      }
      statement={
        statement && (
          <StatementCard statement={statement} size="lg" color={statementColor} gradient />
        )
      }
      professor={
        <Professor
          size="md"
          bordered
          animate
          textSize="lg"
          text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
        />
      }
    />
  );

  const totalRatings = ratingDistribution.reduce((sum, d) => sum + d.count, 0);

  const panel = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <p className="shrink-0 px-1 text-xs font-bold uppercase tracking-[0.08em] text-[#616161]">
        Resultat
      </p>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-3 shadow-[0_4px_6px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.04)]">
        {/* conf-summary-row */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
          <span className="text-xs font-semibold text-[#9E9E9E]">
            Gjennomsnittlig forståelse:
          </span>
          <span
            className="font-mono font-extrabold leading-none text-[#1FA89F] tabular-nums"
            style={{ fontSize: 22 }}
          >
            {avgRating !== undefined ? avgRating.toFixed(1).replace(".", ",") : "–"}
          </span>
          <button
            type="button"
            onClick={() => setConfDetailOpen((v) => !v)}
            aria-label="Vis fordelt på score"
            className={cn(
              "ml-auto flex size-8 items-center justify-center rounded-lg border-[1.5px] transition-all",
              confDetailOpen
                ? "border-[#A37EFF] bg-[#F3EEFF] text-[#6C3FC5]"
                : "border-[#EEEEEE] bg-white text-[#9E9E9E] hover:bg-[#F5F5F5]",
            )}
          >
            <BarChart3 className="size-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* conf-detail (collapsible) */}
        {confDetailOpen && (
          <div className="border-t border-[#F5F5F5] px-3 pt-2.5 pb-1">
            <div className="flex justify-center gap-4">
              {ratingDistribution.map((d, i) => {
                const style = CIRCLE_STYLE[i] ?? CIRCLE_STYLE[0]!;
                return (
                  <div key={d.score} className="flex flex-col items-center gap-1.5">
                    <div
                      className="flex size-7 items-center justify-center rounded-full border-[2.5px] bg-transparent text-[11px] font-extrabold leading-none"
                      style={{ borderColor: style.border, color: style.text }}
                    >
                      {d.score}
                    </div>
                    <span className="text-[11px] font-extrabold leading-none text-[#212121]">
                      {d.count} stk
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* chart-sublabel */}
        <p className="px-3 pt-3 text-[10px] font-semibold text-[#9E9E9E]">Stemmefordeling</p>

        {/* dual-dist (Runde 1 + Runde 2) */}
        <div className="flex flex-col gap-3.5 px-3 pt-2 pb-1">
          <DualDistColumn title="Runde 1" votes={r1Votes} correctKey={statement?.fasit} />
          <DualDistColumn title="Runde 2" votes={r2Votes} correctKey={statement?.fasit} />
        </div>

        {totalRatings === 0 && (
          <p className="px-3 pb-2 text-center text-xs italic text-[#9E9E9E]">
            Venter på elevenes vurderinger…
          </p>
        )}
      </div>
    </div>
  );

  const unusedCount =
    fagprat.statements.length - usedStatements.size - (usedStatements.has(selectedIdx) ? 0 : 1);
  const hasMoreStatements = unusedCount > 0;

  const panelFooter = (
    <div className="flex gap-2">
      {hasMoreStatements && (
        <PrimaryActionButton
          className="flex-1"
          onClick={() => {
            markStatementUsed(selectedIdx);
            goToStep(0);
          }}
        >
          Neste påstand
          <ArrowRight className="size-4" />
        </PrimaryActionButton>
      )}
      <DestructiveButton className="flex-1" onClick={endSession}>
        Avslutt
      </DestructiveButton>
    </div>
  );

  return { main, panel, panelFooter };
}

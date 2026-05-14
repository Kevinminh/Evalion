import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { BackButton } from "@workspace/features/components/live/back-button";
import { BreakdownRow } from "@workspace/features/components/live/breakdown-row";
import { FasitBadgeOverlay } from "@workspace/features/components/live/fasit-badge-overlay";
import { Professor } from "@workspace/features/components/live/professor";
import { TeacherStepLayout } from "@workspace/features/components/live/teacher-step-layout";
import { resolveStatementHex } from "@workspace/features/lib/constants";
import { formatDecimal1, percentage } from "@workspace/features/lib/format";
import type { Fasit } from "@workspace/api/types";
import { PanelCard } from "@workspace/ui/components/panel-card";
import { PanelSectionLabel } from "@workspace/ui/components/panel-section-label";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useState } from "react";

import { cssVars } from "@/lib/css-vars";
import type { TeacherStep } from "@/types/teacher-step";

import { useTeacherSession } from "./teacher-session-context";

const CIRCLE_STYLE: { border: string; text: string }[] = [
  { border: "var(--color-rating-1)", text: "var(--color-rating-1)" },
  { border: "var(--color-rating-2)", text: "var(--color-rating-2)" },
  { border: "var(--color-rating-3)", text: "var(--color-rating-3-text)" },
  { border: "var(--color-rating-4)", text: "var(--color-rating-4)" },
  { border: "var(--color-rating-5)", text: "var(--color-rating-5)" },
];

const CORRECT_FILL: Record<Fasit, string> = {
  sant: "var(--color-vote-sant)",
  delvis: "var(--color-vote-delvis)",
  usant: "var(--color-vote-usant)",
};

const CORRECT_TEXT: Record<Fasit, string> = {
  sant: "var(--color-vote-sant-text)",
  delvis: "var(--color-vote-delvis-text)",
  usant: "var(--color-vote-usant-text)",
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
      <div className="text-center text-[11px] font-bold uppercase tracking-[0.4px] text-[var(--color-text-ink-soft)]">
        {title}
      </div>
      <div className="flex items-end justify-center gap-2 px-0 py-1">
        {order.map((key) => {
          const count = counts[key];
          const pct = percentage(count, total);
          const fillHeight = total > 0 ? (count / maxCount) * 100 : 0;
          const isCorrect = key === correctKey;
          const fillBg = isCorrect ? CORRECT_FILL[key] : "var(--color-vote-empty-fill)";
          const textColor = isCorrect ? CORRECT_TEXT[key] : "var(--color-vote-empty-text)";

          return (
            <div
              key={key}
              className="flex max-w-[90px] flex-1 flex-col items-center gap-0.5"
              style={cssVars({ "--c-text": textColor, "--c-bar-bg": fillBg })}
            >
              <span
                className={cn(
                  "text-[10px] tabular-nums text-[var(--c-text)]",
                  isCorrect ? "font-extrabold" : "font-semibold",
                )}
              >
                {count} stk
              </span>
              <div className="relative flex h-[55px] w-full items-end overflow-hidden rounded-md bg-[var(--color-rating-bar-track)]">
                <div
                  className="flex w-full items-center justify-center rounded-b-md bg-[var(--c-bar-bg)] transition-[height] duration-[400ms]"
                  style={{
                    height: `${Math.max(fillHeight, count > 0 ? 30 : 0)}%`,
                    minHeight: count > 0 ? 16 : 0,
                  }}
                >
                  {count > 0 && (
                    <span
                      className={cn(
                        "text-[9px] tabular-nums",
                        isCorrect
                          ? "font-extrabold text-white"
                          : "font-semibold text-[var(--color-text-ink-soft)]",
                      )}
                    >
                      {pct}%
                    </span>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "mt-0.5 text-[10px] text-[var(--c-text)]",
                  isCorrect ? "font-extrabold" : "font-semibold",
                )}
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
    ratingDistribution,
    avgRating,
    r1Votes,
    r2Votes,
  } = useTeacherSession();
  const [confDetailOpen, setConfDetailOpen] = useState(false);
  const fasit = statement?.fasit;
  const r2WithConf = r2Votes.filter((v) => typeof v.confidence === "number");
  const r2Correct = fasit ? r2WithConf.filter((v) => v.vote === fasit) : [];
  const r2Wrong = fasit ? r2WithConf.filter((v) => v.vote !== fasit) : [];
  const r2AvgConfCorrect = r2Correct.length
    ? r2Correct.reduce((s, v) => s + (v.confidence ?? 0), 0) / r2Correct.length
    : undefined;
  const r2AvgConfWrong = r2Wrong.length
    ? r2Wrong.reduce((s, v) => s + (v.confidence ?? 0), 0) / r2Wrong.length
    : undefined;

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <TeacherStepLayout
      top={<BackButton onClick={() => goToStep(0)} pulse />}
      statement={
        statement && (
          <FasitBadgeOverlay fasit={statement.fasit}>
            <StatementCard statement={statement} size="lg" color={statementColor} gradient />
          </FasitBadgeOverlay>
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
      <PanelSectionLabel>Resultat</PanelSectionLabel>
      <PanelCard>
        {/* conf-summary-row */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
          <span className="text-xs font-semibold text-[var(--color-text-ink-faint)]">
            Gjennomsnittlig forståelse:
          </span>
          <span className="font-mono text-[22px] font-extrabold leading-none tabular-nums text-[var(--color-turkis-500)]">
            {formatDecimal1(avgRating)}
          </span>
          <button
            type="button"
            onClick={() => setConfDetailOpen((v) => !v)}
            aria-label="Vis fordelt på score"
            className={cn(
              "ml-auto flex size-8 items-center justify-center rounded-lg border-[1.5px] transition-all",
              confDetailOpen
                ? "border-[var(--color-highlight-strip)] bg-[var(--color-highlight-strip-bg)] text-[var(--color-highlight-strip-text)]"
                : "border-[var(--color-divider-soft)] bg-white text-[var(--color-text-ink-faint)] hover:bg-[var(--color-rating-bar-track)]",
            )}
          >
            <BarChart3 className="size-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* conf-detail (collapsible) */}
        {confDetailOpen && (
          <div className="border-t border-[var(--color-rating-bar-track)] px-3 pt-2.5 pb-1">
            <div className="flex justify-center gap-4">
              {ratingDistribution.map((d, i) => {
                const style = CIRCLE_STYLE[i] ?? CIRCLE_STYLE[0]!;
                return (
                  <div
                    key={d.score}
                    className="flex flex-col items-center gap-1.5"
                    style={cssVars({ "--c-border": style.border, "--c-text": style.text })}
                  >
                    <div className="flex size-7 items-center justify-center rounded-full border-[2.5px] border-[var(--c-border)] bg-transparent text-[11px] font-extrabold leading-none text-[var(--c-text)]">
                      {d.score}
                    </div>
                    <span className="text-[11px] font-extrabold leading-none text-[var(--color-text-ink-strong)]">
                      {d.count} stk
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2.5 flex justify-center gap-6 border-t border-[var(--color-rating-bar-track)] pt-2.5">
              <BreakdownRow label="Riktig svar:" value={r2AvgConfCorrect} layout="inline" />
              <BreakdownRow label="Feil svar:" value={r2AvgConfWrong} layout="inline" />
            </div>
          </div>
        )}

        {/* chart-sublabel */}
        <p className="px-3 pt-3 text-[10px] font-semibold text-[var(--color-text-ink-faint)]">
          Stemmefordeling
        </p>

        {/* dual-dist (Runde 1 + Runde 2) */}
        <div className="flex flex-col gap-3.5 px-3 pt-2 pb-1">
          <DualDistColumn title="Runde 1" votes={r1Votes} correctKey={statement?.fasit} />
          <DualDistColumn title="Runde 2" votes={r2Votes} correctKey={statement?.fasit} />
        </div>

        {totalRatings === 0 && (
          <p className="px-3 pb-2 text-center text-xs italic text-[var(--color-text-ink-faint)]">
            Venter på elevenes vurderinger…
          </p>
        )}
      </PanelCard>
    </div>
  );

  const unusedCount =
    fagprat.statements.length - usedStatements.size - (usedStatements.has(selectedIdx) ? 0 : 1);
  const hasMoreStatements = unusedCount > 0;

  const panelFooter = hasMoreStatements ? (
    <PrimaryActionButton
      className="w-full"
      onClick={() => {
        markStatementUsed(selectedIdx);
        goToStep(0);
      }}
    >
      Neste påstand
      <ArrowRight className="size-4" />
    </PrimaryActionButton>
  ) : null;

  return { main, panel, panelFooter };
}

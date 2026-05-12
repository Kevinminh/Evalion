import { BackButton } from "@workspace/evalion/components/live/back-button";
import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { EndringerCard } from "@workspace/evalion/components/live/endringer-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { FASIT_TEXT, resolveStatementHex } from "@workspace/evalion/lib/constants";
import { formatDecimal1 } from "@workspace/evalion/lib/format";
import { PanelSectionLabel } from "@workspace/ui/components/panel-section-label";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { BarChart3 } from "lucide-react";

import { buildVoteBars } from "@/lib/vote-bars";

import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";
import { useState } from "react";

interface Step4Args {
  showCountdown: boolean;
  countdownNumber: number;
  countdownDone: boolean;
}

export function useStep4({ showCountdown, countdownNumber, countdownDone }: Step4Args): TeacherStep {
  const {
    statement,
    panelTab,
    setPanelTab,
    r2CorrectCount,
    r2Total,
    changedToCorrect,
    changedToIncorrect,
    totalChanged,
    r2Votes,
    selectedIdx,
    avgConfidenceR1,
    avgConfidenceR2,
    avgConfidenceR2ByVote,
    goToStep,
  } = useTeacherSession();
  const endringerTab = panelTab === "default" || panelTab === "endringer";
  const [showAvgBreakdown, setShowAvgBreakdown] = useState(false);

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <TeacherStepLayout
        top={<BackButton onClick={() => goToStep(0)} />}
        statement={
          statement && (
            <div className="relative w-full">
              {countdownDone && (
                <div className="absolute left-1/2 -top-1 z-10 -translate-x-1/2 -translate-y-[65%]">
                  <FasitBadge fasit={statement.fasit} animated size="lg" />
                </div>
              )}
              <StatementCard statement={statement} size="lg" color={statementColor} gradient />
            </div>
          )
        }
        professor={
          // Remount on countdownDone so the mockup's pre→post text swap fades
          // in (via fadeInUp with a 200ms delay) instead of switching instantly.
          <div key={countdownDone ? "after" : "before"} className="animate-fade-in-up">
            {countdownDone && statement ? (
              <Professor
                size="md"
                bordered
                animate
                textSize="lg"
                text={
                  <>
                    Hvorfor er denne påstanden <strong>{FASIT_TEXT[statement.fasit]}</strong>?
                  </>
                }
              />
            ) : (
              <Professor
                size="md"
                bordered
                animate
                textSize="lg"
                text={
                  <>
                    Har du endret mening etter diskusjonen?
                    <br />
                    Stem på nytt!
                  </>
                }
              />
            )}
          </div>
        }
      />
    </>
  );

  const panel = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PanelSectionLabel>Elevsvar – Andre stemmerunde</PanelSectionLabel>
      <PanelTabs
        tabs={[
          { key: "endringer", label: "Endringer" },
          { key: "stemmefordeling", label: "Stemmefordeling" },
        ]}
        activeTab={endringerTab ? "endringer" : "stemmefordeling"}
        onTabChange={setPanelTab}
      >
        {endringerTab ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-1">
            <EndringerCard
              correctCount={r2CorrectCount}
              totalVotes={r2Total}
              changedToCorrect={changedToCorrect}
              changedToIncorrect={changedToIncorrect}
              totalChanged={totalChanged}
              avgConfidenceR1={avgConfidenceR1}
              avgConfidenceR2={avgConfidenceR2}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-3 shadow-[var(--shadow-card-soft)]">
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-ink-soft)]">
                Gjennomsnittlig sikkerhet:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-turkis-500)]">
                  {formatDecimal1(avgConfidenceR2)}
                </span>
                <button
                  type="button"
                  aria-label="Vis sikkerhet fordelt på kategori"
                  aria-pressed={showAvgBreakdown}
                  onClick={() => setShowAvgBreakdown((s) => !s)}
                  className={
                    "flex size-8 items-center justify-center rounded-xl border-[1.5px] border-[var(--color-divider-soft)] text-[var(--color-text-ink-faint)] transition-colors " +
                    (showAvgBreakdown
                      ? "bg-[var(--color-divider-soft)] text-[var(--color-text-ink-soft)]"
                      : "bg-white hover:bg-[var(--color-divider-soft)]")
                  }
                >
                  <BarChart3 className="size-4" strokeWidth={2} />
                </button>
              </div>
              {showAvgBreakdown && (
                <div className="absolute top-full right-0 z-10 mt-2 flex min-w-[160px] flex-col gap-1.5 rounded-xl border-[1.5px] border-[var(--color-divider-soft)] bg-white p-3 shadow-[var(--shadow-card-soft)]">
                  <AvgBreakdownRow label="Sant:" value={avgConfidenceR2ByVote.sant} />
                  <AvgBreakdownRow label="Delvis sant:" value={avgConfidenceR2ByVote.delvis} />
                  <AvgBreakdownRow label="Usant:" value={avgConfidenceR2ByVote.usant} />
                </div>
              )}
            </div>
            <div className="h-px bg-[var(--color-divider-soft)]" />
            <div className="flex-1 min-h-0 py-2">
              <DistributionChart
                key={`s${selectedIdx}-reveal`}
                bars={buildVoteBars(r2Votes)}
                total={r2Total}
                // Keep bars gray until the countdown finishes — colored bars
                // signal the correct answer, so they would spoil the reveal.
                correctKey={countdownDone ? statement?.fasit : undefined}
              />
            </div>
          </div>
        )}
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}

function AvgBreakdownRow({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm font-semibold">
      <span className="text-[var(--color-text-ink-soft)]">{label}</span>
      <span className="font-mono font-bold tabular-nums text-[var(--color-text-ink-strong)]">
        {value === undefined ? "–" : formatDecimal1(value)}
      </span>
    </div>
  );
}

import { BackButton } from "@workspace/features/components/live/back-button";
import { BreakdownRow } from "@workspace/features/components/live/breakdown-row";
import { CountdownOverlay } from "@workspace/features/components/live/countdown-overlay";
import { DistributionChart } from "@workspace/features/components/live/distribution-chart";
import { EndringerCard } from "@workspace/features/components/live/endringer-card";
import { FasitBadgeOverlay } from "@workspace/features/components/live/fasit-badge-overlay";
import { FremhevetCarousel } from "@workspace/features/components/live/fremhevet-carousel";
import { PanelTabs } from "@workspace/features/components/live/panel-tabs";
import { Professor } from "@workspace/features/components/live/professor";
import { TeacherStepLayout } from "@workspace/features/components/live/teacher-step-layout";
import { FASIT_TEXT, resolveStatementHex } from "@workspace/features/lib/constants";
import { formatDecimal1 } from "@workspace/features/lib/format";
import { PanelCard } from "@workspace/ui/components/panel-card";
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
    r1Votes,
    r2Votes,
    selectedIdx,
    avgConfidenceR1,
    avgConfidenceR2,
    avgConfidenceR2ByVote,
    goToStep,
    begrunnelser,
    highlightBegrunnelse,
  } = useTeacherSession();
  const endringerTab = panelTab === "default" || panelTab === "endringer";
  const fremhevetTab = panelTab === "fremhevet";
  const [showAvgBreakdown, setShowAvgBreakdown] = useState(false);

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <TeacherStepLayout
        top={<BackButton onClick={() => goToStep(0)} />}
        statement={
          statement && (
            <FasitBadgeOverlay fasit={statement.fasit} show={countdownDone} animated>
              <StatementCard statement={statement} size="lg" color={statementColor} gradient />
            </FasitBadgeOverlay>
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
          { key: "fremhevet", label: "Fremhevet" },
          { key: "stemmefordeling", label: "Stemmefordeling" },
        ]}
        activeTab={fremhevetTab ? "fremhevet" : endringerTab ? "endringer" : "stemmefordeling"}
        onTabChange={setPanelTab}
      >
        {fremhevetTab ? (
          <PanelCard gap="2">
            <FremhevetCarousel
              begrunnelser={begrunnelser}
              votes={r1Votes}
              round={1}
              onDismiss={(b) => void highlightBegrunnelse(b)}
            />
          </PanelCard>
        ) : endringerTab ? (
          <PanelCard>
            <EndringerCard
              correctCount={r2CorrectCount}
              totalVotes={r2Total}
              changedToCorrect={changedToCorrect}
              changedToIncorrect={changedToIncorrect}
              totalChanged={totalChanged}
              avgConfidenceR1={avgConfidenceR1}
              avgConfidenceR2={avgConfidenceR2}
            />
          </PanelCard>
        ) : (
          <PanelCard>
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
                  <BreakdownRow label="Sant:" value={avgConfidenceR2ByVote.sant} />
                  <BreakdownRow label="Delvis sant:" value={avgConfidenceR2ByVote.delvis} />
                  <BreakdownRow label="Usant:" value={avgConfidenceR2ByVote.usant} />
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
          </PanelCard>
        )}
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}

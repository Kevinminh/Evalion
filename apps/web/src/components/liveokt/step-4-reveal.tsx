import { BackButton } from "@workspace/evalion/components/live/back-button";
import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { EndringerCard } from "@workspace/evalion/components/live/endringer-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { FASIT_TEXT, resolveStatementHex } from "@workspace/evalion/lib/constants";
import { PanelSectionLabel } from "@workspace/ui/components/panel-section-label";
import { StatementCard } from "@workspace/ui/components/statement-card";

import { buildVoteBars } from "@/lib/vote-bars";

import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";

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
    r2Votes,
    selectedIdx,
    avgConfidenceR1,
    avgConfidenceR2,
    goToStep,
  } = useTeacherSession();
  const endringerTab = panelTab === "default" || panelTab === "endringer";

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <TeacherStepLayout
        top={
          <div className="flex w-full items-center justify-between">
            <BackButton onClick={() => goToStep(0)} />
            {countdownDone && statement && (
              <FasitBadge fasit={statement.fasit} animated size="lg" />
            )}
          </div>
        }
        statement={
          statement && (
            <StatementCard statement={statement} size="lg" color={statementColor} gradient />
          )
        }
        professor={
          countdownDone && statement ? (
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
          )
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
              avgConfidenceR1={avgConfidenceR1}
              avgConfidenceR2={avgConfidenceR2}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-2xl bg-white p-3 shadow-[var(--shadow-card-soft)]">
            <div className="flex h-full flex-col gap-2">
              <div className="flex-1 min-h-0 py-2">
                <DistributionChart
                  key={`s${selectedIdx}-reveal`}
                  bars={buildVoteBars(r2Votes)}
                  total={r2Total}
                  correctKey={statement?.fasit}
                />
              </div>
            </div>
          </div>
        )}
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}

import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { EndringerCard } from "@workspace/evalion/components/live/endringer-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { FASIT_TEXT, resolveStatementHex } from "@workspace/evalion/lib/constants";
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
  } = useTeacherSession();
  const endringerTab = panelTab === "default" || panelTab === "endringer";

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <TeacherStepLayout
        top={
          countdownDone && statement ? (
            <div className="flex w-full justify-center">
              <FasitBadge fasit={statement.fasit} animated size="lg" />
            </div>
          ) : undefined
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
          ) : undefined
        }
      />
    </>
  );

  const panel = (
    <PanelTabs
      tabs={[
        { key: "endringer", label: "Endringer" },
        { key: "stemmefordeling", label: "Stemmefordeling" },
      ]}
      activeTab={endringerTab ? "endringer" : "stemmefordeling"}
      onTabChange={setPanelTab}
    >
      {endringerTab ? (
        <EndringerCard
          correctCount={r2CorrectCount}
          totalVotes={r2Total}
          changedToCorrect={changedToCorrect}
          changedToIncorrect={changedToIncorrect}
          avgConfidenceR1={avgConfidenceR1}
          avgConfidenceR2={avgConfidenceR2}
        />
      ) : (
        <div className="space-y-4">
          <DistributionChart
            key={`s${selectedIdx}-reveal`}
            bars={buildVoteBars(r2Votes)}
            total={r2Total}
            correctKey={statement?.fasit}
          />
        </div>
      )}
    </PanelTabs>
  );

  return { main, panel };
}

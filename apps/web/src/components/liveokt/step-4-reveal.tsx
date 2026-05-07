import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { EndringerCard } from "@workspace/evalion/components/live/endringer-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { FASIT_TEXT } from "@workspace/evalion/lib/constants";
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
  } = useTeacherSession();
  const endringerTab = panelTab === "default" || panelTab === "endringer";

  const main = (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <div className="flex flex-col items-center gap-6 pt-8">
        {countdownDone && statement && <FasitBadge fasit={statement.fasit} animated />}
        {statement && <StatementCard statement={statement} size="lg" />}
        {countdownDone && statement && (
          <Professor
            size="md"
            text={
              <>
                Hvorfor er denne påstanden <strong>{FASIT_TEXT[statement.fasit]}</strong>?
              </>
            }
          />
        )}
      </div>
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
        />
      ) : (
        <div className="space-y-4">
          <DistributionChart bars={buildVoteBars(r2Votes)} total={r2Total} />
        </div>
      )}
    </PanelTabs>
  );

  return { main, panel };
}

import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { EndringerCard } from "@workspace/evalion/components/live/endringer-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { FASIT_TEXT } from "@workspace/evalion/lib/constants";
import type { ReactNode } from "react";

import { buildVoteBars } from "@/lib/vote-bars";

type Statement = Doc<"fagprats">["statements"][number];

interface Step4MainProps {
  statementCard: ReactNode;
  statement: Statement | undefined;
  showCountdown: boolean;
  countdownNumber: number;
  countdownDone: boolean;
}

export function Step4Main({
  statementCard,
  statement,
  showCountdown,
  countdownNumber,
  countdownDone,
}: Step4MainProps) {
  return (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <div className="flex flex-col items-center gap-6 pt-8">
        {countdownDone && statement && <FasitBadge fasit={statement.fasit} animated />}
        {statementCard}
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
}

interface Step4PanelProps {
  panelTab: string;
  onPanelTabChange: (tab: string) => void;
  r2CorrectCount: number;
  r2Total: number;
  changedToCorrect: number;
  changedToIncorrect: number;
  r2Votes: Doc<"sessionVotes">[];
}

export function Step4Panel({
  panelTab,
  onPanelTabChange,
  r2CorrectCount,
  r2Total,
  changedToCorrect,
  changedToIncorrect,
  r2Votes,
}: Step4PanelProps) {
  const endringerTab = panelTab === "default" || panelTab === "endringer";
  return (
    <PanelTabs
      tabs={[
        { key: "endringer", label: "Endringer" },
        { key: "stemmefordeling", label: "Stemmefordeling" },
      ]}
      activeTab={endringerTab ? "endringer" : "stemmefordeling"}
      onTabChange={onPanelTabChange}
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
}

import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { BackButton } from "@workspace/evalion/components/live/back-button";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { Users } from "lucide-react";
import type { ReactNode } from "react";

import type { TimerControls } from "@/lib/use-timer-controls";
import type { VoteBar } from "@/lib/vote-bars";

interface Step1MainProps {
  statementCard: ReactNode;
  studentList: Doc<"sessionStudents">[];
  activeRoundVotes: Doc<"sessionVotes">[];
  onBack: () => void;
}

export function Step1Main({ statementCard, studentList, activeRoundVotes, onBack }: Step1MainProps) {
  return (
    <div className="flex flex-col items-center gap-8 pt-4">
      <div className="flex w-full items-center justify-between">
        <BackButton onClick={onBack} />
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Users className="size-4" />
          {activeRoundVotes.length}/{studentList.length} har stemt
        </div>
      </div>
      {statementCard}
      <Professor
        size="md"
        text="Stem uten å avsløre for de andre, og skriv gjerne ned hva du tenker. Hvor sikker er du?"
      />
    </div>
  );
}

interface Step1PanelProps {
  studentVoteList: ReactNode;
  voteBars: VoteBar[];
  totalVotes: number;
  timer: TimerControls;
}

export function Step1Panel({ studentVoteList, voteBars, totalVotes, timer }: Step1PanelProps) {
  return (
    <div className="space-y-4">
      <TimerCard {...timer} />
      <div className="h-px bg-border" />
      {studentVoteList}
      <div className="h-px bg-border" />
      <DistributionChart bars={voteBars} total={totalVotes} />
    </div>
  );
}

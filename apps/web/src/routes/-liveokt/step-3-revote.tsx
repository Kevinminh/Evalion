import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { BackButton } from "@workspace/evalion/components/live/back-button";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { Users } from "lucide-react";
import type { ReactNode } from "react";

interface VoteBar {
  label: string;
  value: number;
  color: string;
}

interface Step3MainProps {
  statementCard: ReactNode;
  studentList: Doc<"sessionStudents">[];
  activeRoundVotes: Doc<"sessionVotes">[];
  onBack: () => void;
}

export function Step3Main({ statementCard, studentList, activeRoundVotes, onBack }: Step3MainProps) {
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
      <Professor size="sm" text="Har du endret mening etter diskusjonen? Stem på nytt!" />
    </div>
  );
}

interface Step3PanelProps {
  studentVoteList: ReactNode;
  voteBars: VoteBar[];
  totalVotes: number;
  timerDuration: number | undefined;
  timerStartedAt: number | undefined;
  timerPausedAt: number | undefined;
  timerRemainingAtPause: number | undefined;
  onTimerStart: (duration: number) => void;
  onTimerPause: () => void;
  onTimerStop: () => void;
}

export function Step3Panel({
  studentVoteList,
  voteBars,
  totalVotes,
  timerDuration,
  timerStartedAt,
  timerPausedAt,
  timerRemainingAtPause,
  onTimerStart,
  onTimerPause,
  onTimerStop,
}: Step3PanelProps) {
  return (
    <div className="space-y-4">
      <TimerCard
        duration={timerDuration}
        startedAt={timerStartedAt}
        pausedAt={timerPausedAt}
        remainingAtPause={timerRemainingAtPause}
        onStart={onTimerStart}
        onPause={onTimerPause}
        onStop={onTimerStop}
      />
      <div className="h-px bg-border" />
      {studentVoteList}
      <div className="h-px bg-border" />
      <DistributionChart bars={voteBars} total={totalVotes} />
    </div>
  );
}

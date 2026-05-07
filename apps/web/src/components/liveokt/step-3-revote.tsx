import { BackButton } from "@workspace/evalion/components/live/back-button";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { Users } from "lucide-react";

import { StudentVoteList } from "./student-vote-list";
import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";

export function useStep3(): TeacherStep {
  const {
    statement,
    students,
    activeRoundVotes,
    voteBars,
    totalVotes,
    timer,
    goToStep,
    selectedIdx,
  } = useTeacherSession();

  const main = (
    <div className="flex flex-col items-center gap-8 pt-4">
      <div className="flex w-full items-center justify-between">
        <BackButton onClick={() => goToStep(0)} />
        <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-border px-4 py-2 text-sm font-semibold text-muted-foreground">
          <Users className="size-4 text-primary/60" />
          {activeRoundVotes.length} / {students.length} har stemt
        </div>
      </div>
      {statement && <StatementCard statement={statement} size="lg" />}
      <Professor size="md" text="Har du endret mening etter diskusjonen? Stem på nytt!" />
    </div>
  );

  const panel = (
    <div className="space-y-4">
      <TimerCard {...timer} />
      <div className="h-px bg-border" />
      <StudentVoteList />
      <div className="h-px bg-border" />
      <DistributionChart key={`s${selectedIdx}-r2`} bars={voteBars} total={totalVotes} />
    </div>
  );

  return { main, panel };
}

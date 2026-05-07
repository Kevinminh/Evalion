import { BackButton } from "@workspace/evalion/components/live/back-button";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
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

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <TeacherStepLayout
      top={
        <div className="flex w-full items-center justify-between">
          <BackButton onClick={() => goToStep(0)} />
          <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-border px-4 py-2 text-sm font-semibold text-muted-foreground">
            <Users className="size-4 text-primary/60" />
            {activeRoundVotes.length} / {students.length} har stemt
          </div>
        </div>
      }
      statement={
        statement && (
          <StatementCard statement={statement} size="lg" color={statementColor} gradient />
        )
      }
      professor={
        <Professor
          size="md"
          bordered
          animate
          textSize="lg"
          text="Har du endret mening etter diskusjonen? Stem på nytt!"
        />
      }
    />
  );

  const panel = (
    <div className="space-y-4">
      <TimerCard {...timer} />
      <div className="h-px bg-border" />
      <StudentVoteList />
      <div className="h-px bg-border" />
      <DistributionChart
        key={`s${selectedIdx}-r2`}
        bars={voteBars}
        total={totalVotes}
        correctKey={statement?.fasit}
      />
    </div>
  );

  return { main, panel };
}

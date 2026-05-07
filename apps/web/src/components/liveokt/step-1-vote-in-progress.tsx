import { BackButton } from "@workspace/evalion/components/live/back-button";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { Users } from "lucide-react";

import type { TeacherStep } from "@/types/teacher-step";

import { useTeacherSession } from "./teacher-session-context";

export function useStep1(): TeacherStep {
  const { statement, students, activeRoundVotes, timer, goToStep, selectedIdx, session } =
    useTeacherSession();

  const timerStarted = !!session.timerStartedAt;
  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <div className="flex flex-col items-center gap-10 pt-2 sm:gap-14">
      <div className="flex w-full items-center justify-between">
        <BackButton onClick={() => goToStep(0)} />
        {timerStarted && (
          <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">
            <Users className="size-4 text-primary" />
            {activeRoundVotes.length} / {students.length} har stemt
          </div>
        )}
      </div>

      {statement && (
        <StatementCard statement={statement} size="lg" color={statementColor} gradient />
      )}

      <Professor
        size="md"
        bordered
        animate
        text="Stem uten å avsløre for de andre, og skriv gjerne ned hva du tenker. Hvor sikker er du?"
      />
    </div>
  );

  const panel = (
    <div className="flex h-full flex-col justify-center gap-3">
      <TimerCard {...timer} onNextStep={() => goToStep(2)} nextStepLabel="Gå til diskusjon" />
    </div>
  );

  return { main, panel };
}

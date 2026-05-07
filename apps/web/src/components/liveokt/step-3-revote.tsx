import { BackButton } from "@workspace/evalion/components/live/back-button";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { Users } from "lucide-react";

import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";

const STEP3_PRESETS = [
  { seconds: 15, label: "15s" },
  { seconds: 30, label: "30s" },
  { seconds: 60, label: "1m" },
];

export function useStep3(): TeacherStep {
  const {
    statement,
    students,
    activeRoundVotes,
    timer,
    goToStep,
    selectedIdx,
  } = useTeacherSession();

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);
  const timerRunning = timer.startedAt !== undefined;

  const main = (
    <TeacherStepLayout
      top={
        <div className="flex w-full items-center justify-between">
          <BackButton onClick={() => goToStep(0)} />
          {timerRunning && (
            <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#E0E0E0] px-4 py-2 text-sm font-semibold text-[#616161]">
              <Users className="size-4 text-[#8554F6]" />
              {activeRoundVotes.length} / {students.length} har stemt
            </div>
          )}
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
          text={
            <>
              Har du endret mening etter diskusjonen?
              <br />
              Stem på nytt!
            </>
          }
        />
      }
    />
  );

  const panel = (
    <TimerCard
      {...timer}
      presets={STEP3_PRESETS}
      sliderMin={10}
      sliderMax={60}
      initialDuration={30}
      sectionLabel="Nedtelling"
      onNextStep={() => goToStep(4)}
      nextStepLabel="Gå til fasit"
    />
  );

  return { main, panel, panelFooter: null };
}

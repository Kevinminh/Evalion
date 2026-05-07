import { BackButton } from "@workspace/evalion/components/live/back-button";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TeacherStepLayout } from "@workspace/evalion/components/live/teacher-step-layout";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { Users } from "lucide-react";

import type { TeacherStep } from "@/types/teacher-step";

import { useTeacherSession } from "./teacher-session-context";

const STEP1_PRESETS = [
  { seconds: 30, label: "30s" },
  { seconds: 60, label: "1m" },
  { seconds: 120, label: "2m" },
];

export function useStep1(): TeacherStep {
  const { statement, students, activeRoundVotes, timer, goToStep, selectedIdx } =
    useTeacherSession();

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
          text="Stem uten å avsløre for de andre, og skriv gjerne ned hva du tenker. Hvor sikker er du?"
        />
      }
    />
  );

  const panel = (
    <TimerCard
      {...timer}
      presets={STEP1_PRESETS}
      sliderMin={10}
      sliderMax={180}
      initialDuration={60}
      sectionLabel="Nedtelling"
      onNextStep={() => goToStep(2)}
      nextStepLabel="Gå til diskusjon"
    />
  );

  return { main, panel, panelFooter: null };
}

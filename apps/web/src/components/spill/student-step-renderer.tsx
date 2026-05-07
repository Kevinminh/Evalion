import { WaitingDots } from "@workspace/ui/components/waiting-dots";

import { useStep4Countdown } from "@/hooks/use-step4-countdown";

import { Step0Waiting } from "./step-0-waiting";
import { Step1Vote } from "./step-1-vote";
import { Step2Discussion } from "./step-2-discussion";
import { Step3Revote } from "./step-3-revote";
import { Step4Reveal } from "./step-4-reveal";
import { Step5Explanation } from "./step-5-explanation";
import { Step6Rating } from "./step-6-rating";
import { useStudentGame } from "./student-game-context";
import { phaseStepNumber } from "@/types/student-phase";

export function StudentStepRenderer() {
  const { phase } = useStudentGame();
  const { showCountdown, countdownNumber, countdownDone } = useStep4Countdown(
    phaseStepNumber(phase),
  );

  switch (phase.kind) {
    case "waiting":
      return <Step0Waiting />;
    case "vote":
      return <Step1Vote />;
    case "discussion":
      return <Step2Discussion />;
    case "revote":
      return <Step3Revote />;
    case "reveal":
      return (
        <Step4Reveal
          showCountdown={showCountdown}
          countdownNumber={countdownNumber}
          countdownDone={countdownDone}
        />
      );
    case "explanation":
      return <Step5Explanation />;
    case "rating":
      return <Step6Rating />;
    case "lobby":
    case "ended":
      // Handled by spill.$studentId.tsx wrapper before reaching the renderer.
      return null;
    default: {
      // Exhaustiveness check: every phase.kind must be handled above.
      const _exhaustive: never = phase;
      void _exhaustive;
      return (
        <div className="flex items-center text-muted-foreground">
          Venter
          <WaitingDots />
        </div>
      );
    }
  }
}

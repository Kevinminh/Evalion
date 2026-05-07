import { WaitingDots } from "@workspace/ui/components/waiting-dots";

import { useStep4Countdown } from "@/lib/use-step4-countdown";

import { Step0Waiting } from "./step-0-waiting";
import { Step1Vote } from "./step-1-vote";
import { Step2Discussion } from "./step-2-discussion";
import { Step3Revote } from "./step-3-revote";
import { Step4Reveal } from "./step-4-reveal";
import { Step5Explanation } from "./step-5-explanation";
import { Step6Rating } from "./step-6-rating";
import { useStudentGame } from "./student-game-context";

export function StudentStepRenderer() {
  const { currentStep } = useStudentGame();
  const { showCountdown, countdownNumber, countdownDone } = useStep4Countdown(currentStep);

  switch (currentStep) {
    case 0:
      return <Step0Waiting />;
    case 1:
      return <Step1Vote />;
    case 2:
      return <Step2Discussion />;
    case 3:
      return <Step3Revote />;
    case 4:
      return (
        <Step4Reveal
          showCountdown={showCountdown}
          countdownNumber={countdownNumber}
          countdownDone={countdownDone}
        />
      );
    case 5:
      return <Step5Explanation />;
    case 6:
      return <Step6Rating />;
    default:
      return (
        <div className="flex items-center text-muted-foreground">
          Venter
          <WaitingDots />
        </div>
      );
  }
}

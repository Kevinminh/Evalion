import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { FASIT_TEXT } from "@workspace/evalion/lib/constants";

import { RecordingDisclaimer } from "@workspace/ui/components/recording-disclaimer";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { useStudentGame } from "./student-game-context";

interface Step4RevealProps {
  showCountdown: boolean;
  countdownNumber: number;
  countdownDone: boolean;
}

export function Step4Reveal({ showCountdown, countdownNumber, countdownDone }: Step4RevealProps) {
  const { statement, session } = useStudentGame();
  if (!statement) return null;

  return (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <div className="flex w-full flex-col items-center gap-6">
        {countdownDone && <FasitBadge fasit={statement.fasit} animated size="lg" />}

        <StatementCard statement={statement} />

        {countdownDone && (
          <Professor
            size="sm"
            bounce
            textSize="sm"
            text={`Forklar til læringspartneren din hvorfor påstanden er ${
              FASIT_TEXT[statement.fasit]
            }. Bruk fagbegreper, sammenligninger og eksempler.`}
          />
        )}

        {countdownDone && session.transcriptionEnabled && <RecordingDisclaimer />}
      </div>
    </>
  );
}

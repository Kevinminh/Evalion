import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";
import { FASIT_TEXT } from "@workspace/evalion/lib/constants";
import type { FagPratStatement } from "@workspace/evalion/lib/types";

import { RecordingDisclaimer } from "./recording-disclaimer";
import { StatementCard } from "@workspace/ui/components/statement-card";

interface Step4RevealProps {
  statement: FagPratStatement;
  showCountdown: boolean;
  countdownNumber: number;
  countdownDone: boolean;
  transcriptionEnabled?: boolean;
}

export function Step4Reveal({
  statement,
  showCountdown,
  countdownNumber,
  countdownDone,
  transcriptionEnabled,
}: Step4RevealProps) {
  return (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <div className="flex w-full flex-col items-center gap-6">
        {countdownDone && <FasitBadge fasit={statement.fasit} animated />}

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

        {countdownDone && transcriptionEnabled && <RecordingDisclaimer />}
      </div>
    </>
  );
}

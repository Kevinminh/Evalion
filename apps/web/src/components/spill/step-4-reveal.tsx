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
        <div className="relative w-full">
          {countdownDone && (
            <div className="absolute left-1/2 -top-1 z-10 -translate-x-1/2 -translate-y-[65%]">
              <FasitBadge fasit={statement.fasit} animated size="lg" />
            </div>
          )}
          <StatementCard statement={statement} />
        </div>

        {countdownDone && (
          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-center text-2xl font-extrabold text-[var(--color-text-ink-strong)]">
              Snakk sammen!
            </h2>
            <p className="max-w-[380px] text-center text-sm leading-relaxed text-[var(--color-text-ink-soft)]">
              Forklar til læringspartneren din hvorfor påstanden er {FASIT_TEXT[statement.fasit]}.
            </p>
            <Professor
              size="sm"
              bordered
              bounce
              textSize="sm"
              text="Bruk fagbegreper, sammenligninger og eksempler for å styrke forklaringen din."
            />
          </div>
        )}

        {countdownDone && session.transcriptionEnabled && <RecordingDisclaimer />}
      </div>
    </>
  );
}

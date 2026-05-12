import { CountdownOverlay } from "@workspace/evalion/components/live/countdown-overlay";
import { FasitBadgeOverlay } from "@workspace/evalion/components/live/fasit-badge-overlay";
import { Professor } from "@workspace/evalion/components/live/professor";
import { FASIT_TEXT, resolveStatementStudentHex } from "@workspace/evalion/lib/constants";

import { RecordingDisclaimer } from "@workspace/ui/components/recording-disclaimer";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { useStudentGame } from "./student-game-context";

interface Step4RevealProps {
  showCountdown: boolean;
  countdownNumber: number;
  countdownDone: boolean;
}

export function Step4Reveal({ showCountdown, countdownNumber, countdownDone }: Step4RevealProps) {
  const { statement, statementIndex, session } = useStudentGame();
  if (!statement) return null;

  const statementColor = resolveStatementStudentHex(statement.color, statementIndex);

  return (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <div className="flex w-full flex-col items-center gap-6">
        <FasitBadgeOverlay fasit={statement.fasit} show={countdownDone} animated>
          <StatementCard statement={statement} color={statementColor} />
        </FasitBadgeOverlay>

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

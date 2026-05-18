import { useState } from "react";
import { resolveStatementStudentHex } from "@workspace/features/lib/constants";
import type { Fasit } from "@workspace/api/types";

import { RatingScale } from "@workspace/ui/components/rating-scale";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { useStudentGame } from "./student-game-context";
import { SubmitButton } from "@workspace/ui/components/submit-button";
import { TimerWaitingNotice } from "./timer-waiting-notice";
import { VoteOptions } from "./vote-options";
import { WaitingScreen } from "./waiting-screen";
import { useSubmitWithWaiting } from "@/hooks/use-submit-with-waiting";

export function Step3Revote() {
  const { statement, statementIndex, hasVoted, castVote, session } = useStudentGame();
  const [selectedVote, setSelectedVote] = useState<Fasit | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);
  const { sent, showWaiting, handleSubmit } = useSubmitWithWaiting(
    (vote: Fasit, confidence: number) => castVote({ vote, confidence }),
    { errorMessage: "Svaret ble ikke sendt. Prøv igjen." },
  );

  if (!statement) return null;
  if ((!sent && hasVoted) || showWaiting) {
    return <WaitingScreen />;
  }

  const isTimerStarted = !!session.timerStartedAt;
  const canSubmit = selectedVote !== null && selectedConfidence !== null;
  const statementColor = resolveStatementStudentHex(statement.color, statementIndex);

  const onSubmit = () => {
    if (selectedVote !== null && selectedConfidence !== null) {
      handleSubmit(selectedVote, selectedConfidence);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <StatementCard statement={statement} color={statementColor} />

      {!isTimerStarted ? (
        <TimerWaitingNotice />
      ) : (
        <>
          <div className="flex w-full max-w-md flex-col items-stretch gap-5 md:max-w-lg lg:max-w-2xl">
            <div className="space-y-2">
              <p className="text-center text-sm font-bold text-foreground">Hva mener du?</p>
              <VoteOptions selected={selectedVote} onSelect={setSelectedVote} />
            </div>

            <div className="space-y-2">
              <p className="text-center text-sm font-bold text-foreground">Hvor sikker er du nå?</p>
              <RatingScale selected={selectedConfidence} onSelect={setSelectedConfidence} />
            </div>
          </div>

          <SubmitButton sent={sent} disabled={!canSubmit} onClick={onSubmit} />
        </>
      )}
    </div>
  );
}

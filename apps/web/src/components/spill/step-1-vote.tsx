import { resolveStatementStudentHex } from "@workspace/features/lib/constants";
import type { Fasit } from "@workspace/api/types";
import { RatingScale } from "@workspace/ui/components/rating-scale";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { SubmitButton } from "@workspace/ui/components/submit-button";
import { useCallback, useState } from "react";

import { useBegrunnelseDraft } from "@/hooks/use-begrunnelse-draft";
import { useSubmitWithWaiting } from "@/hooks/use-submit-with-waiting";

import { useStudentGame } from "./student-game-context";
import { VoteOptions } from "./vote-options";
import { WaitingScreen } from "./waiting-screen";

export function Step1Vote() {
  const { statement, hasVoted, session, student, statementIndex, castVote, submitJustification } =
    useStudentGame();
  const {
    text: begrunnelseText,
    setText: setBegrunnelseText,
    clear: clearBegrunnelseDraft,
  } = useBegrunnelseDraft(session._id, student._id, statementIndex);

  const [selectedVote, setSelectedVote] = useState<Fasit | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);

  const submitVoteAndBegrunnelse = useCallback(
    async (vote: Fasit, confidence: number) => {
      const trimmed = begrunnelseText.trim();
      await Promise.all([
        castVote({ vote, confidence }),
        trimmed ? submitJustification({ text: trimmed }) : Promise.resolve(),
      ]);
      if (trimmed) clearBegrunnelseDraft();
    },
    [begrunnelseText, castVote, submitJustification, clearBegrunnelseDraft],
  );

  const { sent, showWaiting, handleSubmit } = useSubmitWithWaiting(submitVoteAndBegrunnelse, {
    errorMessage: "Svaret ble ikke sendt. Prøv igjen.",
  });

  if (!statement) return null;
  // While `sent` is true we keep showing the green "Sendt!" button for ~500ms
  // before swapping to the waiting screen — otherwise the Convex subscription
  // would flip `hasVoted` immediately and skip the confirmation flash.
  if ((!sent && hasVoted) || showWaiting) {
    return <WaitingScreen />;
  }

  const isTimerStarted = !!session.timerStartedAt;
  const formDisabled = !isTimerStarted;
  const canSubmit = selectedVote !== null && selectedConfidence !== null && isTimerStarted;
  const statementColor = resolveStatementStudentHex(statement.color, statementIndex);

  const onSubmit = () => {
    if (selectedVote !== null && selectedConfidence !== null && isTimerStarted) {
      handleSubmit(selectedVote, selectedConfidence);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <StatementCard statement={statement} color={statementColor} />

      {!isTimerStarted && (
        <p className="text-center text-xs font-medium text-muted-foreground">
          Venter på at læreren starter nedtellingen...
        </p>
      )}

      <div
        className={
          formDisabled
            ? "pointer-events-none flex w-full max-w-md flex-col items-stretch gap-5 opacity-40 transition-opacity md:max-w-lg lg:max-w-2xl"
            : "flex w-full max-w-md flex-col items-stretch gap-5 transition-opacity md:max-w-lg lg:max-w-2xl"
        }
        aria-disabled={formDisabled}
      >
        <div className="space-y-2">
          <p className="text-center text-sm font-bold text-foreground">Hva mener du?</p>
          <VoteOptions selected={selectedVote} onSelect={setSelectedVote} disabled={formDisabled} />
        </div>

        <div className="space-y-2">
          <p className="text-center text-sm font-bold text-foreground">Hvor sikker er du?</p>
          <RatingScale
            selected={selectedConfidence}
            onSelect={setSelectedConfidence}
            disabled={formDisabled}
          />
        </div>

        <div className="space-y-2">
          <p className="text-center text-sm font-bold text-foreground">Begrunn svaret ditt</p>
          <textarea
            value={begrunnelseText}
            onChange={(e) => setBegrunnelseText(e.target.value)}
            placeholder="Skriv din begrunnelse her..."
            disabled={formDisabled}
            className="w-full rounded-xl border-[1.5px] border-neutral-300 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-neutral-50"
            rows={3}
          />
        </div>
      </div>

      <SubmitButton sent={sent} disabled={!canSubmit} onClick={onSubmit} />
    </div>
  );
}

import { useState } from "react";
import type { Fasit } from "@workspace/evalion/lib/types";
import { toast } from "sonner";

import { RatingScale } from "./rating-scale";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { useStudentGame } from "./student-game-context";
import { SubmitButton } from "./submit-button";
import { VoteOptions } from "./vote-options";
import { WaitingScreen } from "./waiting-screen";

export function Step3Revote() {
  const { statement, hasVoted, castVote } = useStudentGame();
  const [selectedVote, setSelectedVote] = useState<Fasit | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  if (!statement) return null;
  if (hasVoted || sent) {
    return <WaitingScreen />;
  }

  const canSubmit = selectedVote !== null && selectedConfidence !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSent(true);
    try {
      await castVote({ round: 2, vote: selectedVote!, confidence: selectedConfidence! });
    } catch {
      setSent(false);
      toast.error("Svaret ble ikke sendt. Prøv igjen.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <StatementCard statement={statement} />

      <div className="w-full max-w-md space-y-2">
        <p className="text-center text-sm font-bold text-foreground">Hva mener du?</p>
        <VoteOptions selected={selectedVote} onSelect={setSelectedVote} />
      </div>

      <div className="w-full max-w-md space-y-2">
        <p className="text-center text-sm font-bold text-foreground">Hvor sikker er du nå?</p>
        <RatingScale selected={selectedConfidence} onSelect={setSelectedConfidence} />
      </div>

      <SubmitButton sent={sent} disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}

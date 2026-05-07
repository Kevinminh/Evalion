import { useState } from "react";
import type { Fasit } from "@workspace/evalion/lib/types";
import { toast } from "sonner";

import { useBegrunnelseDraft } from "@/lib/use-begrunnelse-draft";

import { RatingScale } from "./rating-scale";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { useStudentGame } from "./student-game-context";
import { SubmitButton } from "./submit-button";
import { VoteOptions } from "./vote-options";
import { WaitingScreen } from "./waiting-screen";

export function Step1Vote() {
  const { statement, hasVoted, session, student, statementIndex, castVote, submitBegrunnelse } =
    useStudentGame();
  const {
    text: begrunnelseText,
    setText: setBegrunnelseText,
    clear: clearBegrunnelseDraft,
  } = useBegrunnelseDraft(session._id, student._id, statementIndex);

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
    const trimmed = begrunnelseText.trim();
    try {
      await Promise.all([
        castVote({ vote: selectedVote!, confidence: selectedConfidence! }),
        trimmed ? submitBegrunnelse({ text: trimmed }) : Promise.resolve(),
      ]);
      if (trimmed) clearBegrunnelseDraft();
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
        <p className="text-center text-sm font-bold text-foreground">Hvor sikker er du?</p>
        <RatingScale selected={selectedConfidence} onSelect={setSelectedConfidence} />
      </div>

      <div className="w-full max-w-md space-y-2">
        <p className="text-center text-sm font-bold text-foreground">Begrunn svaret ditt</p>
        <textarea
          value={begrunnelseText}
          onChange={(e) => setBegrunnelseText(e.target.value)}
          placeholder="Skriv din begrunnelse her..."
          className="w-full rounded-xl border-[1.5px] border-neutral-300 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          rows={3}
        />
      </div>

      <SubmitButton sent={sent} disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}

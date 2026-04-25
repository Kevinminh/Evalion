import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { STUDENT_VOTE_OPTIONS } from "@workspace/evalion/lib/constants";
import { toast } from "sonner";

import { ConfidenceScale } from "./confidence-scale";
import { StatementCard } from "./statement-card";
import { SubmitButton } from "./submit-button";
import { WaitingScreen } from "./waiting-screen";

interface Step3RevoteProps {
  statement: { text: string };
  onSubmit: (data: { vote: "sant" | "usant" | "delvis"; confidence: number }) => Promise<void>;
  hasVoted: boolean;
}

export function Step3Revote({ statement, onSubmit, hasVoted }: Step3RevoteProps) {
  const [selectedVote, setSelectedVote] = useState<"sant" | "usant" | "delvis" | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  if (hasVoted || sent) {
    return <WaitingScreen />;
  }

  const canSubmit = selectedVote !== null && selectedConfidence !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSent(true);
    try {
      await onSubmit({ vote: selectedVote!, confidence: selectedConfidence! });
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
        <div className={cn("flex gap-3", selectedVote && "has-selection")}>
          {STUDENT_VOTE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedVote(opt.value)}
              className={cn(
                "flex-1 rounded-2xl py-3 text-[15px] font-bold text-white transition-all",
                opt.bg,
                opt.shadow,
                selectedVote === opt.value && "outline-3 outline outline-white outline-offset-[-3px]",
                selectedVote && selectedVote !== opt.value && "opacity-45",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        <p className="text-center text-sm font-bold text-foreground">Hvor sikker er du nå?</p>
        <ConfidenceScale selected={selectedConfidence} onSelect={setSelectedConfidence} />
      </div>

      <SubmitButton sent={sent} disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}

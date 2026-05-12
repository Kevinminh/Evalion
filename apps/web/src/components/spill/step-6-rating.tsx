import { useState } from "react";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { resolveStatementStudentHex } from "@workspace/evalion/lib/constants";
import { toast } from "sonner";

import { StatementCard } from "@workspace/ui/components/statement-card";
import { RatingScale } from "@workspace/ui/components/rating-scale";
import { useStudentGame } from "./student-game-context";
import { SubmitButton } from "@workspace/ui/components/submit-button";
import { WaitingScreen } from "./waiting-screen";

export function Step6Rating() {
  const { statement, statementIndex, submitRating } = useStudentGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);

  if (!statement) return null;
  if (showWaiting) {
    return <WaitingScreen title="Takk for svaret ditt!" />;
  }

  const statementColor = resolveStatementStudentHex(statement.color, statementIndex);

  const handleSubmit = async () => {
    if (selected === null) return;
    setSent(true);
    try {
      await submitRating(selected);
      setTimeout(() => setShowWaiting(true), 500);
    } catch {
      setSent(false);
      toast.error("Vurderingen ble ikke sendt. Prøv igjen.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative w-full">
        <div className="absolute left-1/2 -top-1 z-10 -translate-x-1/2 -translate-y-[65%]">
          <FasitBadge fasit={statement.fasit} size="lg" />
        </div>
        <StatementCard statement={statement} color={statementColor} />
      </div>

      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-2xl font-extrabold text-[var(--color-text-ink-strong)]">
          Hvor godt forstår du dette nå?
        </p>
        <p className="text-center text-sm leading-relaxed text-[var(--color-text-ink-soft)]">
          Vurder forståelsen din fra 1 til 5
        </p>

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">Forstår ikke</span>
          <RatingScale
            variant="rating"
            selected={selected}
            onSelect={setSelected}
            className="flex-1"
          />
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">Forstår godt</span>
        </div>
      </div>

      <SubmitButton sent={sent} disabled={selected === null} onClick={handleSubmit} />
    </div>
  );
}

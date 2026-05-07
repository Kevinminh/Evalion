import { useState } from "react";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { toast } from "sonner";

import { StatementCard } from "@workspace/ui/components/statement-card";
import { useStudentGame } from "./student-game-context";
import { SubmitButton } from "./submit-button";
import { WaitingScreen } from "./waiting-screen";

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-500",
];

export function Step6Rating() {
  const { statement, submitRating } = useStudentGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  if (!statement) return null;
  if (sent) {
    return <WaitingScreen />;
  }

  const handleSubmit = async () => {
    if (selected === null) return;
    setSent(true);
    try {
      await submitRating(selected);
    } catch {
      setSent(false);
      toast.error("Vurderingen ble ikke sendt. Prøv igjen.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <FasitBadge fasit={statement.fasit} />
      <StatementCard statement={statement} />

      <div className="w-full max-w-md space-y-3">
        <p className="text-center text-sm font-bold text-foreground">
          Hvor godt forstår du dette nå?
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Vurder forståelsen din fra 1 til 5
        </p>

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">Forstår ikke</span>
          <div className="flex flex-1 gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const isSelected = selected === n;
              return (
                <button
                  key={n}
                  onClick={() => setSelected(n)}
                  className={`flex flex-1 items-center justify-center rounded-2xl py-3 text-[15px] font-bold transition-all ${
                    isSelected
                      ? `${RATING_COLORS[n - 1]} text-white translate-y-0.5 shadow-[0_2px_0_rgba(0,0,0,0.2)]`
                      : "border-2 border-neutral-200 bg-white text-foreground shadow-[0_4px_0_theme(colors.neutral.300)]"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">Forstår godt</span>
        </div>
      </div>

      <SubmitButton sent={sent} disabled={selected === null} onClick={handleSubmit} />
    </div>
  );
}

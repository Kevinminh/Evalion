import { Professor } from "@workspace/evalion/components/live/professor";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { CheckCircle2 } from "lucide-react";

export function WaitingScreen() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <span
        className="inline-flex items-center gap-2 rounded-full bg-sant/15 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-sant"
        style={{
          letterSpacing: "0.05em",
          animation: "fasit-pulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        <CheckCircle2 className="size-4" />
        Stemmen registrert
      </span>
      <h2 className="text-xl font-extrabold text-foreground">Takk for svaret ditt!</h2>
      <Professor size="xl" bounce bordered />
      <div className="flex items-center text-muted-foreground">
        Venter på resten av klassen
        <WaitingDots />
      </div>
    </div>
  );
}

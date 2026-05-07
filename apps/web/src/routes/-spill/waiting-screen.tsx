import { Professor } from "@workspace/evalion/components/live/professor";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";

export function WaitingScreen() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-xl font-extrabold text-primary">Takk for svaret ditt!</h2>
      <Professor size="xl" bounce bordered />
      <div className="flex items-center text-muted-foreground">
        Venter på resten av klassen
        <WaitingDots />
      </div>
    </div>
  );
}

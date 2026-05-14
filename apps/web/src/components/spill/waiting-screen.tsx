import { Professor } from "@workspace/features/components/live/professor";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";

interface WaitingScreenProps {
  title?: string;
  waitingText?: string;
}

export function WaitingScreen({
  title,
  waitingText = "Venter på resten av klassen",
}: WaitingScreenProps = {}) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {title && <h2 className="text-lg font-extrabold text-primary">{title}</h2>}
      <Professor size="xl" bounce bordered />
      <div className="flex items-center text-sm font-semibold text-muted-foreground">
        {waitingText}
        <WaitingDots />
      </div>
    </div>
  );
}

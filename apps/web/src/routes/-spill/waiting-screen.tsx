import { WaitingDots } from "@workspace/ui/components/waiting-dots";

export function WaitingScreen() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-xl font-extrabold text-primary">Takk for svaret ditt!</h2>
      <div className="size-32 overflow-hidden rounded-full border-4 border-primary/20">
        <img
          src="/professoren.png"
          alt="Professoren"
          className="size-full animate-[gentle-bounce_3s_ease-in-out_infinite] object-cover"
        />
      </div>
      <div className="flex items-center text-muted-foreground">
        Venter på resten av klassen
        <WaitingDots />
      </div>
    </div>
  );
}

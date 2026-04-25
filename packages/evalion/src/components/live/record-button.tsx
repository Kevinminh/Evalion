import { cn } from "@workspace/ui/lib/utils";
import { Mic, Square } from "lucide-react";

interface RecordButtonProps {
  state: "disabled" | "ready" | "recording";
  onToggle: () => void;
  elapsed?: number;
}

export function RecordButton({ state, onToggle, elapsed = 0 }: RecordButtonProps) {
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <button
      onClick={onToggle}
      disabled={state === "disabled"}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
        state === "disabled" && "cursor-not-allowed bg-muted text-muted-foreground opacity-35",
        state === "ready" && "bg-primary text-primary-foreground border border-primary",
        state === "recording" && "bg-neutral-800 text-white",
      )}
    >
      {state === "recording" ? (
        <>
          <span className="size-2 rounded-full bg-red-500 animate-[blink_1s_ease-in-out_infinite]" />
          <span className="font-mono tabular-nums">
            {minutes}:{seconds}
          </span>
          <Square className="size-3.5" />
        </>
      ) : (
        <>
          <Mic className="size-4" />
          Opptak
        </>
      )}
    </button>
  );
}

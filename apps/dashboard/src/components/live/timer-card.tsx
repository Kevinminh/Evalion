import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface TimerCardProps {
  onComplete?: () => void;
}

export function TimerCard({ onComplete }: TimerCardProps) {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining, onComplete]);

  const setPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setRunning(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="rounded-xl border-[1.5px] border-border bg-card p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tid igjen</div>
      <div className="mb-3 text-center font-mono text-4xl font-bold tabular-nums text-foreground">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="mb-3 flex justify-center gap-2">
        {[60, 180, 300].map((s) => (
          <button
            key={s}
            onClick={() => setPreset(s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              totalSeconds === s ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {s / 60} min
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {!running ? (
          <button
            onClick={() => { if (remaining === 0) setRemaining(totalSeconds); setRunning(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)]"
          >
            <Play className="size-3.5" /> Start
          </button>
        ) : (
          <>
            <button
              onClick={() => setRunning(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-bold text-foreground"
            >
              <Pause className="size-3.5" /> Pause
            </button>
            <button
              onClick={() => { setRunning(false); setRemaining(totalSeconds); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-bold text-destructive"
            >
              <Square className="size-3.5" /> Stopp
            </button>
          </>
        )}
      </div>
    </div>
  );
}

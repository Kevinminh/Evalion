import { cn } from "@workspace/ui/lib/utils";
import { Play, Pause, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface TimerCardProps {
  onComplete?: () => void;
}

export function TimerCard({ onComplete }: TimerCardProps) {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, remaining]);

  const setPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setRunning(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="rounded-xl border-[1.5px] border-border bg-card p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Tid igjen
      </div>
      <div className="mb-3 text-center font-mono text-4xl font-bold tabular-nums text-foreground">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="mb-2 flex justify-center gap-2">
        {[30, 60, 120].map((s) => (
          <button
            key={s}
            onClick={() => setPreset(s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              totalSeconds === s
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {s < 60 ? `${s}s` : `${s / 60}m`}
          </button>
        ))}
      </div>
      <div className="mb-3 flex justify-center px-2">
        <input
          type="range"
          min={10}
          max={300}
          step={5}
          value={totalSeconds}
          onChange={(e) => {
            const val = Number(e.target.value);
            setTotalSeconds(val);
            if (!running) setRemaining(val);
          }}
          className="w-full accent-primary"
        />
      </div>
      <div className="flex justify-center gap-2">
        {!running ? (
          <button
            onClick={() => {
              if (remaining === 0) setRemaining(totalSeconds);
              setRunning(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sant px-4 py-2 text-sm font-bold text-white shadow-[0_2px_0_oklch(0.45_0.15_145)]"
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
              onClick={() => {
                setRunning(false);
                setRemaining(totalSeconds);
              }}
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

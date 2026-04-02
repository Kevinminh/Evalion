import { cn } from "@workspace/ui/lib/utils";
import { Play, Pause, Square } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

interface TimerCardProps {
  // Backend state
  duration?: number;
  startedAt?: number;
  pausedAt?: number;
  remainingAtPause?: number;
  // Callbacks
  onStart?: (duration: number) => void;
  onPause?: () => void;
  onStop?: () => void;
  onComplete?: () => void;
}

function computeRemaining(
  duration?: number,
  startedAt?: number,
  pausedAt?: number,
  remainingAtPause?: number,
): number {
  if (pausedAt && remainingAtPause !== undefined) {
    return Math.max(0, Math.floor(remainingAtPause));
  }
  if (startedAt && duration !== undefined) {
    return Math.max(0, Math.floor(duration - (Date.now() - startedAt) / 1000));
  }
  return 0;
}

export function TimerCard({
  duration,
  startedAt,
  pausedAt,
  remainingAtPause,
  onStart,
  onPause,
  onStop,
  onComplete,
}: TimerCardProps) {
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [displayRemaining, setDisplayRemaining] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completeFiredRef = useRef(false);

  const isActive = startedAt !== undefined && startedAt !== null;
  const isPaused = isActive && pausedAt !== undefined && pausedAt !== null;
  const isRunning = isActive && !isPaused;

  // Compute remaining time from backend state
  const calcRemaining = useCallback(
    () => computeRemaining(duration, startedAt, pausedAt, remainingAtPause),
    [duration, startedAt, pausedAt, remainingAtPause],
  );

  // Reset completeFiredRef when timer restarts
  useEffect(() => {
    if (isActive) {
      completeFiredRef.current = false;
    }
  }, [startedAt, isActive]);

  // Tick every second when running, or set static value when paused/stopped
  useEffect(() => {
    if (isRunning) {
      setDisplayRemaining(calcRemaining());
      const interval = setInterval(() => {
        const r = calcRemaining();
        setDisplayRemaining(r);
        if (r <= 0 && !completeFiredRef.current) {
          completeFiredRef.current = true;
          onCompleteRef.current?.();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    if (isPaused) {
      setDisplayRemaining(calcRemaining());
    } else if (!isActive) {
      setDisplayRemaining(0);
    }
  }, [isRunning, isPaused, isActive, calcRemaining]);

  const minutes = Math.floor(displayRemaining / 60);
  const seconds = displayRemaining % 60;

  const showControls = !isActive;

  return (
    <div className="rounded-xl border-[1.5px] border-border bg-card p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Tid igjen
      </div>
      <div className="mb-3 text-center font-mono text-4xl font-bold tabular-nums text-foreground">
        {isActive
          ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          : `${String(Math.floor(selectedDuration / 60)).padStart(2, "0")}:${String(selectedDuration % 60).padStart(2, "0")}`}
      </div>
      {showControls && (
        <>
          <div className="mb-2 flex justify-center gap-2">
            {[30, 60, 120].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedDuration(s)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  selectedDuration === s
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
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </>
      )}
      <div className="flex justify-center gap-2">
        {!isActive ? (
          <button
            onClick={() => onStart?.(selectedDuration)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sant px-4 py-2 text-sm font-bold text-white shadow-[0_2px_0_oklch(0.45_0.15_145)]"
          >
            <Play className="size-3.5" /> Start
          </button>
        ) : (
          <>
            {isRunning ? (
              <button
                onClick={() => onPause?.()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-bold text-foreground"
              >
                <Pause className="size-3.5" /> Pause
              </button>
            ) : (
              <button
                onClick={() => {
                  if (remainingAtPause !== undefined && remainingAtPause > 0) {
                    onStart?.(remainingAtPause);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sant px-4 py-2 text-sm font-bold text-white shadow-[0_2px_0_oklch(0.45_0.15_145)]"
              >
                <Play className="size-3.5" /> Fortsett
              </button>
            )}
            <button
              onClick={() => onStop?.()}
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

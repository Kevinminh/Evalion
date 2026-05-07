import { cn } from "@workspace/ui/lib/utils";
import { Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function StudentTimer({
  timerDuration,
  timerStartedAt,
  timerPausedAt,
  timerRemainingAtPause,
}: {
  timerDuration?: number;
  timerStartedAt?: number;
  timerPausedAt?: number;
  timerRemainingAtPause?: number;
}) {
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);

  const calcRemaining = useCallback(() => {
    if (timerPausedAt && timerRemainingAtPause !== undefined) {
      return Math.max(0, Math.floor(timerRemainingAtPause));
    }
    if (timerStartedAt && timerDuration !== undefined) {
      return Math.max(0, Math.floor(timerDuration - (Date.now() - timerStartedAt) / 1000));
    }
    return 0;
  }, [timerDuration, timerStartedAt, timerPausedAt, timerRemainingAtPause]);

  const isActive = timerStartedAt !== undefined && timerStartedAt !== null;
  const isPaused = isActive && timerPausedAt !== undefined && timerPausedAt !== null;
  const isRunning = isActive && !isPaused;

  useEffect(() => {
    if (!isActive) {
      setExpired(false);
      return;
    }
    setRemaining(calcRemaining());
    if (isRunning) {
      const interval = setInterval(() => {
        const r = calcRemaining();
        setRemaining(r);
        if (r <= 0) setExpired(true);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, isRunning, calcRemaining]);

  useEffect(() => {
    if (!expired) return;
    const timeout = setTimeout(() => setExpired(false), 3000);
    return () => clearTimeout(timeout);
  }, [expired]);

  if (!isActive) return null;

  if (expired && remaining <= 0) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5">
        <Clock className="size-4 text-destructive" />
        <span className="text-sm font-bold text-destructive">Tiden er ute!</span>
      </div>
    );
  }

  if (remaining <= 0) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className={cn("flex items-center gap-2 rounded-full px-4 py-1.5", remaining <= 10 ? "bg-destructive/10" : "bg-primary/10")}>
      <Clock className={cn("size-4", remaining <= 10 ? "text-destructive" : "text-primary")} />
      <span className={cn("font-mono text-sm font-bold tabular-nums", remaining <= 10 ? "text-destructive" : "text-primary")}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

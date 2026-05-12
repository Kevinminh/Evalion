import { computeRemainingSeconds } from "@workspace/evalion/lib/timer";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { useStudentGame } from "./student-game-context";

export function StudentTimerBadge() {
  const { session } = useStudentGame();
  const { timerDuration, timerStartedAt, timerPausedAt, timerRemainingAtPause } = session;

  const [remaining, setRemaining] = useState(() =>
    computeRemainingSeconds(timerDuration, timerStartedAt, timerPausedAt, timerRemainingAtPause),
  );

  const isActive = !!timerStartedAt;
  const isPaused = isActive && !!timerPausedAt;
  const isRunning = isActive && !isPaused;

  useEffect(() => {
    setRemaining(
      computeRemainingSeconds(timerDuration, timerStartedAt, timerPausedAt, timerRemainingAtPause),
    );
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemaining(
        computeRemainingSeconds(timerDuration, timerStartedAt, timerPausedAt, timerRemainingAtPause),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timerDuration, timerStartedAt, timerPausedAt, timerRemainingAtPause]);

  if (!isActive) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isUrgent = isRunning && remaining > 0 && remaining <= 10;

  return (
    <span
      className={
        isUrgent
          ? "inline-flex items-center gap-1.5 rounded-full bg-usant-bg px-2.5 py-1 text-xs font-bold text-usant"
          : "inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-foreground"
      }
    >
      <Clock className="size-3.5" />
      <span className="font-mono tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </span>
  );
}

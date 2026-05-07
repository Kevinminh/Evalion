import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TopBarTimerProps {
  duration?: number;
  startedAt?: number;
  pausedAt?: number;
  remainingAtPause?: number;
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

export function TopBarTimer({
  duration,
  startedAt,
  pausedAt,
  remainingAtPause,
}: TopBarTimerProps) {
  const [remaining, setRemaining] = useState(() =>
    computeRemaining(duration, startedAt, pausedAt, remainingAtPause),
  );

  useEffect(() => {
    setRemaining(computeRemaining(duration, startedAt, pausedAt, remainingAtPause));
    if (!startedAt || pausedAt) return;
    const id = setInterval(() => {
      setRemaining(computeRemaining(duration, startedAt, pausedAt, remainingAtPause));
    }, 1000);
    return () => clearInterval(id);
  }, [duration, startedAt, pausedAt, remainingAtPause]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isUrgent = remaining > 0 && remaining <= 10;

  return (
    <div
      className="inline-flex items-center gap-3 rounded-full px-4 py-2"
      style={{ backgroundColor: "var(--usant-bg)" }}
    >
      <Clock className="size-5" style={{ color: "var(--usant)" }} />
      <span
        className="font-mono text-xl font-bold leading-none tabular-nums"
        style={{ color: isUrgent ? "var(--usant)" : "var(--foreground)" }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

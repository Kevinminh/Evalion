import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Pause, Play, Square } from "lucide-react";
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
  // Optional next-step CTA shown after the timer reaches 0
  onNextStep?: () => void;
  nextStepLabel?: string;
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
  onNextStep,
  nextStepLabel = "Gå til diskusjon",
}: TimerCardProps) {
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [displayRemaining, setDisplayRemaining] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completeFiredRef = useRef(false);

  const isActive = startedAt !== undefined && startedAt !== null;
  const isPaused = isActive && pausedAt !== undefined && pausedAt !== null;
  const isRunning = isActive && !isPaused;

  const calcRemaining = useCallback(
    () => computeRemaining(duration, startedAt, pausedAt, remainingAtPause),
    [duration, startedAt, pausedAt, remainingAtPause],
  );

  useEffect(() => {
    if (isActive) {
      completeFiredRef.current = false;
    }
  }, [startedAt, isActive]);

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

  const isFinished = isActive && displayRemaining <= 0;
  const showSetup = !isActive;

  const totalDuration = duration ?? selectedDuration;
  const pct = isActive && totalDuration > 0 ? displayRemaining / totalDuration : 1;
  let timerColor = "var(--foreground)";
  if (isActive && pct < 0.25) {
    timerColor = "var(--usant)";
  } else if (isActive && pct < 0.5) {
    timerColor = "var(--delvis)";
  }
  const isUrgent = isRunning && displayRemaining > 0 && displayRemaining <= 10;

  const displayValue = isActive
    ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(Math.floor(selectedDuration / 60)).padStart(2, "0")}:${String(
        selectedDuration % 60,
      ).padStart(2, "0")}`;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-border bg-card shadow-sm transition-all",
        isActive && !isFinished
          ? "h-[120px] gap-2 p-3"
          : "min-h-[210px] gap-3 p-4",
      )}
    >
      {showSetup && (
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          Nedtelling
        </div>
      )}
      <div
        className={cn(
          "text-center font-mono font-bold tabular-nums tracking-wider transition-colors duration-300",
          isRunning ? "text-4xl" : "text-5xl",
        )}
        style={{
          color: isUrgent ? "var(--usant)" : isActive ? timerColor : "var(--foreground)",
          animation: isUrgent ? "var(--animate-timer-pulse)" : undefined,
        }}
      >
        {displayValue}
      </div>

      {showSetup && (
        <>
          <button
            onClick={() => onStart?.(selectedDuration)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sant px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.15_145)] transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.15_145)]"
          >
            <Play className="size-4 fill-current" /> Start
          </button>
          <div className="flex w-full px-1">
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
          <div className="flex w-full justify-center gap-2">
            {[30, 60, 120].map((s) => {
              const isSelected = selectedDuration === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedDuration(s)}
                  className={cn(
                    "flex-1 rounded-full border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/10 font-bold text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  {s < 60 ? `${s}s` : `${s / 60}m`}
                </button>
              );
            })}
          </div>
        </>
      )}

      {isActive && !isFinished && (
        <div className="flex w-full gap-2">
          {isRunning ? (
            <button
              onClick={() => onPause?.()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-delvis px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.55_0.18_50)] transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.55_0.18_50)]"
            >
              <Pause className="size-4 fill-current" /> Pause
            </button>
          ) : (
            <button
              onClick={() => {
                if (remainingAtPause !== undefined && remainingAtPause > 0) {
                  onStart?.(remainingAtPause);
                }
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sant px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.15_145)] transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.15_145)]"
            >
              <Play className="size-4 fill-current" /> Fortsett
            </button>
          )}
          <button
            onClick={() => onStop?.()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-usant px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.40_0.15_25)] transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.40_0.15_25)]"
          >
            <Square className="size-4 fill-current" /> Stopp
          </button>
        </div>
      )}

      {isFinished && onNextStep && (
        <button
          onClick={onNextStep}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_3px_0_oklch(0.40_0.15_290)] transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.40_0.15_290)]"
        >
          {nextStepLabel}
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}

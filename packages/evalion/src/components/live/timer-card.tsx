import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Pause, Play, Square } from "lucide-react";
import type { CSSProperties } from "react";
import { useState, useEffect, useRef, useCallback } from "react";

export interface TimerPreset {
  /** Preset duration in seconds. */
  seconds: number;
  /** Display label, e.g. "30s" or "1m". */
  label: string;
}

export const DEFAULT_TIMER_PRESETS: TimerPreset[] = [
  { seconds: 30, label: "30s" },
  { seconds: 60, label: "1m" },
  { seconds: 120, label: "2m" },
];

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
  /** Per-step presets. Defaults to [30s, 1m, 2m]. */
  presets?: TimerPreset[];
  /** Slider min/max in seconds. Defaults: 10–180. */
  sliderMin?: number;
  sliderMax?: number;
  /** Initial duration before the user changes anything. Defaults to the second preset. */
  initialDuration?: number;
  /** Section label shown above the card (matches demo's `panel-section-label`). */
  sectionLabel?: string;
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
  presets = DEFAULT_TIMER_PRESETS,
  sliderMin = 10,
  sliderMax = 180,
  initialDuration,
  sectionLabel = "Nedtelling",
}: TimerCardProps) {
  const defaultStart = initialDuration ?? presets[1]?.seconds ?? presets[0]?.seconds ?? 60;
  const [selectedDuration, setSelectedDuration] = useState(defaultStart);
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
  const isUrgent = isRunning && displayRemaining > 0 && displayRemaining <= 10;
  const sliderPct = ((selectedDuration - sliderMin) / (sliderMax - sliderMin)) * 100;

  const displayValue = isActive
    ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(Math.floor(selectedDuration / 60)).padStart(2, "0")}:${String(
        selectedDuration % 60,
      ).padStart(2, "0")}`;

  const card = (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl transition-all",
        isActive && !isFinished ? "h-[120px] min-h-0 gap-2 p-3" : "min-h-[210px] gap-2.5 p-4",
      )}
      style={{
        backgroundColor: "var(--color-neutral-0)",
        boxShadow: "var(--shadow-card-soft)",
      }}
    >
      <div
        className={cn(
          "text-center font-mono font-bold tabular-nums leading-none transition-colors duration-300",
          "tracking-[2px]",
          isRunning ? "text-[36px]" : "text-[48px]",
        )}
        style={{
          color: isUrgent ? "var(--color-usant)" : "var(--color-text-ink-strong)",
          animation: isUrgent ? "var(--animate-timer-pulse)" : undefined,
        }}
      >
        {displayValue}
      </div>

      {showSetup && (
        <>
          <button
            type="button"
            onClick={() => onStart?.(selectedDuration)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all active:translate-y-0.5"
            style={{
              backgroundColor: "var(--color-sant)",
              boxShadow: "0 3px 0 var(--color-sant-hover)",
            }}
          >
            <Play className="size-[18px] fill-current" /> Start
          </button>
          <div className="flex w-full px-1">
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={5}
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="timer-range w-full"
              style={{ "--timer-pct": `${sliderPct}%` } as CSSProperties}
            />
          </div>
          <div className="flex w-full justify-center gap-2">
            {presets.map((p) => {
              const isSelected = selectedDuration === p.seconds;
              return (
                <button
                  key={p.seconds}
                  type="button"
                  onClick={() => setSelectedDuration(p.seconds)}
                  className="flex-1 rounded-full border-[1.5px] px-3 py-1.5 text-sm transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-primary-50)"
                      : "var(--color-neutral-0)",
                    borderColor: isSelected
                      ? "var(--color-primary-400)"
                      : "var(--color-neutral-300)",
                    color: isSelected
                      ? "var(--color-primary-600)"
                      : "var(--color-text-secondary)",
                    fontWeight: isSelected ? 700 : 600,
                  }}
                >
                  {p.label}
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
              type="button"
              onClick={() => onPause?.()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all active:translate-y-0.5"
              style={{
                backgroundColor: "var(--color-delvis)",
                boxShadow: "0 3px 0 var(--color-delvis-hover)",
              }}
            >
              <Pause className="size-4 fill-current" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (remainingAtPause !== undefined && remainingAtPause > 0) {
                  onStart?.(remainingAtPause);
                }
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all active:translate-y-0.5"
              style={{
                backgroundColor: "var(--color-sant)",
                boxShadow: "0 3px 0 var(--color-sant-hover)",
              }}
            >
              <Play className="size-4 fill-current" /> Fortsett
            </button>
          )}
          <button
            type="button"
            onClick={() => onStop?.()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all active:translate-y-0.5"
            style={{
              backgroundColor: "var(--color-usant)",
              boxShadow: "0 3px 0 #d32f2f",
            }}
          >
            <Square className="size-4 fill-current" /> Stopp
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {sectionLabel && (
        <span
          className="px-1 text-xs font-bold uppercase tracking-[0.08em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {sectionLabel}
        </span>
      )}
      {card}
      {isFinished && onNextStep && (
        <button
          type="button"
          onClick={onNextStep}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white transition-all active:translate-y-0.5"
          style={{
            backgroundColor: "var(--color-primary-500)",
            boxShadow: "0 3px 0 var(--color-primary-700)",
          }}
        >
          {nextStepLabel}
          <ArrowRight className="size-[18px]" />
        </button>
      )}
    </div>
  );
}

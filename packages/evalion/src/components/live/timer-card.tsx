import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Pause, Play, Square } from "lucide-react";
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

  const displayValue = isActive
    ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(Math.floor(selectedDuration / 60)).padStart(2, "0")}:${String(
        selectedDuration % 60,
      ).padStart(2, "0")}`;

  const card = (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[24px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.04)] transition-all",
        isActive && !isFinished
          ? "h-[120px] min-h-0 gap-2 p-3"
          : "min-h-[210px] gap-2.5 p-4",
      )}
    >
      <div
        className={cn(
          "text-center font-mono font-bold tabular-nums leading-none transition-colors duration-300",
          "tracking-[2px]",
          isRunning ? "text-[36px]" : "text-[48px]",
        )}
        style={{
          color: isUrgent ? "#EF5350" : "#212121",
          animation: isUrgent ? "var(--animate-timer-pulse)" : undefined,
        }}
      >
        {displayValue}
      </div>

      {showSetup && (
        <>
          <button
            onClick={() => onStart?.(selectedDuration)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4CAF50] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#43A047] transition-all hover:bg-[#43A047] active:translate-y-0.5 active:shadow-[0_1px_0_#43A047]"
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
              className="w-full accent-[#6C3FC5]"
            />
          </div>
          <div className="flex w-full justify-center gap-2">
            {presets.map((p) => {
              const isSelected = selectedDuration === p.seconds;
              return (
                <button
                  key={p.seconds}
                  onClick={() => setSelectedDuration(p.seconds)}
                  className={cn(
                    "flex-1 rounded-full border-[1.5px] px-3 py-1.5 text-sm font-semibold transition-colors",
                    isSelected
                      ? "border-[#8554F6] bg-[#F3EEFF] font-bold text-[#5A2FA8]"
                      : "border-[#E0E0E0] bg-white text-[#616161] hover:border-[#A37EFF] hover:bg-[#F3EEFF] hover:text-[#6C3FC5]",
                  )}
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
              onClick={() => onPause?.()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#FF9800] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#FB8C00] transition-all hover:bg-[#FB8C00] active:translate-y-0.5 active:shadow-[0_1px_0_#FB8C00]"
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
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#4CAF50] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#43A047] transition-all hover:bg-[#43A047] active:translate-y-0.5 active:shadow-[0_1px_0_#43A047]"
            >
              <Play className="size-4 fill-current" /> Fortsett
            </button>
          )}
          <button
            onClick={() => onStop?.()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#EF5350] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#D32F2F] transition-all hover:bg-[#D32F2F] active:translate-y-0.5 active:shadow-[0_1px_0_#D32F2F]"
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
        <span className="px-1 text-xs font-bold uppercase tracking-[0.08em] text-[#616161]">
          {sectionLabel}
        </span>
      )}
      {card}
      {isFinished && onNextStep && (
        <button
          onClick={onNextStep}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C3FC5] px-4 py-4 text-sm font-bold text-white shadow-[0_3px_0_#48208B] transition-all hover:opacity-90 active:translate-y-0.5 active:shadow-[0_1px_0_#48208B]"
        >
          {nextStepLabel}
          <ArrowRight className="size-[18px]" />
        </button>
      )}
    </div>
  );
}

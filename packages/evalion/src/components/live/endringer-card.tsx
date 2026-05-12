import { cn } from "@workspace/ui/lib/utils";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { formatDecimal1 } from "../../lib/format";

interface EndringerCardProps {
  correctCount: number;
  totalVotes: number;
  changedToCorrect: number;
  changedToIncorrect: number;
  avgConfidenceR1?: number;
  avgConfidenceR2?: number;
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-center text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-ink-faint)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EndringerCard({
  correctCount,
  totalVotes,
  changedToCorrect,
  changedToIncorrect,
  avgConfidenceR1,
  avgConfidenceR2,
}: EndringerCardProps) {
  const correctPct = totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0;
  const hasConfDelta =
    avgConfidenceR1 !== undefined && avgConfidenceR2 !== undefined;
  const confDelta = hasConfDelta ? avgConfidenceR2! - avgConfidenceR1! : 0;
  const showConfDelta = hasConfDelta && Math.abs(confDelta) >= 0.05;

  return (
    <div className="flex flex-col gap-3 px-1 py-1">
      <SectionLabel>Stemmemønster</SectionLabel>

      {/* Primary headline: svarte riktig */}
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-fasit-correct-bg)] px-3 py-2">
        <span className="shrink-0 font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-fasit-correct-text)]">
          {correctCount}/{totalVotes}
        </span>
        <div className="flex min-w-0 flex-col gap-px">
          <span className="text-xs font-semibold text-[var(--color-text-ink-soft)]">
            svarte riktig ({correctPct}%)
          </span>
        </div>
      </div>

      {/* Secondary headline: endret fra feil til riktig */}
      {changedToCorrect > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-rating-bar-track)] px-3 py-2">
          <span className="shrink-0 font-mono text-lg font-extrabold leading-none tabular-nums text-[var(--color-turkis-500)]">
            {changedToCorrect}
          </span>
          <div className="flex min-w-0 flex-col gap-px">
            <span className="text-xs font-semibold text-[var(--color-text-ink-soft)]">
              endret fra feil til riktig svar
            </span>
          </div>
        </div>
      )}

      {/* Warning: changed from correct to incorrect */}
      {changedToIncorrect > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-[var(--color-error-border-light)] bg-[var(--color-error-bg-light)] px-3 py-2">
          <AlertTriangle className="size-[18px] shrink-0 text-[var(--color-error)]" strokeWidth={2} />
          <span className="font-mono text-base font-extrabold leading-none tabular-nums text-[var(--color-error)]">
            {changedToIncorrect}
          </span>
          <span className="text-xs font-semibold text-[var(--color-text-ink-soft)]">
            endret fra riktig til feil
          </span>
        </div>
      )}

      {/* Confidence shift */}
      {hasConfDelta && (
        <>
          <SectionLabel className="-mb-2 mt-2">Gjennomsnittlig sikkerhet</SectionLabel>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-highlight-strip-bg)] px-3 py-2">
            <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-text-ink-faint)]">
              {formatDecimal1(avgConfidenceR1)}
            </span>
            <ArrowRight className="size-[14px] text-[var(--color-text-ink-faint)]" strokeWidth={2.5} />
            <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-turkis-500)]">
              {formatDecimal1(avgConfidenceR2)}
            </span>
            {showConfDelta && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-xs font-bold tabular-nums",
                  confDelta > 0
                    ? "bg-[var(--color-fasit-correct-bg)] text-[var(--color-fasit-correct-text)]"
                    : "bg-[var(--color-error-bg-light)] text-[var(--color-error)]",
                )}
              >
                {confDelta > 0 ? "+" : ""}
                {formatDecimal1(confDelta)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

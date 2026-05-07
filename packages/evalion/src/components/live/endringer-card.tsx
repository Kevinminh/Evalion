import { cn } from "@workspace/ui/lib/utils";
import { AlertTriangle, ArrowRight } from "lucide-react";

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
        "text-center text-xs font-bold uppercase tracking-[0.08em] text-[#9E9E9E]",
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
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#E8F5E9] px-3 py-2">
        <span className="shrink-0 font-mono text-xl font-extrabold leading-none tabular-nums text-[#4CAF50]">
          {correctCount}/{totalVotes}
        </span>
        <div className="flex min-w-0 flex-col gap-px">
          <span className="text-xs font-semibold text-[#616161]">
            svarte riktig ({correctPct}%)
          </span>
        </div>
      </div>

      {/* Secondary headline: endret fra feil til riktig */}
      {changedToCorrect > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#F5F5F5] px-3 py-2">
          <span className="shrink-0 font-mono text-lg font-extrabold leading-none tabular-nums text-[#1FA89F]">
            {changedToCorrect}
          </span>
          <div className="flex min-w-0 flex-col gap-px">
            <span className="text-xs font-semibold text-[#616161]">
              endret fra feil til riktig svar
            </span>
          </div>
        </div>
      )}

      {/* Warning: changed from correct to incorrect */}
      {changedToIncorrect > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-[rgba(244,67,54,0.2)] bg-[#FFEBEE] px-3 py-2">
          <AlertTriangle className="size-[18px] shrink-0 text-[#EF5350]" strokeWidth={2} />
          <span className="font-mono text-base font-extrabold leading-none tabular-nums text-[#EF5350]">
            {changedToIncorrect}
          </span>
          <span className="text-xs font-semibold text-[#616161]">
            endret fra riktig til feil
          </span>
        </div>
      )}

      {/* Confidence shift */}
      {hasConfDelta && (
        <>
          <SectionLabel className="-mb-2 mt-2">Gjennomsnittlig sikkerhet</SectionLabel>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#F3EEFF] px-3 py-2">
            <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[#9E9E9E]">
              {avgConfidenceR1!.toFixed(1).replace(".", ",")}
            </span>
            <ArrowRight className="size-[14px] text-[#9E9E9E]" strokeWidth={2.5} />
            <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[#1FA89F]">
              {avgConfidenceR2!.toFixed(1).replace(".", ",")}
            </span>
            {showConfDelta && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-xs font-bold tabular-nums",
                  confDelta > 0
                    ? "bg-[#E8F5E9] text-[#4CAF50]"
                    : "bg-[#FFEBEE] text-[#EF5350]",
                )}
              >
                {confDelta > 0 ? "+" : ""}
                {confDelta.toFixed(1).replace(".", ",")}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

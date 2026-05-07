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

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="text-center text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
      style={style}
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

  return (
    <div className="flex flex-col gap-3 py-1">
      <SectionLabel>Stemmemønster</SectionLabel>

      {/* Primary headline: svarte riktig */}
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-sant/10 px-3 py-2">
        <span className="shrink-0 font-mono text-xl font-extrabold leading-none text-sant tabular-nums">
          {correctCount}/{totalVotes}
        </span>
        <div className="flex min-w-0 flex-col gap-px">
          <span className="text-xs font-semibold text-foreground">svarte riktig</span>
          <span className="text-[10px] font-medium leading-normal text-muted-foreground">
            ({correctPct}%)
          </span>
        </div>
      </div>

      {/* Secondary headline: endret fra feil til riktig */}
      {changedToCorrect > 0 && (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-muted px-3 py-2">
          <span className="shrink-0 font-mono text-lg font-extrabold leading-none text-secondary-teal tabular-nums">
            {changedToCorrect}
          </span>
          <div className="flex min-w-0 flex-col gap-px">
            <span className="text-xs font-semibold text-foreground">
              endret fra feil til riktig svar
            </span>
          </div>
        </div>
      )}

      {/* Warning: changed from correct to incorrect */}
      {changedToIncorrect > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-usant/20 bg-usant/10 px-3 py-2">
          <AlertTriangle className="size-[18px] shrink-0 text-delvis" strokeWidth={2} />
          <span className="text-xs font-bold text-foreground">{changedToIncorrect}</span>
          <span className="text-xs font-medium text-muted-foreground">
            endret fra riktig til feil
          </span>
        </div>
      )}

      {/* Confidence shift */}
      {hasConfDelta && (
        <>
          <SectionLabel
            style={{ marginTop: "0.5rem", marginBottom: "-0.5rem" }}
          >
            Gjennomsnittlig sikkerhet
          </SectionLabel>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-primary/10 px-3 py-2">
            <span className="font-mono text-xl font-extrabold leading-none text-muted-foreground tabular-nums">
              {avgConfidenceR1!.toFixed(1)}
            </span>
            <ArrowRight className="size-[14px] text-muted-foreground" strokeWidth={2.5} />
            <span className="font-mono text-xl font-extrabold leading-none text-secondary-teal tabular-nums">
              {avgConfidenceR2!.toFixed(1)}
            </span>
            {Math.abs(confDelta) >= 0.05 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-xs font-bold tabular-nums",
                  confDelta > 0 ? "bg-sant/15 text-sant" : "bg-usant/15 text-usant",
                )}
              >
                {confDelta > 0 ? "+" : ""}
                {confDelta.toFixed(1)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import { cn } from "@workspace/ui/lib/utils";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, MoveRight } from "lucide-react";

interface EndringerCardProps {
  correctCount: number;
  totalVotes: number;
  changedToCorrect: number;
  changedToIncorrect: number;
  avgConfidenceOld?: number;
  avgConfidenceNew?: number;
}

export function EndringerCard({
  correctCount,
  totalVotes,
  changedToCorrect,
  changedToIncorrect,
  avgConfidenceOld,
  avgConfidenceNew,
}: EndringerCardProps) {
  const correctPct = totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0;
  const toCorrectPct =
    totalVotes > 0 ? Math.round((changedToCorrect / totalVotes) * 100) : 0;
  const toIncorrectPct =
    totalVotes > 0 ? Math.round((changedToIncorrect / totalVotes) * 100) : 0;

  const hasDelta = avgConfidenceOld !== undefined && avgConfidenceNew !== undefined;
  const delta = hasDelta ? avgConfidenceNew! - avgConfidenceOld! : 0;

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-sant/10 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sant">
          <CheckCircle2 className="size-3.5" /> Svarte riktig
        </div>
        <p className="mt-1 text-xl font-extrabold text-sant tabular-nums">
          {correctCount}/{totalVotes}{" "}
          <span className="text-sm font-semibold">({correctPct}%)</span>
        </p>
      </div>

      {changedToCorrect > 0 && (
        <div className="rounded-xl bg-sant/10 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sant">
            <ArrowUpRight className="size-3.5" /> Endret fra feil til riktig
          </div>
          <p className="mt-1 text-xl font-extrabold text-sant tabular-nums">
            {changedToCorrect}{" "}
            <span className="text-sm font-semibold">({toCorrectPct}%)</span>
          </p>
        </div>
      )}

      {changedToIncorrect > 0 && (
        <div className="rounded-xl bg-usant/10 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-usant">
            <ArrowDownRight className="size-3.5" /> Endret fra riktig til feil
          </div>
          <p className="mt-1 text-xl font-extrabold text-usant tabular-nums">
            {changedToIncorrect}{" "}
            <span className="text-sm font-semibold">({toIncorrectPct}%)</span>
          </p>
        </div>
      )}

      {hasDelta && (
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Gjennomsnittlig sikkerhet
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-lg font-extrabold text-foreground tabular-nums">
              {avgConfidenceOld!.toFixed(1)}
              <MoveRight className="size-4 text-muted-foreground" strokeWidth={2.5} />
              {avgConfidenceNew!.toFixed(1)}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-bold text-white tabular-nums",
                delta > 0 ? "bg-sant" : delta < 0 ? "bg-usant" : "bg-muted-foreground",
              )}
            >
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

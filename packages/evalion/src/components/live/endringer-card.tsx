import { cn } from "@workspace/ui/lib/utils";

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
  const toCorrectPct = totalVotes > 0 ? Math.round((changedToCorrect / totalVotes) * 100) : 0;
  const toIncorrectPct =
    totalVotes > 0 ? Math.round((changedToIncorrect / totalVotes) * 100) : 0;

  const hasDelta =
    avgConfidenceOld !== undefined && avgConfidenceNew !== undefined;
  const delta = hasDelta ? avgConfidenceNew! - avgConfidenceOld! : 0;

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-sant/10 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-sant">Svarte riktig</div>
        <p className="text-lg font-extrabold text-sant">
          {correctCount}/{totalVotes}{" "}
          <span className="text-sm font-semibold">({correctPct}%)</span>
        </p>
      </div>

      {changedToCorrect > 0 && (
        <div className="rounded-lg bg-sant/10 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-sant">
            Endret fra feil til riktig
          </div>
          <p className="text-lg font-extrabold text-sant">
            {changedToCorrect}{" "}
            <span className="text-sm font-semibold">({toCorrectPct}%)</span>
          </p>
        </div>
      )}

      {changedToIncorrect > 0 && (
        <div className="rounded-lg bg-usant/10 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-usant">
            Endret fra riktig til feil
          </div>
          <p className="text-lg font-extrabold text-usant">
            {changedToIncorrect}{" "}
            <span className="text-sm font-semibold">({toIncorrectPct}%)</span>
          </p>
        </div>
      )}

      {hasDelta && (
        <div className="rounded-lg bg-muted p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Gjennomsnittlig sikkerhet
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-foreground">
              {avgConfidenceOld!.toFixed(1)} → {avgConfidenceNew!.toFixed(1)}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-bold text-white",
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

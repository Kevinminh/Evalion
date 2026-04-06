import { useQuery } from "@tanstack/react-query";
import { EndringerCard } from "@workspace/ui/components/live/endringer-card";
import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { AnalyticsRatingChart } from "@/components/analytics/rating-chart-analytics";
import { VoteChart } from "@/components/analytics/vote-chart";
import { liveSessionQueries } from "@/lib/convex";
import type { Fasit } from "@/lib/types";
import type { Id } from "@/lib/convex";

interface StatementAnalyticsProps {
  sessionId: Id<"liveSessions">;
  statementIndex: number;
  statementText: string;
  fasit: Fasit;
}

export function StatementAnalytics({
  sessionId,
  statementIndex,
  statementText,
  fasit,
}: StatementAnalyticsProps) {
  const { data: analytics, isPending } = useQuery(
    liveSessionQueries.getVoteAnalytics(sessionId, statementIndex),
  );

  if (isPending || !analytics) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statement header */}
      <div className="rounded-2xl border-[1.5px] border-border bg-card p-5">
        <p className="mb-3 text-base font-semibold text-foreground">{statementText}</p>
        <FasitBadge fasit={fasit} className="text-sm px-4 py-1.5" />
      </div>

      {/* Vote distributions side by side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-[1.5px] border-border bg-card p-5">
          <VoteChart data={analytics.round1} label="Runde 1 — Individuelle svar" />
        </div>
        <div className="rounded-2xl border-[1.5px] border-border bg-card p-5">
          <VoteChart data={analytics.round2} label="Runde 2 — Etter diskusjon" />
        </div>
      </div>

      {/* Changes + Rating */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-[1.5px] border-border bg-card p-5">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Endringer
          </div>
          <EndringerCard
            correctCount={analytics.correctR2}
            totalVotes={analytics.totalR2}
            changedToCorrect={analytics.wrongToRight}
            changedToIncorrect={analytics.rightToWrong}
          />
        </div>
        {analytics.ratingDistribution.some((d) => d.count > 0) && (
          <div className="rounded-2xl border-[1.5px] border-border bg-card p-5">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Egenvurdering
            </div>
            <AnalyticsRatingChart
              distribution={analytics.ratingDistribution}
              average={analytics.avgRating}
            />
          </div>
        )}
      </div>
    </div>
  );
}

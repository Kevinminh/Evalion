import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@workspace/backend/convex/_generated/api";
import { RouteErrorBoundary } from "@workspace/features/components/route-error-boundary";
import { Button } from "@workspace/ui/components/button";
import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { NotFoundState } from "@workspace/ui/components/states/not-found-state";
import { useMutation } from "convex/react";

import { ResultatTab } from "@/components/analytics/resultat-tab";
import { RoundAnalytics } from "@/components/analytics/round-analytics";
import type { StatementColorName } from "@/components/analytics/types";
import { WaitingState } from "@/components/analytics/waiting-state";
import { liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/_authed/analytics/$id")({
  component: AnalyticsPage,
  errorComponent: RouteErrorBoundary,
});

type TabId = "runde1" | "runde2" | "resultat";

const BADGE_LABELS: Record<TabId, string> = {
  runde1: "Første stemmerunde",
  runde2: "Andre stemmerunde",
  resultat: "Resultat",
};

const STEP_TO_TAB: Record<number, TabId> = {
  1: "runde1",
  2: "runde1",
  3: "runde2",
  4: "resultat",
  5: "resultat",
  6: "resultat",
};

function AnalyticsPage() {
  const { id } = Route.useParams();
  const sessionId = id as Id<"liveSessions">;

  const {
    data: session,
    isPending: sessionPending,
    isError: sessionError,
  } = useQuery(liveSessionQueries.getSessionWithFagprat(sessionId));

  // The analytics view passively follows the live session — no manual
  // statement selector or round/resultat tabs. The current påstand and
  // current step are read straight off the session document.
  const selectedStatement = session?.currentStatementIndex ?? 0;
  const activeTab: TabId = STEP_TO_TAB[session?.currentStep ?? 1] ?? "runde1";

  const { data: analytics } = useQuery(
    liveSessionQueries.getVoteAnalytics(sessionId, selectedStatement),
  );

  const highlightBegrunnelse = useMutation(api.liveSessions.highlightBegrunnelse);

  if (sessionPending) return <AnalyticsSkeleton />;
  if (sessionError) return <ErrorState className="flex min-h-svh items-center justify-center" />;
  if (!session) return <NotFoundState className="flex min-h-svh items-center justify-center" />;
  if (session.status === "ended") return <SessionEndedScreen />;

  const statementText = session.statements[selectedStatement]?.text ?? "";
  const fasit = session.statements[selectedStatement]?.fasit ?? "sant";
  const statementColor = session.statements[selectedStatement]?.color;
  const totalStudents = session.studentCount;
  const sessionActive = session.status === "active";
  const totalStatements = session.statements.length;
  const showR1Comparison = (session.currentStep ?? 0) >= 4;

  return (
    <div className="flex min-h-svh flex-col bg-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white px-4 pb-2.5 pt-3">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <img src="/co-lab-logo.png" alt="CO-LAB" className="h-5 object-contain" />
            <div className="h-3.5 w-px bg-neutral-300" />
            <span className="text-xs font-bold text-foreground">Live-statistikk</span>
          </div>
          <div className="flex items-center gap-1.5">
            {totalStatements > 1 && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                Påstand {selectedStatement + 1} av {totalStatements}
              </span>
            )}
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              {BADGE_LABELS[activeTab]}
            </span>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto w-full max-w-lg flex-1 px-4 pt-4 pb-8">
        {!analytics ? (
          <div className="flex flex-col gap-4 pt-4">
            <Skeleton className="h-64 rounded-[16px]" />
            <Skeleton className="h-48 rounded-[16px]" />
          </div>
        ) : activeTab === "runde1" && analytics.round1.total === 0 && sessionActive ? (
          <WaitingState />
        ) : (
          <>
            {activeTab === "runde1" && (
              <RoundAnalytics
                round={1}
                distribution={analytics.round1}
                confidence={analytics.confidence1}
                fasit={fasit}
                statementText={statementText}
                statementColor={statementColor as StatementColorName | undefined}
                totalStudents={totalStudents}
                sessionActive={sessionActive}
                students={analytics.students}
                onToggleHighlight={(id, next) => highlightBegrunnelse({ id, highlighted: next })}
              />
            )}

            {activeTab === "runde2" && (
              <RoundAnalytics
                round={2}
                distribution={analytics.round2}
                confidence={analytics.confidence2}
                prevConfidence={showR1Comparison ? analytics.confidence1 : undefined}
                prevDistribution={showR1Comparison ? analytics.round1 : undefined}
                fasit={fasit}
                statementText={statementText}
                statementColor={statementColor as StatementColorName | undefined}
                totalStudents={totalStudents}
                sessionActive={sessionActive}
                students={analytics.students}
              />
            )}

            {activeTab === "resultat" && (
              <ResultatTab
                round1={analytics.round1}
                round2={analytics.round2}
                fasit={fasit}
                statementText={statementText}
                statementColor={statementColor as StatementColorName | undefined}
                avgRating={analytics.avgRating}
                ratingDistribution={analytics.ratingDistribution}
                students={analytics.students}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SessionEndedScreen() {
  return (
    <EmptyStateMessage>
      <h1 className="font-heading text-2xl font-medium">Økten er avsluttet</h1>
      <p className="text-muted-foreground">Stemmene er talt opp og aktiviteten er ferdig.</p>
      <Button render={<Link to="/min-samling" />} size="sm" className="mt-2">
        Gå til Min samling
      </Button>
    </EmptyStateMessage>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="flex min-h-svh flex-col bg-neutral-100">
      <div className="border-b border-neutral-200 bg-white px-4 py-3">
        <Skeleton className="mx-auto h-6 w-48" />
      </div>
      <div className="flex justify-center gap-2 px-4 py-3">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="mx-auto w-full max-w-lg px-4">
        <Skeleton className="h-64 rounded-[16px]" />
        <Skeleton className="mt-4 h-48 rounded-[16px]" />
      </div>
    </div>
  );
}

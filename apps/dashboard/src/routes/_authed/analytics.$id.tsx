import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";

import { RoundAnalytics } from "@/components/analytics/round-analytics";
import { ResultatTab } from "@/components/analytics/resultat-tab";
import { ErrorState } from "@/components/error-state";
import { NotFoundState } from "@/components/not-found-state";
import { liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/_authed/analytics/$id")({
  component: AnalyticsPage,
  errorComponent: RouteErrorBoundary,
});

type TabId = "runde1" | "runde2" | "resultat";

const TABS: { id: TabId; label: string }[] = [
  { id: "runde1", label: "Runde 1" },
  { id: "runde2", label: "Runde 2" },
  { id: "resultat", label: "Resultat" },
];

const BADGE_LABELS: Record<TabId, string> = {
  runde1: "Første stemmerunde",
  runde2: "Andre stemmerunde",
  resultat: "Resultat",
};

function AnalyticsPage() {
  const { id } = Route.useParams();
  const sessionId = id as Id<"liveSessions">;

  const {
    data: session,
    isPending: sessionPending,
    isError: sessionError,
  } = useQuery(liveSessionQueries.getSessionWithFagprat(sessionId));

  const [activeTab, setActiveTab] = useState<TabId>("runde1");
  const [selectedStatement, setSelectedStatement] = useState(0);

  // Fetch analytics for the selected statement (always called — sessionId is from route params)
  const { data: analytics } = useQuery(
    liveSessionQueries.getVoteAnalytics(sessionId, selectedStatement),
  );

  if (sessionPending) return <AnalyticsSkeleton />;
  if (sessionError) return <ErrorState className="flex min-h-svh items-center justify-center" />;
  if (!session) return <NotFoundState className="flex min-h-svh items-center justify-center" />;

  const statementText = session.statements[selectedStatement]?.text ?? "";
  const fasit = session.statements[selectedStatement]?.fasit ?? "sant";
  const totalStudents = session.studentCount;
  const sessionActive = session.status === "active";

  // Calculate total wrong from R1 for the wrongToRight fraction
  const totalWrongR1 = analytics
    ? analytics.students.filter((s) => s.round1 && !s.round1.correct).length
    : 0;

  return (
    <div className="flex min-h-svh flex-col bg-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white px-4 pb-2.5 pt-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src="/fagprat-logo.png" alt="FagPrat" className="h-5 object-contain" />
            <div className="h-3.5 w-px bg-neutral-300" />
            <span className="text-xs font-bold text-foreground">Live-statistikk</span>
          </div>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {BADGE_LABELS[activeTab]}
          </span>
        </div>

        {/* Statement selector (if multiple) */}
        {session.statements.length > 1 && (
          <div className="mx-auto mt-2 flex max-w-lg gap-1.5 overflow-x-auto">
            {session.statements.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedStatement(i)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all",
                  selectedStatement === i
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200",
                )}
              >
                Påstand {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex justify-center gap-2 bg-neutral-100 px-4 py-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-[13px] font-bold transition-all",
              activeTab === tab.id
                ? "bg-primary text-white"
                : "border-[1.5px] border-neutral-200 bg-white text-muted-foreground hover:border-neutral-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mx-auto w-full max-w-lg flex-1 px-4 pb-8">
        {!analytics ? (
          <div className="flex flex-col gap-4 pt-4">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        ) : (
          <>
            {activeTab === "runde1" && (
              <RoundAnalytics
                round={1}
                distribution={analytics.round1}
                confidence={analytics.confidence1}
                fasit={fasit}
                statementText={statementText}
                totalStudents={totalStudents}
                sessionActive={sessionActive}
                students={analytics.students}
              />
            )}

            {activeTab === "runde2" && (
              <RoundAnalytics
                round={2}
                distribution={analytics.round2}
                confidence={analytics.confidence2}
                prevConfidence={analytics.confidence1}
                prevDistribution={analytics.round1}
                fasit={fasit}
                statementText={statementText}
                totalStudents={totalStudents}
                sessionActive={sessionActive}
                students={analytics.students}
                wrongToRight={analytics.wrongToRight}
                totalWrong={totalWrongR1}
              />
            )}

            {activeTab === "resultat" && (
              <ResultatTab
                round1={analytics.round1}
                round2={analytics.round2}
                fasit={fasit}
                statementText={statementText}
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
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="mt-4 h-48 rounded-2xl" />
      </div>
    </div>
  );
}

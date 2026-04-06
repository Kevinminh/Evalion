import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@workspace/ui/components/route-error-boundary";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { Users, Hash, Activity } from "lucide-react";
import { useState } from "react";

import { CopyUrlButton } from "@/components/analytics/copy-url-button";
import { OverviewCard } from "@/components/analytics/overview-card";
import { StatementAnalytics } from "@/components/analytics/statement-analytics";
import { ErrorState } from "@/components/error-state";
import { NotFoundState } from "@/components/not-found-state";
import { liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/_authed/analytics/$id")({
  component: AnalyticsPage,
  errorComponent: RouteErrorBoundary,
});

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  lobby: { label: "Lobby", className: "bg-amber-100 text-amber-800" },
  active: { label: "Aktiv", className: "bg-green-100 text-green-800" },
  ended: { label: "Avsluttet", className: "bg-muted text-muted-foreground" },
};

function AnalyticsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const sessionId = id as Id<"liveSessions">;

  const {
    data: session,
    isPending,
    isError,
  } = useQuery(liveSessionQueries.getSessionWithFagprat(sessionId));

  const [selectedStatement, setSelectedStatement] = useState(0);

  if (isPending) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return <ErrorState className="flex min-h-svh items-center justify-center" />;
  }

  if (!session) {
    return <NotFoundState className="flex min-h-svh items-center justify-center" />;
  }

  const statusConfig = STATUS_LABELS[session.status] ?? STATUS_LABELS.ended!;
  const analyticsUrl = `${window.location.origin}/analytics/${id}`;

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar
        title={session.fagpratTitle}
        onExit={() => navigate({ to: "/historikk" })}
      />

      <div className="mx-auto max-w-[1100px] px-4 pt-20 pb-12 sm:px-8 sm:pt-24">
        {/* Overview strip */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <OverviewCard
            icon={<Hash className="size-4 text-muted-foreground" />}
            label="Kode"
            value={session.joinCode}
          />
          <OverviewCard
            icon={<Users className="size-4 text-muted-foreground" />}
            label="Elever"
            value={String(session.studentCount)}
          />
          <div className="rounded-2xl border-[1.5px] border-border bg-card p-4">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="size-4" />
              Status
            </div>
            <span
              className={cn(
                "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold",
                statusConfig.className,
              )}
            >
              {statusConfig.label}
            </span>
          </div>
          <div className="rounded-2xl border-[1.5px] border-border bg-card p-4">
            <div className="mb-2 text-xs text-muted-foreground">Del analytics</div>
            <div className="flex items-center gap-3">
              <QRCodeSVG value={analyticsUrl} size={64} className="shrink-0 rounded" />
              <CopyUrlButton url={analyticsUrl} />
            </div>
          </div>
        </div>

        {/* Statement tabs */}
        <Tabs
          defaultValue={0}
          value={selectedStatement}
          onValueChange={(val) => setSelectedStatement(val as number)}
        >
          <div className="mb-6 overflow-x-auto">
            <TabsList className="w-full flex-wrap sm:flex-nowrap">
              {session.statements.map((_, i) => (
                <TabsTrigger key={i} value={i}>
                  Påstand {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {session.statements.map((statement, i) => (
            <TabsContent key={i} value={i}>
              <StatementAnalytics
                sessionId={sessionId}
                statementIndex={i}
                statementText={statement.text}
                fasit={statement.fasit}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b bg-card px-3 sm:h-16 sm:px-6">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="mx-auto max-w-[1100px] px-4 pt-20 pb-12 sm:px-8 sm:pt-24">
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mb-6 h-10 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

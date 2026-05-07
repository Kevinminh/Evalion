import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { SessionTopBar } from "@workspace/evalion/components/live/session-top-bar";
import { TeacherLobbySkeleton } from "@workspace/evalion/components/skeletons/teacher-lobby-skeleton";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { Users } from "lucide-react";

import { fagpratQueries, liveSessionQueries } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";
import { parseSessionId, placeholderConvexId } from "@/lib/route-params";

import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { DestructiveButton } from "@workspace/ui/components/destructive-button";
import { JoinCard } from "@/components/liveokt/lobby/join-card";
import { StudentGrid } from "@/components/liveokt/lobby/student-grid";
import { useLobbyActions } from "@/hooks/liveokt/use-lobby-actions";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";

export const Route = createFileRoute("/liveokt/$sessionId/")({
  beforeLoad: ({ params }) => {
    parseSessionId(params.sessionId);
  },
  component: TeacherLobbyPage,
  errorComponent: RouteErrorBoundary,
});

function TeacherLobbyPage() {
  const { sessionId } = Route.useParams();
  const typedSessionId = parseSessionId(sessionId);

  const { data: session, isPending: sessionLoading } = useQuery(
    liveSessionQueries.getById(typedSessionId),
  );
  const { data: fagprat, isPending: fagpratLoading } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId ?? placeholderConvexId<"fagprats">()),
    enabled: !!session?.fagpratId,
  });
  const { data: students } = useQuery(liveSessionQueries.listStudents(typedSessionId));

  const lobby = useLobbyActions({
    sessionId: typedSessionId,
    groupCount: session?.groupCount ?? 0,
  });

  if (sessionLoading || fagpratLoading) {
    return <TeacherLobbySkeleton />;
  }

  if (!session || !fagprat) {
    return (
      <EmptyStateMessage>
        <p className="text-muted-foreground">Økt ikke funnet.</p>
      </EmptyStateMessage>
    );
  }

  const studentList = students ?? [];
  const hasGroups = studentList.some((s) => s.groupIndex !== undefined);
  const showGroupButton = session.groupsEnabled && !hasGroups;
  const joinUrl = `${window.location.origin}/delta?code=${session.joinCode}`;

  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-bg-warm)]">
      <SessionTopBar title={fagprat.title}>
        {showGroupButton && (
          <PrimaryActionButton onClick={lobby.createGroups}>
            <Users className="size-4" />
            Opprett grupper
          </PrimaryActionButton>
        )}
        <PrimaryActionButton variant="sant" onClick={lobby.start}>
          Start aktiviteten
        </PrimaryActionButton>
        <a
          href={DASHBOARD_URL}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          Gå til dashboard
        </a>
        <DestructiveButton onClick={lobby.end}>Avslutt</DestructiveButton>
      </SessionTopBar>

      <div className="flex flex-1 flex-col pt-16 lg:flex-row">
        <JoinCard
          joinCode={session.joinCode}
          joinUrl={joinUrl}
          joinHost={window.location.host}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <StudentGrid
              students={studentList}
              groupCount={session.groupCount}
              hasGroups={hasGroups}
              onRemove={lobby.removeStudent}
            />
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Venter på at elever kobler til
              <WaitingDots />
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <Users className="size-4" />
              {studentList.length}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.9) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes groupFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

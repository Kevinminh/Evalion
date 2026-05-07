import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SessionTopBar } from "@workspace/evalion/components/live/session-top-bar";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { TeacherLobbySkeleton } from "@workspace/evalion/components/skeletons/teacher-lobby-skeleton";
import { DestructiveButton } from "@workspace/ui/components/destructive-button";
import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { Users } from "lucide-react";

import { JoinCard } from "@/components/liveokt/lobby/join-card";
import { StudentGrid } from "@/components/liveokt/lobby/student-grid";
import { useLobbyActions } from "@/hooks/liveokt/use-lobby-actions";
import { fagpratQueries, liveSessionQueries } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";
import { parseSessionId, placeholderConvexId } from "@/lib/route-params";

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

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery(liveSessionQueries.getById(typedSessionId));

  const {
    data: fagprat,
    isLoading: fagpratLoading,
    error: fagpratError,
  } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId ?? placeholderConvexId<"fagprats">()),
    enabled: !!session?.fagpratId,
  });

  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery(liveSessionQueries.listStudents(typedSessionId));

  const lobby = useLobbyActions({
    sessionId: typedSessionId,
    groupCount: session?.groupCount ?? 0,
  });

  if (sessionLoading || fagpratLoading || studentsLoading) {
    return <TeacherLobbySkeleton />;
  }

  if (sessionError || fagpratError || studentsError) {
    return <ErrorState className="flex min-h-svh items-center justify-center" />;
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
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-5 py-2 text-sm font-bold text-neutral-700 shadow-[0_3px_0_oklch(0.85_0_0)] transition-all hover:-translate-y-px hover:bg-neutral-50 hover:shadow-[0_4px_0_oklch(0.85_0_0)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.85_0_0)]"
        >
          Gå til dashboard
        </a>
        <DestructiveButton onClick={lobby.end}>Avslutt</DestructiveButton>
      </SessionTopBar>

      <div className="flex flex-1 flex-col pt-16 lg:flex-row">
        <JoinCard joinCode={session.joinCode} joinUrl={joinUrl} joinHost={window.location.host} />

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <StudentGrid
              students={studentList}
              groupCount={session.groupCount}
              hasGroups={hasGroups}
              onRemove={lobby.removeStudent}
            />
          </div>

          <div className="flex shrink-0 items-center justify-between px-6 py-3">
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

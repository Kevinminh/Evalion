import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Professor } from "@workspace/features/components/live/professor";
import { RouteErrorBoundary } from "@workspace/features/components/route-error-boundary";
import { StudentGameSkeleton } from "@workspace/features/components/skeletons/student-game-skeleton";
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog";
import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { StudentAvatar } from "@workspace/ui/components/student-avatar";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

import { fagpratsQueries } from "@workspace/api/fagprats";
import { liveSessionsQueries } from "@workspace/api/liveSessions";
import { sessionStudentsQueries } from "@workspace/api/sessionStudents";
import { sessionVotesQueries } from "@workspace/api/sessionVotes";

import { StudentGameProvider, useStudentGame } from "@/components/spill/student-game-context";
import { StudentStepRenderer } from "@/components/spill/student-step-renderer";
import { StudentTimerBadge } from "@/components/spill/student-timer-badge";
import { StudentTopbar } from "@/components/spill/student-topbar";
import { parseStudentId } from "@/lib/route-params";
import { phaseStepNumber } from "@/types/student-phase";

export const Route = createFileRoute("/spill/$studentId")({
  beforeLoad: ({ params }) => {
    parseStudentId(params.studentId);
  },
  component: StudentGamePage,
  errorComponent: RouteErrorBoundary,
});

function StudentGamePage() {
  const { studentId } = Route.useParams();
  const navigate = useNavigate();
  const typedStudentId = parseStudentId(studentId);

  const { data: student, isPending: studentLoading } = useQuery(
    sessionStudentsQueries.byId(typedStudentId),
  );
  const { data: session } = useQuery(liveSessionsQueries.byId(student?.sessionId ?? "skip"));
  const { data: fagprat } = useQuery(fagpratsQueries.byId(session?.fagpratId ?? "skip"));
  const { data: students } = useQuery(
    sessionStudentsQueries.listBySession(student?.sessionId ?? "skip"),
  );
  const { data: votes } = useQuery(
    sessionVotesQueries.bySessionStatement(
      student?.sessionId && fagprat ? student.sessionId : "skip",
      session?.currentStatementIndex ?? 0,
    ),
  );

  if (studentLoading) {
    return <StudentGameSkeleton />;
  }

  if (!student) {
    return (
      <EmptyStateMessage>
        <p className="text-center text-lg font-bold text-foreground">Eleven ble ikke funnet</p>
      </EmptyStateMessage>
    );
  }

  if (!session || !fagprat) {
    return (
      <EmptyStateMessage className="gap-4">
        <StudentAvatar name={student.name} avatarColor={student.avatarColor} />
        <h1 className="text-xl font-extrabold text-foreground">Hei, {student.name}!</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Kobler til økten...
        </div>
      </EmptyStateMessage>
    );
  }

  return (
    <StudentGameProvider
      student={student}
      session={session}
      fagprat={fagprat}
      students={students ?? []}
      votes={votes ?? []}
    >
      <StudentGameLayout onLeave={() => navigate({ to: "/" })} />
    </StudentGameProvider>
  );
}

function StudentGameLayout({ onLeave }: { onLeave: () => void }) {
  const { student, session, fagprat, phase, removeStudent } = useStudentGame();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleLeave = async () => {
    try {
      await removeStudent();
      onLeave();
    } catch {
      toast.error("Kunne ikke forlate spillet. Prøv igjen.");
    }
  };

  // Step 0 (waiting for the teacher to pick a påstand) needs more horizontal
  // room so the Professor and the påstand cards can sit side-by-side on iPads,
  // matching the landing-page demo layout.
  const useWideLayout = session.status === "active" && phase.kind === "waiting";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--color-bg-warm)] px-6 py-8">
      <StudentTopbar
        studentName={student.name}
        fagpratTitle={fagprat.title}
        currentStep={session.status === "active" ? phaseStepNumber(phase) : undefined}
        stepLabel={session.status === "lobby" ? "Lobby" : undefined}
        onLeave={() => setShowLeaveConfirm(true)}
        rightSlot={<StudentTimerBadge />}
        hideStepBadge={!!session.timerStartedAt}
      />

      <div
        className={cn(
          "flex w-full flex-col items-center pt-8",
          useWideLayout ? "max-w-3xl" : "max-w-md md:max-w-lg lg:max-w-2xl",
        )}
      >
        <StudentGameContent onLeave={onLeave} />
      </div>

      <ConfirmDialog
        open={showLeaveConfirm}
        onOpenChange={setShowLeaveConfirm}
        title="Forlat spill?"
        description="Er du sikker på at du vil forlate spillet?"
        confirmLabel="Ja, forlat"
        cancelLabel="Avbryt"
        onConfirm={handleLeave}
      />
    </div>
  );
}

function StudentGameContent({ onLeave }: { onLeave: () => void }) {
  const { session, student } = useStudentGame();

  if (session.status === "lobby") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Professor size="xl" bounce bordered className="justify-center" />
        <h1 className="text-base font-bold text-[var(--color-primary-700)]">
          Hei, <span className="text-[var(--color-primary-500)]">{student.name}</span>!
        </h1>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          Venter på at læreren starter aktiviteten
        </p>
        <WaitingDots className="ml-0" />
      </div>
    );
  }

  if (session.status === "ended") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <h1 className="text-xl font-extrabold text-foreground">Økten er avsluttet</h1>
        <p className="text-muted-foreground">Takk for at du deltok!</p>
        <button
          type="button"
          onClick={onLeave}
          className="mt-2 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-[0_4px_0_var(--color-primary-700,theme(colors.purple.700))] transition-all active:translate-y-0.5"
        >
          Gå til forsiden
        </button>
      </div>
    );
  }

  return <StudentStepRenderer />;
}

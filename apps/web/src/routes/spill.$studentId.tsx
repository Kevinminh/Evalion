import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { StudentGameSkeleton } from "@workspace/evalion/components/skeletons/student-game-skeleton";
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { useState } from "react";
import { toast } from "sonner";

import { fagpratQueries, liveSessionQueries } from "@/lib/convex";
import { parseStudentId, placeholderConvexId } from "@/lib/route-params";

import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { StudentAvatar } from "@workspace/ui/components/student-avatar";
import { cn } from "@workspace/ui/lib/utils";
import { StudentGameProvider, useStudentGame } from "@/components/spill/student-game-context";
import { phaseStepNumber } from "@/types/student-phase";
import { StudentStepRenderer } from "@/components/spill/student-step-renderer";
import { StudentTopbar } from "@/components/spill/student-topbar";

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
    liveSessionQueries.getStudent(typedStudentId),
  );
  const { data: session } = useQuery({
    ...liveSessionQueries.getById(student?.sessionId ?? placeholderConvexId<"liveSessions">()),
    enabled: !!student?.sessionId,
  });
  const { data: fagprat } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId ?? placeholderConvexId<"fagprats">()),
    enabled: !!session?.fagpratId,
  });
  const { data: students } = useQuery({
    ...liveSessionQueries.listStudents(
      student?.sessionId ?? placeholderConvexId<"liveSessions">(),
    ),
    enabled: !!student?.sessionId,
  });
  const { data: votes } = useQuery({
    ...liveSessionQueries.getVotes(
      student?.sessionId ?? placeholderConvexId<"liveSessions">(),
      session?.currentStatementIndex ?? 0,
    ),
    enabled: !!student?.sessionId && !!fagprat,
  });

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
      />

      <div
        className={cn(
          "flex w-full flex-col items-center pt-8",
          useWideLayout ? "max-w-3xl" : "max-w-md",
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
      <div className="flex flex-col items-center gap-6 py-8">
        <Professor
          size="sm"
          bounce
          bordered
          imgClassName="size-16 sm:size-20 md:size-24"
        />
        <h1 className="text-xl font-extrabold text-foreground">Hei, {student.name}!</h1>
        <div className="flex items-center text-muted-foreground">
          Venter på at læreren starter
          <WaitingDots />
        </div>
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

import { useQuery, skipToken } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { StudentGameSkeleton } from "@workspace/evalion/components/skeletons/student-game-skeleton";
import { isValidConvexId } from "@workspace/evalion/lib/convex-id";
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { useState } from "react";
import { toast } from "sonner";

import { fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { useStep4Countdown } from "@/lib/use-step4-countdown";

import { Step0Waiting } from "./-spill/step-0-waiting";
import { Step1Vote } from "./-spill/step-1-vote";
import { Step2Discussion } from "./-spill/step-2-discussion";
import { Step3Revote } from "./-spill/step-3-revote";
import { Step4Reveal } from "./-spill/step-4-reveal";
import { Step5Explanation } from "./-spill/step-5-explanation";
import { Step6Rating } from "./-spill/step-6-rating";
import { StudentAvatar } from "./-spill/student-avatar";
import { StudentGameProvider, useStudentGame } from "./-spill/student-game-context";
import { StudentTopbar } from "./-spill/student-topbar";

export const Route = createFileRoute("/spill/$studentId")({
  beforeLoad: ({ params }) => {
    if (!isValidConvexId(params.studentId)) {
      throw notFound();
    }
  },
  component: StudentGamePage,
  errorComponent: RouteErrorBoundary,
});

function StudentGamePage() {
  const { studentId } = Route.useParams();
  const navigate = useNavigate();
  const typedStudentId = studentId as Id<"sessionStudents">;

  const { data: student, isPending: studentLoading } = useQuery(
    liveSessionQueries.getStudent(typedStudentId),
  );
  const { data: session } = useQuery(
    student?.sessionId
      ? liveSessionQueries.getById(student.sessionId)
      : { queryKey: ["session", "none"], queryFn: skipToken },
  );
  const { data: fagprat } = useQuery(
    session?.fagpratId
      ? fagpratQueries.getById(session.fagpratId)
      : { queryKey: ["fagprat", "none"], queryFn: skipToken },
  );
  const { data: students } = useQuery(
    student?.sessionId
      ? liveSessionQueries.listStudents(student.sessionId)
      : { queryKey: ["students", "none"], queryFn: skipToken },
  );
  const { data: votes } = useQuery(
    student?.sessionId && fagprat
      ? liveSessionQueries.getVotes(student.sessionId, session?.currentStatementIndex ?? 0)
      : { queryKey: ["votes", "none"], queryFn: skipToken },
  );

  if (studentLoading) {
    return <StudentGameSkeleton />;
  }

  if (!student) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6">
        <p className="text-center text-lg font-bold text-foreground">Eleven ble ikke funnet</p>
      </div>
    );
  }

  if (!session || !fagprat) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6">
        <StudentAvatar name={student.name} avatarColor={student.avatarColor} />
        <h1 className="text-xl font-extrabold text-foreground">Hei, {student.name}!</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Kobler til økten...
        </div>
      </div>
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
  const { student, session, fagprat, currentStep, removeStudent } = useStudentGame();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleLeave = async () => {
    try {
      await removeStudent();
      onLeave();
    } catch {
      toast.error("Kunne ikke forlate spillet. Prøv igjen.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-8">
      <StudentTopbar
        studentName={student.name}
        fagpratTitle={fagprat.title}
        currentStep={session.status === "active" ? currentStep : undefined}
        stepLabel={session.status === "lobby" ? "Lobby" : undefined}
        onLeave={() => setShowLeaveConfirm(true)}
      />

      <div className="flex w-full max-w-md flex-col items-center pt-8">
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
  const { session, student, currentStep } = useStudentGame();
  const { showCountdown, countdownNumber, countdownDone } = useStep4Countdown(currentStep);

  if (session.status === "lobby") {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <Professor size="lg" bounce bordered />
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
          onClick={onLeave}
          className="mt-2 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-[0_4px_0_var(--color-primary-700,theme(colors.purple.700))] transition-all active:translate-y-0.5"
        >
          Gå til forsiden
        </button>
      </div>
    );
  }

  switch (currentStep) {
    case 0:
      return <Step0Waiting />;
    case 1:
      return <Step1Vote />;
    case 2:
      return <Step2Discussion />;
    case 3:
      return <Step3Revote />;
    case 4:
      return (
        <Step4Reveal
          showCountdown={showCountdown}
          countdownNumber={countdownNumber}
          countdownDone={countdownDone}
        />
      );
    case 5:
      return <Step5Explanation />;
    case 6:
      return <Step6Rating />;
    default:
      return (
        <div className="flex items-center text-muted-foreground">
          Venter
          <WaitingDots />
        </div>
      );
  }
}

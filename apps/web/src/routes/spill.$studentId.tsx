import { useQuery, skipToken } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { isValidConvexId } from "@workspace/ui/lib/convex-id";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { RouteErrorBoundary } from "@workspace/ui/components/route-error-boundary";
import { StudentGameSkeleton } from "@workspace/ui/components/skeletons/student-game-skeleton";
import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { COUNTDOWN_STEP_MS, COUNTDOWN_TOTAL_MS } from "@/lib/timings";

import { StudentAvatar } from "./-spill/student-avatar";
import { StudentTopbar } from "./-spill/student-topbar";
import { Step0Waiting } from "./-spill/step-0-waiting";
import { Step1Vote } from "./-spill/step-1-vote";
import { Step2Discussion } from "./-spill/step-2-discussion";
import { Step3Revote } from "./-spill/step-3-revote";
import { Step4Reveal } from "./-spill/step-4-reveal";
import { Step5Explanation } from "./-spill/step-5-explanation";
import { Step6Rating } from "./-spill/step-6-rating";

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

  // Fetch student record to get sessionId
  const { data: student, isPending: studentLoading } = useQuery(
    liveSessionQueries.getStudent(typedStudentId),
  );

  // Fetch session
  const { data: session } = useQuery(
    student?.sessionId
      ? liveSessionQueries.getById(student.sessionId)
      : { queryKey: ["session", "none"], queryFn: skipToken },
  );

  // Fetch fagprat for statements
  const { data: fagprat } = useQuery(
    session?.fagpratId
      ? fagpratQueries.getById(session.fagpratId)
      : { queryKey: ["fagprat", "none"], queryFn: skipToken },
  );

  // Fetch students in session (for group display in step 2)
  const { data: students } = useQuery(
    student?.sessionId
      ? liveSessionQueries.listStudents(student.sessionId)
      : { queryKey: ["students", "none"], queryFn: skipToken },
  );

  // Fetch votes (for detecting existing vote)
  const statementIndex = session?.currentStatementIndex ?? 0;
  const { data: votes } = useQuery(
    student?.sessionId && fagprat
      ? liveSessionQueries.getVotes(student.sessionId, statementIndex)
      : { queryKey: ["votes", "none"], queryFn: skipToken },
  );

  const castVoteMutation = useMutation(api.liveSessions.castVote);
  const submitRatingMutation = useMutation(api.liveSessions.submitRating);
  const submitBegrunnelseMutation = useMutation(api.liveSessions.submitBegrunnelse);
  const removeStudentMutation = useMutation(api.liveSessions.removeStudent);

  const [ratingSent, setRatingSent] = useState(false);
  const [begrunnelseText, setBegrunnelseText] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);

  const countdownTriggered = useRef(false);
  const prevStep = useRef<number | undefined>(undefined);

  // Reset state when step changes
  useEffect(() => {
    if (session?.currentStep !== prevStep.current) {
      setRatingSent(false);
      prevStep.current = session?.currentStep;
    }
  }, [session?.currentStep]);

  // Persist begrunnelse drafts to localStorage
  const draftKey =
    student?.sessionId && typedStudentId
      ? `begrunnelse:${student.sessionId}:${typedStudentId}:${statementIndex}`
      : null;

  useEffect(() => {
    if (!draftKey) return;
    try {
      const saved = localStorage.getItem(draftKey);
      setBegrunnelseText(saved ?? "");
    } catch {
      setBegrunnelseText("");
    }
  }, [draftKey]);

  useEffect(() => {
    if (!draftKey) return;
    try {
      if (begrunnelseText) {
        localStorage.setItem(draftKey, begrunnelseText);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // localStorage unavailable
    }
  }, [draftKey, begrunnelseText]);

  // Check if student already voted this round
  const currentStep = session?.currentStep ?? -1;
  const round = currentStep === 1 ? 1 : currentStep === 3 ? 2 : 0;
  const existingVote = votes?.find(
    (v) => v.studentId === typedStudentId && v.round === round,
  );
  const hasVoted = !!existingVote;

  // Step 4 countdown
  useEffect(() => {
    if (currentStep !== 4) {
      countdownTriggered.current = false;
      setCountdownDone(false);
      return;
    }
    if (countdownTriggered.current) return;

    countdownTriggered.current = true;
    setShowCountdown(true);
    setCountdownNumber(3);
    setCountdownDone(false);

    const t1 = setTimeout(() => setCountdownNumber(2), COUNTDOWN_STEP_MS);
    const t2 = setTimeout(() => setCountdownNumber(1), COUNTDOWN_STEP_MS * 2);
    const t3 = setTimeout(() => {
      setShowCountdown(false);
      setCountdownDone(true);
    }, COUNTDOWN_TOTAL_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentStep]);

  if (studentLoading) {
    return <StudentGameSkeleton />;
  }

  if (!student) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6">
        <p className="text-center text-lg font-bold text-foreground">
          Eleven ble ikke funnet
        </p>
      </div>
    );
  }

  if (!session) {
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

  const statement = fagprat?.statements[statementIndex];

  // Group members for step 2
  const groupMembers =
    student.groupIndex !== undefined
      ? students?.filter(
          (s) => s.groupIndex === student.groupIndex && s._id !== student._id,
        ) ?? []
      : [];

  const handleLeave = async () => {
    try {
      await removeStudentMutation({ id: typedStudentId });
      navigate({ to: "/" });
    } catch {
      toast.error("Kunne ikke forlate spillet. Prøv igjen.");
    }
  };

  const renderContent = () => {
    // Waiting in lobby
    if (session.status === "lobby") {
      return (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="size-28 overflow-hidden rounded-full border-4 border-primary/20">
            <img
              src="/professoren.png"
              alt="Professoren"
              className="size-full animate-[gentle-bounce_3s_ease-in-out_infinite] object-cover"
            />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Hei, {student.name}!</h1>
          <div className="flex items-center text-muted-foreground">
            Venter på at læreren starter
            <WaitingDots />
          </div>
        </div>
      );
    }

    // Game ended
    if (session.status === "ended") {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <h1 className="text-xl font-extrabold text-foreground">Økten er avsluttet</h1>
          <p className="text-muted-foreground">Takk for at du deltok!</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-2 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-[0_4px_0_var(--color-primary-700,theme(colors.purple.700))] transition-all active:translate-y-0.5"
          >
            Gå til forsiden
          </button>
        </div>
      );
    }

    // Active game — render based on currentStep
    switch (currentStep) {
      case 0:
        return <Step0Waiting statements={fagprat?.statements} />;

      case 1:
        if (!statement) return null;
        return (
          <Step1Vote
            statement={statement}
            hasVoted={hasVoted}
            begrunnelseText={begrunnelseText}
            setBegrunnelseText={setBegrunnelseText}
            onSubmit={async ({ vote, confidence, begrunnelse }) => {
              await castVoteMutation({
                sessionId: session._id,
                studentId: typedStudentId,
                statementIndex,
                round: 1,
                vote,
                confidence,
              });
              if (begrunnelse.trim()) {
                await submitBegrunnelseMutation({
                  sessionId: session._id,
                  studentId: typedStudentId,
                  statementIndex,
                  round: 1,
                  text: begrunnelse.trim(),
                });
                if (draftKey) {
                  try { localStorage.removeItem(draftKey); } catch { /* noop */ }
                }
              }
            }}
          />
        );

      case 2:
        if (!statement) return null;
        return (
          <Step2Discussion
            statement={statement}
            groupMembers={groupMembers}
            transcriptionEnabled={session.transcriptionEnabled}
          />
        );

      case 3:
        if (!statement) return null;
        return (
          <Step3Revote
            statement={statement}
            hasVoted={hasVoted}
            onSubmit={async ({ vote, confidence }) => {
              await castVoteMutation({
                sessionId: session._id,
                studentId: typedStudentId,
                statementIndex,
                round: 2,
                vote,
                confidence,
              });
            }}
          />
        );

      case 4:
        if (!statement) return null;
        return (
          <Step4Reveal
            statement={statement as { text: string; fasit: "sant" | "usant" | "delvis" }}
            showCountdown={showCountdown}
            countdownNumber={countdownNumber}
            countdownDone={countdownDone}
            transcriptionEnabled={session.transcriptionEnabled}
          />
        );

      case 5:
        if (!statement) return null;
        return (
          <Step5Explanation
            statement={statement as { text: string; fasit: "sant" | "usant" | "delvis"; explanation: string }}
          />
        );

      case 6:
        if (!statement) return null;
        return (
          <Step6Rating
            statement={statement as { text: string; fasit: "sant" | "usant" | "delvis" }}
            ratingSent={ratingSent}
            onRate={async (n) => {
              setRatingSent(true);
              try {
                await submitRatingMutation({
                  sessionId: session._id,
                  studentId: typedStudentId,
                  statementIndex,
                  rating: n,
                });
              } catch {
                setRatingSent(false);
                toast.error("Vurderingen ble ikke sendt. Prøv igjen.");
              }
            }}
          />
        );

      default:
        return (
          <div className="flex items-center text-muted-foreground">
            Venter
            <WaitingDots />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-8">
      {/* Topbar */}
      <StudentTopbar
        studentName={student.name}
        fagpratTitle={fagprat?.title}
        currentStep={session.status === "active" ? currentStep : undefined}
        stepLabel={session.status === "lobby" ? "Lobby" : undefined}
      />

      {/* Main content area */}
      <div className="flex w-full max-w-md flex-col items-center pt-8">
        {renderContent()}
      </div>

      {/* Leave confirmation overlay */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold text-foreground">Forlat spill?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Er du sikker på at du vil forlate spillet?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                Avbryt
              </button>
              <button
                onClick={handleLeave}
                className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-destructive/90"
              >
                Ja, forlat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

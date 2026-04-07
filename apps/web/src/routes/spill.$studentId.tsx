import { useQuery, skipToken } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { VOTE_LABELS } from "@workspace/ui/lib/constants";
import { isValidConvexId } from "@workspace/ui/lib/convex-id";
import { cn } from "@workspace/ui/lib/utils";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
import { useMutation } from "convex/react";
import { Loader2, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { Professor } from "@workspace/ui/components/live/professor";
import { RouteErrorBoundary } from "@workspace/ui/components/route-error-boundary";
import { WaitingDots } from "@workspace/ui/components/waiting-dots";

import { StudentGameSkeleton } from "@workspace/ui/components/skeletons/student-game-skeleton";
import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { COUNTDOWN_STEP_MS, COUNTDOWN_TOTAL_MS } from "@/lib/timings";

import { BegrunnelsePanel } from "./-spill/begrunnelse-panel";
import { CountdownOverlay } from "./-spill/countdown-overlay";
import { RatingPanel } from "./-spill/rating-panel";
import { StatementCard } from "./-spill/statement-card";
import { StudentAvatar } from "./-spill/student-avatar";
import { StudentTimer } from "./-spill/student-timer";

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
  const { data: session, isPending: sessionLoading } = useQuery(
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

  const [voteSent, setVoteSent] = useState(false);
  const [ratingSent, setRatingSent] = useState(false);
  const [begrunnelseText, setBegrunnelseText] = useState("");
  const [begrunnelseSent, setBegrunnelseSent] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);

  const countdownTriggered = useRef(false);
  const prevStep = useRef<number | undefined>(undefined);

  // Reset vote/rating sent state when step changes. NOTE: we intentionally
  // do NOT clear `begrunnelseText` here — the draft is keyed by statement
  // and persisted to localStorage below, so it survives step advances.
  useEffect(() => {
    if (session?.currentStep !== prevStep.current) {
      setVoteSent(false);
      setRatingSent(false);
      setBegrunnelseSent(false);
      prevStep.current = session?.currentStep;
    }
  }, [session?.currentStep]);

  // Persist begrunnelse drafts to localStorage, keyed by statement.
  // If the teacher advances the step mid-type, the draft is restored
  // when the student returns to the same statement.
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
    // Reload whenever the key changes (new statement) — we don't depend on
    // begrunnelseText to avoid a feedback loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // localStorage unavailable (private mode, quota) — fall back to
      // in-memory only.
    }
  }, [draftKey, begrunnelseText]);

  // Check if student already voted this round
  const currentStep = session?.currentStep ?? -1;
  const round = currentStep === 1 ? 1 : currentStep === 3 ? 2 : 0;
  const existingVote = votes?.find(
    (v) => v.studentId === typedStudentId && v.round === round,
  );
  const hasVoted = !!existingVote || voteSent;

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
          <Loader2 className="size-4 animate-spin" />
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

  const handleVote = async (value: "sant" | "usant" | "delvis") => {
    if (hasVoted) return;
    setVoteSent(true);
    try {
      await castVoteMutation({
        sessionId: session._id,
        studentId: typedStudentId,
        statementIndex,
        round,
        vote: value,
      });
    } catch {
      setVoteSent(false);
      toast.error("Stemmen ble ikke sendt. Prøv igjen.");
    }
  };

  const handleLeave = async () => {
    try {
      await removeStudentMutation({ id: typedStudentId });
      navigate({ to: "/" });
    } catch {
      toast.error("Kunne ikke forlate spillet. Prøv igjen.");
    }
  };

  const handleSubmitBegrunnelse = async (text: string) => {
    try {
      await submitBegrunnelseMutation({
        sessionId: session._id,
        studentId: typedStudentId,
        statementIndex,
        round: 1,
        text,
      });
    } catch {
      toast.error("Begrunnelsen ble ikke sendt. Prøv igjen.");
    }
  };

  const handleRate = async (n: number) => {
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
  };

  // Statement card reusable for student
  const studentStatementCard = statement && <StatementCard statement={statement} />;

  // Render based on session state
  const renderContent = () => {
    // Waiting in lobby
    if (session.status === "lobby") {
      return (
        <div className="flex flex-col items-center gap-4">
          <StudentAvatar name={student.name} avatarColor={student.avatarColor} />
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
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-extrabold text-foreground">Økten er avsluttet</h1>
          <p className="text-muted-foreground">Takk for at du deltok!</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-px"
          >
            Gå til forsiden
          </button>
        </div>
      );
    }

    // Active game — render based on currentStep
    switch (currentStep) {
      // Step 0: Teacher selecting a statement
      case 0:
        return (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-bold text-foreground">Læreren velger en påstand</h2>
            <div className="flex items-center text-muted-foreground">
              Venter
              <WaitingDots />
            </div>
          </div>
        );

      // Step 1: First vote
      case 1:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              1. stemmerunde
            </h2>
            <StudentTimer
              timerDuration={session.timerDuration}
              timerStartedAt={session.timerStartedAt}
              timerPausedAt={session.timerPausedAt}
              timerRemainingAtPause={session.timerRemainingAtPause}
            />
            {studentStatementCard}
            <Professor size="sm" text="Stem uten å avsløre hva du tenker..." />
            {hasVoted ? (
              <div className="rounded-xl bg-primary/10 px-6 py-3">
                <p className="text-sm font-bold text-primary">
                  Sendt! {existingVote ? VOTE_LABELS[existingVote.vote] : ""}
                </p>
              </div>
            ) : (
              <VoteButtons selected={null} onVote={handleVote} />
            )}
          </div>
        );

      // Step 2: Discussion
      case 2:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Diskusjon
            </h2>
            <StudentTimer
              timerDuration={session.timerDuration}
              timerStartedAt={session.timerStartedAt}
              timerPausedAt={session.timerPausedAt}
              timerRemainingAtPause={session.timerRemainingAtPause}
            />
            {studentStatementCard}
            <Professor
              size="sm"
              text="Diskuter med læringspartneren din. Hva tenker dere?"
            />
            {groupMembers.length > 0 && (
              <div className="w-full max-w-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Din gruppe
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupMembers.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-xs"
                    >
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full text-xs font-bold text-white",
                          m.avatarColor,
                        )}
                      >
                        {m.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="text-sm font-medium text-foreground">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Begrunnelse input */}
            <BegrunnelsePanel
              begrunnelseText={begrunnelseText}
              setBegrunnelseText={setBegrunnelseText}
              begrunnelseSent={begrunnelseSent}
              setBegrunnelseSent={setBegrunnelseSent}
              onSubmit={handleSubmitBegrunnelse}
              draftKey={draftKey}
            />
          </div>
        );

      // Step 3: Second vote
      case 3:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              2. stemmerunde
            </h2>
            <StudentTimer
              timerDuration={session.timerDuration}
              timerStartedAt={session.timerStartedAt}
              timerPausedAt={session.timerPausedAt}
              timerRemainingAtPause={session.timerRemainingAtPause}
            />
            {studentStatementCard}
            <Professor size="sm" text="Har du endret mening? Stem på nytt!" />
            {hasVoted ? (
              <div className="rounded-xl bg-primary/10 px-6 py-3">
                <p className="text-sm font-bold text-primary">
                  Sendt! {existingVote ? VOTE_LABELS[existingVote.vote] : ""}
                </p>
              </div>
            ) : (
              <VoteButtons selected={null} onVote={handleVote} />
            )}
          </div>
        );

      // Step 4: Answer reveal
      case 4: {
        return (
          <>
            <CountdownOverlay visible={showCountdown} number={countdownNumber} />
            <div className="flex w-full flex-col items-center gap-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Fasit
              </h2>
              {countdownDone && statement && (
                <FasitBadge fasit={statement.fasit} animated />
              )}
              {studentStatementCard}
            </div>
          </>
        );
      }

      // Step 5: Explanation
      case 5:
        return (
          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Forklaring
            </h2>
            {statement && <FasitBadge fasit={statement.fasit} />}
            <div className="w-full max-w-md max-h-[392px] overflow-y-auto rounded-2xl border-[1.5px] border-blue-200">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5">
                <p className="text-center text-base font-bold text-foreground">
                  {statement?.text}
                </p>
              </div>
              <div className="bg-white p-5">
                <div className="flex gap-3">
                  <Professor size="xs" className="shrink-0" />
                  <div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Forklaring
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {statement?.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // Step 6: Self evaluation
      case 6:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Egenvurdering
            </h2>
            {statement && <FasitBadge fasit={statement.fasit} />}
            {studentStatementCard}
            <Professor
              size="sm"
              text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
            />
            <RatingPanel ratingSent={ratingSent} onRate={handleRate} />
          </div>
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
      {/* Student header */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          <StudentAvatar name={student.name} avatarColor={student.avatarColor} size="sm" />
          <span className="text-sm font-bold text-foreground">{student.name}</span>
        </div>
        <button
          onClick={() => setShowLeaveConfirm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-3.5" />
          Forlat spill
        </button>
      </div>

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

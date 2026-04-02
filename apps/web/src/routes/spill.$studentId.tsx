import { useQuery, skipToken } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { Professor } from "@workspace/ui/components/live/professor";

import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/spill/$studentId")({
  component: StudentGamePage,
});

const VOTE_LABELS: Record<string, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
];

function WaitingDots() {
  return (
    <span className="ml-1 inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-primary/40"
          style={{
            animation: "dotPulse 1.4s ease-in-out infinite both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </span>
  );
}

function StudentGamePage() {
  const { studentId } = Route.useParams();
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

  const [voteSent, setVoteSent] = useState(false);
  const [ratingSent, setRatingSent] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);

  const countdownTriggered = useRef(false);
  const prevStep = useRef<number | undefined>(undefined);

  // Reset vote/rating sent state when step changes
  useEffect(() => {
    if (session?.currentStep !== prevStep.current) {
      setVoteSent(false);
      setRatingSent(false);
      prevStep.current = session?.currentStep;
    }
  }, [session?.currentStep]);

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

    const t1 = setTimeout(() => setCountdownNumber(2), 600);
    const t2 = setTimeout(() => setCountdownNumber(1), 1200);
    const t3 = setTimeout(() => {
      setShowCountdown(false);
      setCountdownDone(true);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentStep]);

  if (studentLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
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
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-full text-2xl font-bold text-white",
            student.avatarColor,
          )}
        >
          {student.name[0]}
        </div>
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
    }
  };

  // Statement card reusable for student
  const studentStatementCard = statement && (
    <div className="mx-auto w-full max-w-md rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-5">
      <p className="text-center text-base font-bold text-foreground">{statement.text}</p>
    </div>
  );

  // Render based on session state
  const renderContent = () => {
    // Waiting in lobby
    if (session.status === "lobby") {
      return (
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-full text-2xl font-bold text-white",
              student.avatarColor,
            )}
          >
            {student.name[0]}
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
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-extrabold text-foreground">Økten er avsluttet</h1>
          <p className="text-muted-foreground">Takk for at du deltok!</p>
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
                        {m.name[0]}
                      </div>
                      <span className="text-sm font-medium text-foreground">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // Step 3: Second vote
      case 3:
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              2. stemmerunde
            </h2>
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
            {showCountdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
                <span
                  key={countdownNumber}
                  className="text-[160px] font-extrabold text-white animate-[countdown-pop_0.8s_ease_both]"
                >
                  {countdownNumber}
                </span>
              </div>
            )}
            <div className="flex w-full flex-col items-center gap-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Fasit
              </h2>
              {countdownDone && statement && (
                <FasitBadge answer={statement.fasit} animated />
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
            {statement && <FasitBadge answer={statement.fasit} />}
            <div className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-5">
                <p className="text-center text-base font-bold text-foreground">
                  {statement?.text}
                </p>
              </div>
              <div className="bg-white p-5">
                <div className="flex gap-3">
                  <Professor size="sm" className="shrink-0" />
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
            {statement && <FasitBadge answer={statement.fasit} />}
            {studentStatementCard}
            <Professor
              size="sm"
              text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
            />
            {ratingSent ? (
              <div className="rounded-xl bg-primary/10 px-6 py-3">
                <p className="text-sm font-bold text-primary">Takk!</p>
              </div>
            ) : (
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={async () => {
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
                      }
                    }}
                    className={cn(
                      "rounded-xl px-5 py-3 text-lg font-bold text-white transition-all active:scale-95",
                      RATING_COLORS[n - 1],
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
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
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-sm font-bold text-white",
              student.avatarColor,
            )}
          >
            {student.name[0]}
          </div>
          <span className="text-sm font-bold text-foreground">{student.name}</span>
        </div>
        <img src="/logo.png" alt="Evalion" className="h-6 object-contain" />
      </div>

      {/* Main content area */}
      <div className="flex w-full max-w-md flex-col items-center pt-8">
        {renderContent()}
      </div>
    </div>
  );
}

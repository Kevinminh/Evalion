import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { useMutation } from "convex/react";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DistributionChart } from "@workspace/ui/components/live/distribution-chart";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { StepNav } from "@workspace/ui/components/live/step-nav";
import { TeacherPanel } from "@workspace/ui/components/live/teacher-panel";
import { TimerCard } from "@workspace/ui/components/live/timer-card";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
import { fagpratQueries, liveSessionQueries, api } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/liveokt/$id/steg/$step")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: (search.sessionId as string) ?? "",
  }),
  component: LiveStepPage,
});

const VOTE_DOT_COLORS: Record<string, string> = {
  sant: "bg-sant",
  usant: "bg-usant",
  delvis: "bg-delvis",
};

const VOTE_LABELS: Record<string, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

const STATEMENT_COLORS = [
  "bg-yellow-100 border-yellow-300",
  "bg-blue-100 border-blue-300",
  "bg-orange-100 border-orange-300",
  "bg-purple-100 border-purple-300",
  "bg-red-100 border-red-300",
];

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
];

function LiveStepPage() {
  const { id, step: stepParam } = Route.useParams();
  const { sessionId } = Route.useSearch();
  const navigate = useNavigate();
  const step = Number(stepParam);
  const { data: fagprat, isPending } = useQuery(fagpratQueries.getById(id as FagPratId));
  const { data: session } = useQuery(liveSessionQueries.getById(sessionId as Id<"liveSessions">));
  const { data: students } = useQuery(
    liveSessionQueries.listStudents(sessionId as Id<"liveSessions">),
  );

  const updateStepMutation = useMutation(api.liveSessions.updateStep);

  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  const [vote, setVote] = useState<"sant" | "usant" | "delvis" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);
  const [recording, setRecording] = useState(false);

  const countdownTriggered = useRef(false);

  // Use session's current statement index if available
  const selectedIdx = selectedStatement ?? session?.currentStatementIndex ?? 0;
  const statement = fagprat?.statements[selectedIdx];

  // Get votes for current statement from Convex
  const { data: votes } = useQuery(
    sessionId && fagprat
      ? liveSessionQueries.getVotes(sessionId as Id<"liveSessions">, selectedIdx)
      : { queryKey: ["noop"], queryFn: () => [] },
  );

  const goToStep = async (n: number) => {
    if (sessionId) {
      await updateStepMutation({
        id: sessionId as Id<"liveSessions">,
        step: n,
        ...(n === 0 ? {} : { statementIndex: selectedIdx }),
      });
    }
    navigate({
      to: "/liveokt/$id/steg/$step",
      params: { id, step: String(n) },
      search: { sessionId },
    });
  };

  // Step 4 countdown effect
  useEffect(() => {
    if (step === 4 && !countdownTriggered.current) {
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
    }
    if (step !== 4) {
      countdownTriggered.current = false;
      setCountdownDone(false);
    }
  }, [step]);

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (!fagprat) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  const studentList = students ?? [];
  const voteList = votes ?? [];

  // Compute vote distribution from real data
  const santCount = voteList.filter((v) => v.vote === "sant").length;
  const usantCount = voteList.filter((v) => v.vote === "usant").length;
  const delvisCount = voteList.filter((v) => v.vote === "delvis").length;
  const totalVotes = voteList.length;

  const voteBars = [
    { label: "Sant", value: santCount, color: "bg-sant" },
    { label: "Usant", value: usantCount, color: "bg-usant" },
    { label: "Delvis", value: delvisCount, color: "bg-delvis" },
  ];

  // Statement card used in steps 1, 3, 4, 6
  const statementCard = (
    <div className="mx-auto max-w-2xl rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-6">
      <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
    </div>
  );

  // Teacher panel: student vote list
  const studentVoteList = (
    <div className="space-y-2">
      {studentList.map((s) => {
        const studentVote = voteList.find((v) => v.studentId === s._id);
        return (
          <div key={s._id} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                studentVote ? VOTE_DOT_COLORS[studentVote.vote] : "bg-muted",
              )}
            />
            <span className="font-medium text-foreground">{s.name}</span>
            <span className="text-muted-foreground">
              {studentVote ? VOTE_LABELS[studentVote.vote] : "Venter..."}
            </span>
          </div>
        );
      })}
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      // Step 0 -- Statement Selection
      case 0: {
        const isOdd = fagprat.statements.length % 2 !== 0;
        return (
          <div className="flex flex-col items-center">
            <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground">
              Velg en p&aring;stand
            </h2>
            <div className="grid max-w-3xl grid-cols-2 gap-6">
              {fagprat.statements.map((s, i) => {
                const isSelected = selectedStatement === i;
                const hasSomeSelected = selectedStatement !== null;
                const isLast = i === fagprat.statements.length - 1;
                const colorClass = STATEMENT_COLORS[i % STATEMENT_COLORS.length];
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedStatement(i);
                      setTimeout(() => goToStep(1), 600);
                    }}
                    className={cn(
                      "rounded-2xl border-2 p-6 text-left text-sm font-semibold transition-all duration-300",
                      colorClass,
                      isSelected && "scale-105 ring-2 ring-primary",
                      hasSomeSelected && !isSelected && "opacity-40",
                      isOdd && isLast && "col-span-2 mx-auto max-w-[calc(50%-12px)]",
                    )}
                  >
                    {s.text}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      // Step 1 -- First Vote
      case 1:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <VoteButtons selected={vote} onVote={setVote} />
          </div>
        );

      // Step 2 -- Group Discussion
      case 2:
        return (
          <div className="flex flex-col items-center gap-6 pt-8">
            {statementCard}
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm italic text-foreground/80">
                Snakk i gruppene. Hva tenker dere?
              </p>
            </div>
          </div>
        );

      // Step 3 -- Second Vote
      case 3:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <VoteButtons selected={vote} onVote={setVote} />
          </div>
        );

      // Step 4 -- Answer Reveal
      case 4: {
        const fasitLabel = statement ? (VOTE_LABELS[statement.fasit] ?? statement.fasit) : "";
        const fasitColor =
          statement?.fasit === "sant"
            ? "bg-sant"
            : statement?.fasit === "usant"
              ? "bg-usant"
              : "bg-delvis";

        return (
          <>
            {showCountdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
                <span
                  key={countdownNumber}
                  className="animate-ping text-8xl font-extrabold text-white"
                  style={{ animationDuration: "500ms", animationIterationCount: 1 }}
                >
                  {countdownNumber}
                </span>
              </div>
            )}
            <div className="flex flex-col items-center gap-6 pt-8">
              {countdownDone && (
                <span
                  className={cn(
                    "animate-bounce rounded-full px-6 py-2 text-lg font-extrabold text-white",
                    fasitColor,
                  )}
                >
                  {fasitLabel}
                </span>
              )}
              {statementCard}
            </div>
          </>
        );
      }

      // Step 5 -- Explanation
      case 5:
        return (
          <div className="mx-auto max-w-2xl pt-8">
            <div className="overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-6">
                <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
              </div>
              <div className="bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-[96px] shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-3xl font-extrabold text-primary">P</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Forklaring
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {statement?.explanation}
                </p>
              </div>
            </div>
          </div>
        );

      // Step 6 -- Self Evaluation
      case 6:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm italic text-foreground/80">
                Vurder fra 1 til 5 hvor godt du forst&aring;r p&aring;standen n&aring;.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((n) => {
                const isSelected = rating === n;
                const hasRating = rating !== null;
                return (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={cn(
                      "rounded-xl px-6 py-4 text-lg font-bold text-white transition-all",
                      RATING_COLORS[n - 1],
                      isSelected && "scale-110 shadow-[0_0_20px_rgba(0,0,0,0.25)]",
                      hasRating && !isSelected && "opacity-40",
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render teacher panel content
  const renderTeacherContent = () => {
    switch (step) {
      case 0:
        return <p className="text-center text-sm text-muted-foreground">Venter p&aring; valg...</p>;

      case 1:
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Transkript
            </div>
            <div className="space-y-3">
              <p className="text-xs italic text-foreground/70">
                Transkribering er ikke tilgjengelig ennå.
              </p>
            </div>
          </div>
        );

      case 3: {
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );
      }

      case 4: {
        const correctCount = voteList.filter((v) => statement && v.vote === statement.fasit).length;
        return (
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground">
              {correctCount} av {totalVotes} svarte riktig
            </p>
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );
      }

      case 5:
        return null;

      case 6: {
        // Self-eval distribution — placeholder until real data exists
        const mockDistribution = [2, 3, 8, 6, 5];
        const mockTotal = mockDistribution.reduce((a, b) => a + b, 0);
        const ratingBars = mockDistribution.map((value, i) => ({
          label: String(i + 1),
          value,
          color: RATING_COLORS[i],
        }));
        return (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Gjennomsnitt
              </div>
              <p className="text-3xl font-extrabold text-foreground">3.4</p>
            </div>
            <DistributionChart bars={ratingBars} total={mockTotal} />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar title={fagprat.title} onExit={() => navigate({ to: "/min-samling" })}>
        {(step === 2 || step === 4) && (
          <button
            onClick={() => setRecording(!recording)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
              recording ? "bg-foreground text-white" : "bg-muted text-muted-foreground",
            )}
          >
            {recording && <span className="size-2 rounded-full bg-red-500" />}
            <Mic className="size-4" />
            Opptak
          </button>
        )}
      </SessionTopBar>

      <div className="flex pt-16 pb-14">
        <main className="flex-1 px-8 py-8">{renderStepContent()}</main>

        <TeacherPanel defaultOpen={step !== 5}>{renderTeacherContent()}</TeacherPanel>
      </div>

      <StepNav currentStep={step} onStepClick={goToStep} />
    </div>
  );
}

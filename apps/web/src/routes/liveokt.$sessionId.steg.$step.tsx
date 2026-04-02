import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { DistributionChart } from "@workspace/ui/components/live/distribution-chart";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { StepNav } from "@workspace/ui/components/live/step-nav";
import { TeacherPanel } from "@workspace/ui/components/live/teacher-panel";
import { TimerCard } from "@workspace/ui/components/live/timer-card";
import { VoteButtons } from "@workspace/ui/components/live/vote-buttons";
import { useMutation } from "convex/react";
import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { Professor } from "@workspace/ui/components/live/professor";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/liveokt/$sessionId/steg/$step")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
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
  { bg: "#FFFDE7", border: "#FFE082" },
  { bg: "#E3F1FC", border: "#B8DAF0" },
  { bg: "#FFF3E0", border: "#FFCC80" },
  { bg: "#F3E5F5", border: "#CE93D8" },
  { bg: "#FFEBEE", border: "#EF9A9A" },
];

const RATING_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
];

function LiveStepPage() {
  const { sessionId, step: stepParam } = Route.useParams();
  const navigate = useNavigate();
  const step = Number(stepParam);
  const typedSessionId = sessionId as Id<"liveSessions">;

  const { data: session } = useQuery(liveSessionQueries.getById(typedSessionId));
  const { data: fagprat, isPending } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId!),
    enabled: !!session?.fagpratId,
  });
  const { data: students } = useQuery(liveSessionQueries.listStudents(typedSessionId));

  const updateStepMutation = useMutation(api.liveSessions.updateStep);

  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  const [vote, setVote] = useState<"sant" | "usant" | "delvis" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const countdownTriggered = useRef(false);

  // Use session's current statement index if available
  const selectedIdx = selectedStatement ?? session?.currentStatementIndex ?? 0;
  const statement = fagprat?.statements[selectedIdx];

  // Get votes for current statement
  const { data: votes } = useQuery({
    ...liveSessionQueries.getVotes(typedSessionId, selectedIdx),
    enabled: !!fagprat,
  });

  const goToStep = async (n: number) => {
    await updateStepMutation({
      id: typedSessionId,
      step: n,
      ...(n === 0 ? {} : { statementIndex: selectedIdx }),
    });
    navigate({
      to: "/liveokt/$sessionId/steg/$step",
      params: { sessionId, step: String(n) },
    });
  };

  // Step 4 countdown effect
  useEffect(() => {
    if (step !== 4) {
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
  }, [step]);

  // Reset recording when leaving recording-enabled steps
  useEffect(() => {
    if (step !== 2 && step !== 4) {
      setRecording(false);
    }
  }, [step]);

  // Recording timer
  useEffect(() => {
    if (!recording) {
      setRecordingTime(0);
      return;
    }
    const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [recording]);

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

  const santCount = voteList.filter((v) => v.vote === "sant").length;
  const usantCount = voteList.filter((v) => v.vote === "usant").length;
  const delvisCount = voteList.filter((v) => v.vote === "delvis").length;
  const totalVotes = voteList.length;

  const voteBars = [
    { label: "Sant", value: santCount, color: "bg-sant" },
    { label: "Usant", value: usantCount, color: "bg-usant" },
    { label: "Delvis", value: delvisCount, color: "bg-delvis" },
  ];

  const statementCard = (
    <div className="mx-auto max-w-2xl rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-6">
      <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
    </div>
  );

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

  const renderStepContent = () => {
    switch (step) {
      case 0: {
        const isOdd = fagprat.statements.length % 2 !== 0;
        return (
          <div className="flex items-start gap-10">
            <Professor size="lg" label="Velg en påstand" className="flex-col pt-8" />
            <div className="grid flex-1 grid-cols-2 gap-6">
              {fagprat.statements.map((s, i) => {
                const isSelected = selectedStatement === i;
                const hasSomeSelected = selectedStatement !== null;
                const isLast = i === fagprat.statements.length - 1;
                const color = STATEMENT_COLORS[i % STATEMENT_COLORS.length];
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedStatement(i);
                      setTimeout(() => goToStep(1), 600);
                    }}
                    style={{
                      backgroundColor: color.bg,
                      borderColor: color.border,
                    }}
                    className={cn(
                      "rounded-2xl border-2 p-6 text-left text-base font-semibold transition-all duration-300 hover:scale-[1.03]",
                      isSelected && "scale-105 ring-2 ring-primary",
                      hasSomeSelected && !isSelected && "scale-[0.97] opacity-40",
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

      case 1:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <Professor size="sm" text="Stem uten å avsløre hva du tenker..." />
            <VoteButtons selected={vote} onVote={setVote} />
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center gap-6 pt-8">
            {statementCard}
            <Professor
              size="sm"
              text="Diskuter med læringspartneren din. Forklar til hverandre hva dere tenker."
            />
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statementCard}
            <Professor size="sm" text="Har du endret mening etter diskusjonen? Stem på nytt!" />
            <VoteButtons selected={vote} onVote={setVote} />
          </div>
        );

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
            <div className="flex flex-col items-center gap-6 pt-8">
              {countdownDone && statement && (
                <FasitBadge answer={statement.fasit} animated />
              )}
              {statementCard}
            </div>
          </>
        );
      }

      case 5:
        return (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 pt-8">
            {statement && <FasitBadge answer={statement.fasit} />}
            <div className="w-full overflow-hidden rounded-2xl border-[1.5px] border-blue-200">
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-6">
                <p className="text-center text-lg font-bold text-foreground">
                  {statement?.text}
                </p>
              </div>
              <div className="bg-white p-6">
                <div className="flex gap-4">
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

      case 6:
        return (
          <div className="flex flex-col items-center gap-8 pt-8">
            {statement && <FasitBadge answer={statement.fasit} />}
            {statementCard}
            <Professor
              size="sm"
              text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå."
            />
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

  const renderTeacherContent = () => {
    switch (step) {
      case 0:
        return <p className="text-center text-sm text-muted-foreground">Venter på valg...</p>;

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

      case 3:
        return (
          <div className="space-y-4">
            <TimerCard />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );

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
      <SessionTopBar title={fagprat.title}>
        {(step === 2 || step === 4) && (
          <button
            onClick={() => setRecording(!recording)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
              recording ? "bg-foreground text-white" : "bg-muted text-muted-foreground",
            )}
          >
            {recording && (
              <span className="size-2 rounded-full bg-red-500 animate-[blink_1s_ease-in-out_infinite]" />
            )}
            <Mic className="size-4" />
            {recording
              ? `${String(Math.floor(recordingTime / 60)).padStart(2, "0")}:${String(recordingTime % 60).padStart(2, "0")}`
              : "Opptak"}
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

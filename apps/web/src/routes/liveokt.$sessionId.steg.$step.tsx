import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { isValidConvexId } from "@workspace/evalion/lib/convex-id";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { Professor } from "@workspace/evalion/components/live/professor";
import { RecordButton } from "@workspace/evalion/components/live/record-button";
import { SessionTopBar } from "@workspace/evalion/components/live/session-top-bar";
import { StepNav } from "@workspace/evalion/components/live/step-nav";
import { TeacherPanel } from "@workspace/evalion/components/live/teacher-panel";
import {
  STATEMENT_COLORS_HEX,
  VOTE_DOT_COLORS,
  VOTE_LABELS,
} from "@workspace/evalion/lib/constants";
import { cn } from "@workspace/ui/lib/utils";
// VoteButtons removed — teacher view doesn't vote
import { useMutation } from "convex/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { LiveStepSkeleton } from "@workspace/evalion/components/skeletons/live-step-skeleton";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";
import { COUNTDOWN_STEP_MS } from "@/lib/timings";
import { useStep4Countdown } from "@/lib/use-step4-countdown";
import { useTimerControls } from "@/lib/use-timer-controls";
import { buildVoteBars } from "@/lib/vote-bars";
import { Step1Main, Step1Panel } from "./-liveokt/step-1-vote-in-progress";
import { Step2Main, Step2Panel } from "./-liveokt/step-2-group-discussion";
import { Step3Main, Step3Panel } from "./-liveokt/step-3-revote";
import { Step4Main, Step4Panel } from "./-liveokt/step-4-reveal";
import { Step5Main, Step5Panel } from "./-liveokt/step-5-distribution";
import { Step6Main, Step6Panel } from "./-liveokt/step-6-rating-summary";

export const Route = createFileRoute("/liveokt/$sessionId/steg/$step")({
  beforeLoad: ({ params }) => {
    if (!isValidConvexId(params.sessionId)) {
      throw notFound();
    }
    if (!/^\d+$/.test(params.step)) {
      throw notFound();
    }
  },
  component: LiveStepPage,
  errorComponent: RouteErrorBoundary,
});

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
  const endSessionMutation = useMutation(api.liveSessions.end);
  const highlightBegrunnelseMutation = useMutation(api.liveSessions.highlightBegrunnelse);

  const timer = useTimerControls(typedSessionId, session);

  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  // vote and rating state not needed — teacher doesn't interact with student UI
  const [panelTab, setPanelTab] = useState("default");
  const [begrunnelseIdx, setBegrunnelseIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set());

  const { showCountdown, countdownNumber, countdownDone } = useStep4Countdown(step);

  const selectedIdx = selectedStatement ?? session?.currentStatementIndex ?? 0;
  const statement = fagprat?.statements[selectedIdx];

  const { data: votes } = useQuery({
    ...liveSessionQueries.getVotes(typedSessionId, selectedIdx),
    enabled: !!fagprat,
  });

  const { data: analytics } = useQuery({
    ...liveSessionQueries.getVoteAnalytics(typedSessionId, selectedIdx),
    enabled: !!fagprat && step >= 4,
  });

  const { data: begrunnelser } = useQuery({
    ...liveSessionQueries.getBegrunnelser(typedSessionId, selectedIdx),
    enabled: !!fagprat && [2, 5].includes(step),
  });

  // Recording timer
  useEffect(() => {
    if (!recording) {
      setRecordElapsed(0);
      return;
    }
    const interval = setInterval(() => setRecordElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [recording]);

  const dashboardUrl = DASHBOARD_URL;

  const handleEnd = async () => {
    try {
      await endSessionMutation({ id: typedSessionId });
      window.location.href = dashboardUrl;
    } catch {
      toast.error("Kunne ikke avslutte økten. Prøv igjen.");
    }
  };

  const goToStep = async (n: number) => {
    // Reset state when returning to statement selection for a new round
    if (n === 0) {
      setCompletedSteps([]);
      setSelectedStatement(null);
    }
    // Mark current step as completed when advancing
    if (step > 0 && step < n) {
      setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
    }
    try {
      await updateStepMutation({
        id: typedSessionId,
        step: n,
        ...(n === 0 ? {} : { statementIndex: selectedIdx }),
      });
      await navigate({
        to: "/liveokt/$sessionId/steg/$step",
        params: { sessionId, step: String(n) },
      });
    } catch {
      toast.error("Kunne ikke bytte steg. Prøv igjen.");
    }
  };

  // Reset panel tab and begrunnelse index when step or statement changes
  useEffect(() => {
    setPanelTab("default");
    setBegrunnelseIdx(0);
  }, [step, selectedIdx]);

  if (isPending) {
    return <LiveStepSkeleton />;
  }

  if (!fagprat) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  if (step > 0 && !fagprat.statements[selectedIdx]) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Påstanden ble ikke funnet.</p>
      </div>
    );
  }

  const studentList = students ?? [];
  const voteList = votes ?? [];

  // Filter votes by round for current view
  const { r2Votes, activeRoundVotes, voteBars, totalVotes } = useMemo(() => {
    const r1: typeof voteList = [];
    const r2: typeof voteList = [];
    for (const v of voteList) {
      if (v.round === 1) r1.push(v);
      else if (v.round === 2) r2.push(v);
    }
    const active = step <= 2 ? r1 : r2;
    return {
      r2Votes: r2,
      activeRoundVotes: active,
      totalVotes: active.length,
      voteBars: buildVoteBars(active),
    };
  }, [voteList, step]);

  // Analytics — server-first; fields default to 0/empty when no analytics yet
  const r2CorrectCount = analytics?.correctR2 ?? 0;
  const r2Total = analytics?.totalR2 ?? 0;
  const changedToCorrect = analytics?.wrongToRight ?? 0;
  const changedToIncorrect = analytics?.rightToWrong ?? 0;
  const ratingDistribution =
    analytics?.ratingDistribution ?? [1, 2, 3, 4, 5].map((score) => ({ score, count: 0 }));
  const avgRating = analytics && analytics.avgRating > 0 ? analytics.avgRating : undefined;

  const statementCard = statement ? <StatementCard statement={statement} size="lg" /> : null;

  const studentVoteList = (
    <div className="space-y-2">
      {studentList.map((s) => {
        const studentVote = activeRoundVotes.find((v) => v.studentId === s._id);
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

  const recordButtonState: "disabled" | "ready" | "recording" = recording
    ? "recording"
    : [2, 4].includes(step)
      ? "ready"
      : "disabled";

  const nextStepButton = (
    <button
      onClick={() => goToStep(step + 1)}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)] transition-all hover:-translate-y-px"
    >
      Neste steg
      <ArrowRight className="size-4" />
    </button>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0: {
        const isOdd = fagprat.statements.length % 2 !== 0;
        return (
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-10">
            <Professor size="2xl" label="Velg en påstand" className="flex-col pt-4 lg:pt-8" />
            <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {fagprat.statements.map((s, i) => {
                const isSelected = selectedStatement === i;
                const hasSomeSelected = selectedStatement !== null;
                const isLast = i === fagprat.statements.length - 1;
                const isUsed = usedStatements.has(i);
                const color = STATEMENT_COLORS_HEX[i % STATEMENT_COLORS_HEX.length];
                return (
                  <button
                    key={i}
                    disabled={isUsed}
                    onClick={() => {
                      if (isUsed) return;
                      setSelectedStatement(i);
                      setTimeout(() => goToStep(1), COUNTDOWN_STEP_MS);
                    }}
                    style={{
                      backgroundColor: color.bg,
                      borderColor: color.border,
                    }}
                    className={cn(
                      "relative rounded-2xl border-2 p-6 text-left text-base font-semibold transition-all duration-300 hover:scale-[1.03]",
                      isSelected && "scale-105 ring-2 ring-primary",
                      hasSomeSelected && !isSelected && "scale-[0.97] opacity-40",
                      isUsed && "cursor-default opacity-40 hover:scale-100",
                      isOdd && isLast && "col-span-2 mx-auto max-w-[calc(50%-12px)]",
                    )}
                  >
                    {s.text}
                    {isUsed && (
                      <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary/80 text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 1:
        return (
          <Step1Main
            statementCard={statementCard}
            studentList={studentList}
            activeRoundVotes={activeRoundVotes}
            onBack={() => goToStep(0)}
          />
        );

      case 2:
        return <Step2Main statementCard={statementCard} />;

      case 3:
        return (
          <Step3Main
            statementCard={statementCard}
            studentList={studentList}
            activeRoundVotes={activeRoundVotes}
            onBack={() => goToStep(0)}
          />
        );

      case 4:
        return (
          <Step4Main
            statementCard={statementCard}
            statement={statement}
            showCountdown={showCountdown}
            countdownNumber={countdownNumber}
            countdownDone={countdownDone}
          />
        );

      case 5:
        return <Step5Main statement={statement} />;

      case 6:
        return <Step6Main statementCard={statementCard} statement={statement} />;

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
          <Step1Panel
            studentVoteList={studentVoteList}
            voteBars={voteBars}
            totalVotes={totalVotes}
            timer={timer}
          />
        );

      case 2:
        return (
          <Step2Panel
            panelTab={panelTab}
            onPanelTabChange={setPanelTab}
            begrunnelser={begrunnelser}
            begrunnelseIdx={begrunnelseIdx}
            setBegrunnelseIdx={setBegrunnelseIdx}
            studentList={studentList}
            onHighlight={(b) =>
              highlightBegrunnelseMutation({ id: b._id, highlighted: !b.highlighted })
            }
            studentVoteList={studentVoteList}
            voteBars={voteBars}
            totalVotes={totalVotes}
            timer={timer}
          />
        );

      case 3:
        return (
          <Step3Panel
            studentVoteList={studentVoteList}
            voteBars={voteBars}
            totalVotes={totalVotes}
            timer={timer}
          />
        );

      case 4:
        return (
          <Step4Panel
            panelTab={panelTab}
            onPanelTabChange={setPanelTab}
            r2CorrectCount={r2CorrectCount}
            r2Total={r2Total}
            changedToCorrect={changedToCorrect}
            changedToIncorrect={changedToIncorrect}
            r2Votes={r2Votes}
          />
        );

      case 5:
        return (
          <Step5Panel
            statement={statement}
            r2Votes={r2Votes}
            r2Total={r2Total}
            begrunnelser={begrunnelser}
            studentList={studentList}
          />
        );

      case 6:
        return <Step6Panel ratingDistribution={ratingDistribution} avgRating={avgRating} />;

      default:
        return null;
    }
  };

  const renderPanelFooter = () => {
    if (step === 0) return null;
    if (step === 6) {
      const unusedCount = fagprat.statements.length - usedStatements.size - (usedStatements.has(selectedIdx) ? 0 : 1);
      const hasMoreStatements = unusedCount > 0;
      return (
        <div className="flex gap-2">
          {hasMoreStatements && (
            <button
              onClick={() => {
                setUsedStatements((prev) => new Set(prev).add(selectedIdx));
                goToStep(0);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)] transition-all hover:-translate-y-px"
            >
              Neste påstand
              <ArrowRight className="size-4" />
            </button>
          )}
          <button
            onClick={handleEnd}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-px"
          >
            Avslutt
          </button>
        </div>
      );
    }
    return nextStepButton;
  };

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar
        title={fagprat.title}
        center={
          session?.transcriptionEnabled
            ? [2, 4].includes(step)
              ? <RecordButton state={recordButtonState} onToggle={() => setRecording(!recording)} elapsed={recordElapsed} />
              : [1, 3, 5, 6].includes(step)
                ? <RecordButton state="disabled" onToggle={() => {}} />
                : undefined
            : undefined
        }
      >
        <a
          href={dashboardUrl}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          Gå til dashboard
        </a>
        <button
          onClick={handleEnd}
          className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.15_25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_oklch(0.45_0.15_25)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.15_25)]"
        >
          Avslutt
        </button>
      </SessionTopBar>

      <div className="flex pt-16 pb-14">
        <main className="flex-1 px-4 py-6 transition-[margin] duration-300 sm:px-8 sm:py-8 md:[margin-right:var(--panel-margin)]" style={{ "--panel-margin": panelOpen ? "340px" : "0px" } as React.CSSProperties}>{renderStepContent()}</main>
        <TeacherPanel defaultOpen={step !== 5} footer={renderPanelFooter()} onOpenChange={setPanelOpen}>
          {renderTeacherContent()}
        </TeacherPanel>
      </div>

      <StepNav currentStep={step} completedSteps={completedSteps} onStepClick={goToStep} />
    </div>
  );
}

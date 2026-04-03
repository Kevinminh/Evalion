import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BackButton } from "@workspace/ui/components/live/back-button";
import { BegrunnelseCard } from "@workspace/ui/components/live/begrunnelse-card";
import { BegrunnelseNav } from "@workspace/ui/components/live/begrunnelse-nav";
import { DistributionChart } from "@workspace/ui/components/live/distribution-chart";
import { EndringerCard } from "@workspace/ui/components/live/endringer-card";
import { FasitBadge } from "@workspace/ui/components/live/fasit-badge";
import { PanelTabs } from "@workspace/ui/components/live/panel-tabs";
import { Professor } from "@workspace/ui/components/live/professor";
import { RatingChart } from "@workspace/ui/components/live/rating-chart";
import { RecordButton } from "@workspace/ui/components/live/record-button";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { StepNav } from "@workspace/ui/components/live/step-nav";
import { TeacherPanel } from "@workspace/ui/components/live/teacher-panel";
import { TimerCard } from "@workspace/ui/components/live/timer-card";
import { cn } from "@workspace/ui/lib/utils";
// VoteButtons removed — teacher view doesn't vote
import { useMutation } from "convex/react";
import { ArrowRight, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { LiveStepSkeleton } from "@workspace/ui/components/skeletons/live-step-skeleton";
import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";

export const Route = createFileRoute("/liveokt/$sessionId/steg/$step")({
  component: LiveStepPage,
});

type VoteType = "sant" | "usant" | "delvis";

const VOTE_DOT_COLORS: Record<VoteType, string> = {
  sant: "bg-sant",
  usant: "bg-usant",
  delvis: "bg-delvis",
};

const VOTE_LABELS: Record<VoteType, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

const STATEMENT_COLORS = [
  { bg: "#FFFDE7", border: "#FFE082" },
  { bg: "#E3F1FC", border: "#90CAF9" },
  { bg: "#FFF3E0", border: "#FFCC80" },
  { bg: "#F3EEFF", border: "#CE93D8" },
  { bg: "#FFEBEE", border: "#EF9A9A" },
];

const FASIT_TEXT: Record<VoteType, string> = {
  sant: "sant",
  usant: "usant",
  delvis: "delvis sant",
};

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
  const startTimerMutation = useMutation(api.liveSessions.startTimer);
  const pauseTimerMutation = useMutation(api.liveSessions.pauseTimer);
  const stopTimerMutation = useMutation(api.liveSessions.stopTimer);
  const highlightBegrunnelseMutation = useMutation(api.liveSessions.highlightBegrunnelse);

  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  // vote and rating state not needed — teacher doesn't interact with student UI
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);
  const [panelTab, setPanelTab] = useState("default");
  const [begrunnelseIdx, setBegrunnelseIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set());

  const countdownTriggered = useRef(false);

  const selectedIdx = selectedStatement ?? session?.currentStatementIndex ?? 0;
  const statement = fagprat?.statements[selectedIdx];

  const { data: votes } = useQuery({
    ...liveSessionQueries.getVotes(typedSessionId, selectedIdx),
    enabled: !!fagprat,
  });

  const { data: ratings } = useQuery({
    ...liveSessionQueries.getRatings(typedSessionId, selectedIdx),
    enabled: !!fagprat && step === 6,
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
    await endSessionMutation({ id: typedSessionId });
    window.location.href = dashboardUrl;
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
    await updateStepMutation({
      id: typedSessionId,
      step: n,
      ...(n === 0 ? {} : { statementIndex: selectedIdx }),
    });
    await navigate({
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

  const studentList = students ?? [];
  const voteList = votes ?? [];
  const ratingList = ratings ?? [];

  // Memoized vote filtering and distribution
  const { r2Votes, activeRoundVotes, voteBars, totalVotes } = useMemo(() => {
    const r1: typeof voteList = [];
    const r2: typeof voteList = [];
    const counts = { sant: 0, usant: 0, delvis: 0 };

    for (const v of voteList) {
      if (v.round === 1) r1.push(v);
      else if (v.round === 2) r2.push(v);
    }

    const active = step <= 2 ? r1 : r2;
    for (const v of active) counts[v.vote]++;

    return {
      r2Votes: r2,
      activeRoundVotes: active,
      totalVotes: active.length,
      voteBars: [
        { label: "Sant", value: counts.sant, color: "bg-sant" },
        { label: "Usant", value: counts.usant, color: "bg-usant" },
        { label: "Delvis", value: counts.delvis, color: "bg-delvis" },
      ],
    };
  }, [voteList, step]);

  // Memoized analytics — prefer backend query, fallback to client-side
  const { r2CorrectCount, r2Total, changedToCorrect, changedToIncorrect, ratingDistribution, avgRating } = useMemo(() => {
    const r2Correct = analytics?.correctR2 ?? (statement ? r2Votes.filter((v) => v.vote === statement.fasit).length : 0);
    const r2Tot = analytics?.totalR2 ?? r2Votes.length;

    // Rating distribution — single-pass fallback
    let ratDist = analytics?.ratingDistribution;
    if (!ratDist) {
      const buckets = [0, 0, 0, 0, 0];
      for (const r of ratingList) {
        if (r.rating >= 1 && r.rating <= 5) buckets[r.rating - 1]!++;
      }
      ratDist = [1, 2, 3, 4, 5].map((score) => ({ score, count: buckets[score - 1]! }));
    }

    const avg = analytics?.avgRating !== undefined && analytics.avgRating > 0
      ? analytics.avgRating
      : ratingList.length > 0
        ? ratingList.reduce((sum, r) => sum + r.rating, 0) / ratingList.length
        : undefined;

    return {
      r2CorrectCount: r2Correct,
      r2Total: r2Tot,
      changedToCorrect: analytics?.wrongToRight ?? 0,
      changedToIncorrect: analytics?.rightToWrong ?? 0,
      ratingDistribution: ratDist,
      avgRating: avg,
    };
  }, [analytics, statement, r2Votes, ratingList]);

  const statementCard = (
    <div className="mx-auto max-w-2xl rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-6">
      <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
    </div>
  );

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
            <Professor size="lg" label="Velg en påstand" className="flex-col pt-4 lg:pt-8" />
            <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {fagprat.statements.map((s, i) => {
                const isSelected = selectedStatement === i;
                const hasSomeSelected = selectedStatement !== null;
                const isLast = i === fagprat.statements.length - 1;
                const isUsed = usedStatements.has(i);
                const color = STATEMENT_COLORS[i % STATEMENT_COLORS.length];
                return (
                  <button
                    key={i}
                    disabled={isUsed}
                    onClick={() => {
                      if (isUsed) return;
                      setSelectedStatement(i);
                      setTimeout(() => goToStep(1), 600);
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
          <div className="flex flex-col items-center gap-8 pt-4">
            <div className="flex w-full items-center justify-between">
              <BackButton onClick={() => goToStep(0)} />
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4" />
                {activeRoundVotes.length}/{studentList.length} har stemt
              </div>
            </div>
            {statementCard}
            <Professor
              size="sm"
              text="Stem uten å avsløre for de andre, og skriv gjerne ned hva du tenker. Hvor sikker er du?"
            />
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center gap-6 pt-4">
            {statementCard}
            <Professor
              size="sm"
              text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
            />
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center gap-8 pt-4">
            <div className="flex w-full items-center justify-between">
              <BackButton onClick={() => goToStep(0)} />
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4" />
                {activeRoundVotes.length}/{studentList.length} har stemt
              </div>
            </div>
            {statementCard}
            <Professor size="sm" text="Har du endret mening etter diskusjonen? Stem på nytt!" />
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
              {countdownDone && statement && <FasitBadge answer={statement.fasit} animated />}
              {statementCard}
              {countdownDone && statement && (
                <Professor
                  size="sm"
                  text={
                    <>
                      Hvorfor er denne påstanden <strong>{FASIT_TEXT[statement.fasit]}</strong>?
                    </>
                  }
                />
              )}
            </div>
          </>
        );
      }

      case 5:
        return (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 pt-8">
            {statement && <FasitBadge answer={statement.fasit} />}
            <div className="w-full max-h-[392px] overflow-y-auto rounded-2xl border-[1.5px] border-blue-200 animate-[fadeInUp_0.5s_ease_0.2s_both]">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6">
                <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
              </div>
              <div className="bg-white p-6">
                <div className="flex gap-4">
                  <Professor size="md" bordered className="shrink-0" />
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
            <Professor size="sm" text="Vurder fra 1 til 5 hvor godt du forstår påstanden nå." />
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
            <TimerCard
              duration={session?.timerDuration}
              startedAt={session?.timerStartedAt}
              pausedAt={session?.timerPausedAt}
              remainingAtPause={session?.timerRemainingAtPause}
              onStart={(d) => startTimerMutation({ id: typedSessionId, duration: d })}
              onPause={() => pauseTimerMutation({ id: typedSessionId })}
              onStop={() => stopTimerMutation({ id: typedSessionId })}
            />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );

      case 2: {
        const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";
        return (
          <PanelTabs
            tabs={[
              { key: "begrunnelser", label: "Begrunnelser" },
              { key: "stemmefordeling", label: "Stemmefordeling" },
            ]}
            activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
            onTabChange={setPanelTab}
          >
            {begrunnelseTab ? (
              <div className="space-y-4">
                <TimerCard
              duration={session?.timerDuration}
              startedAt={session?.timerStartedAt}
              pausedAt={session?.timerPausedAt}
              remainingAtPause={session?.timerRemainingAtPause}
              onStart={(d) => startTimerMutation({ id: typedSessionId, duration: d })}
              onPause={() => pauseTimerMutation({ id: typedSessionId })}
              onStop={() => stopTimerMutation({ id: typedSessionId })}
            />
                {!begrunnelser || begrunnelser.length === 0 ? (
                  <p className="text-xs italic text-muted-foreground">Ingen begrunnelser ennå</p>
                ) : (
                  <>
                    <BegrunnelseNav
                      current={begrunnelseIdx + 1}
                      total={begrunnelser.length}
                      onPrev={() => setBegrunnelseIdx((i) => Math.max(0, i - 1))}
                      onNext={() => setBegrunnelseIdx((i) => Math.min(begrunnelser.length - 1, i + 1))}
                    />
                    {(() => {
                      const b = begrunnelser[begrunnelseIdx];
                      if (!b) return null;
                      const studentName = studentList.find((s) => s._id === b.studentId)?.name;
                      return (
                        <div className="space-y-2">
                          <BegrunnelseCard text={b.text} studentName={studentName} />
                          <button
                            onClick={() => highlightBegrunnelseMutation({ id: b._id, highlighted: !b.highlighted })}
                            className={cn(
                              "w-full rounded-lg px-3 py-2 text-xs font-bold transition-all",
                              b.highlighted
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary",
                            )}
                          >
                            {b.highlighted ? "Fremhevet" : "Fremhev"}
                          </button>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {studentVoteList}
                <div className="h-px bg-border" />
                <DistributionChart bars={voteBars} total={totalVotes} />
              </div>
            )}
          </PanelTabs>
        );
      }

      case 3:
        return (
          <div className="space-y-4">
            <TimerCard
              duration={session?.timerDuration}
              startedAt={session?.timerStartedAt}
              pausedAt={session?.timerPausedAt}
              remainingAtPause={session?.timerRemainingAtPause}
              onStart={(d) => startTimerMutation({ id: typedSessionId, duration: d })}
              onPause={() => pauseTimerMutation({ id: typedSessionId })}
              onStop={() => stopTimerMutation({ id: typedSessionId })}
            />
            <div className="h-px bg-border" />
            {studentVoteList}
            <div className="h-px bg-border" />
            <DistributionChart bars={voteBars} total={totalVotes} />
          </div>
        );

      case 4: {
        const endringerTab = panelTab === "default" || panelTab === "endringer";
        return (
          <PanelTabs
            tabs={[
              { key: "endringer", label: "Endringer" },
              { key: "stemmefordeling", label: "Stemmefordeling" },
            ]}
            activeTab={endringerTab ? "endringer" : "stemmefordeling"}
            onTabChange={setPanelTab}
          >
            {endringerTab ? (
              <EndringerCard
                correctCount={r2CorrectCount}
                totalVotes={r2Total}
                changedToCorrect={changedToCorrect}
                changedToIncorrect={changedToIncorrect}
              />
            ) : (
              <div className="space-y-4">
                <DistributionChart
                  bars={[
                    {
                      label: "Sant",
                      value: r2Votes.filter((v) => v.vote === "sant").length,
                      color: "bg-sant",
                    },
                    {
                      label: "Usant",
                      value: r2Votes.filter((v) => v.vote === "usant").length,
                      color: "bg-usant",
                    },
                    {
                      label: "Delvis",
                      value: r2Votes.filter((v) => v.vote === "delvis").length,
                      color: "bg-delvis",
                    },
                  ]}
                  total={r2Total}
                />
              </div>
            )}
          </PanelTabs>
        );
      }

      case 5: {
        const correctCount = r2Votes.filter((v) => statement && v.vote === statement.fasit).length;
        const highlightedBegrunnelse = begrunnelser?.find((b) => b.highlighted);
        const highlightedStudent = highlightedBegrunnelse
          ? studentList.find((s) => s._id === highlightedBegrunnelse.studentId)
          : null;
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-sant/10 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-sant">
                Svarte riktig
              </div>
              <p className="text-lg font-extrabold text-sant">
                {correctCount}/{r2Total}
              </p>
            </div>
            {highlightedBegrunnelse ? (
              <div className="rounded-lg border-l-[3px] border-l-primary/30 bg-primary/5 p-4">
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary/60">
                  Fremhevet begrunnelse
                </div>
                <BegrunnelseCard text={highlightedBegrunnelse.text} studentName={highlightedStudent?.name} />
              </div>
            ) : (
              <div className="rounded-lg border-l-[3px] border-l-primary/30 bg-primary/5 p-4">
                <p className="text-xs italic text-muted-foreground">
                  Ingen fremhevet begrunnelse ennå
                </p>
              </div>
            )}
          </div>
        );
      }

      case 6:
        return <RatingChart distribution={ratingDistribution} average={avgRating} />;

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

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { LiveStepSkeleton } from "@workspace/evalion/components/skeletons/live-step-skeleton";
import { RecordButton } from "@workspace/evalion/components/live/record-button";
import { SessionTopBar } from "@workspace/evalion/components/live/session-top-bar";
import { StepNav } from "@workspace/evalion/components/live/step-nav";
import { TeacherPanel } from "@workspace/evalion/components/live/teacher-panel";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { isValidConvexId } from "@workspace/evalion/lib/convex-id";
import { ArrowRight } from "lucide-react";

import { fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";
import { useStep4Countdown } from "@/lib/use-step4-countdown";

import { StatementPicker } from "./-liveokt/statement-picker";
import { Step1Main, Step1Panel } from "./-liveokt/step-1-vote-in-progress";
import { Step2Main, Step2Panel } from "./-liveokt/step-2-group-discussion";
import { Step3Main, Step3Panel } from "./-liveokt/step-3-revote";
import { Step4Main, Step4Panel } from "./-liveokt/step-4-reveal";
import { Step5Main, Step5Panel } from "./-liveokt/step-5-distribution";
import { Step6Main, Step6Panel } from "./-liveokt/step-6-rating-summary";
import {
  TeacherSessionProvider,
  useTeacherSession,
} from "./-liveokt/teacher-session-context";

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

  const selectedIdx = session?.currentStatementIndex ?? 0;

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

  if (isPending) {
    return <LiveStepSkeleton />;
  }

  if (!fagprat || !session) {
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

  return (
    <TeacherSessionProvider
      sessionId={typedSessionId}
      step={step}
      session={session}
      fagprat={fagprat}
      students={students ?? []}
      votes={votes ?? []}
      analytics={analytics ?? undefined}
      begrunnelser={begrunnelser}
      navigateToStep={async (n) => {
        await navigate({
          to: "/liveokt/$sessionId/steg/$step",
          params: { sessionId, step: String(n) },
        });
      }}
      onSessionEnded={() => {
        window.location.href = DASHBOARD_URL;
      }}
    >
      <TeacherSessionLayout />
    </TeacherSessionProvider>
  );
}

function TeacherSessionLayout() {
  const { fagprat, session, step, panelOpen, setPanelOpen, completedSteps, goToStep, endSession } =
    useTeacherSession();

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar title={fagprat.title} center={session.transcriptionEnabled ? <RecordingButton /> : undefined}>
        <a
          href={DASHBOARD_URL}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          Gå til dashboard
        </a>
        <button
          onClick={endSession}
          className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.15_25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_oklch(0.45_0.15_25)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.15_25)]"
        >
          Avslutt
        </button>
      </SessionTopBar>

      <div className="flex pt-16 pb-14">
        <main
          className="flex-1 px-4 py-6 transition-[margin] duration-300 sm:px-8 sm:py-8 md:[margin-right:var(--panel-margin)]"
          style={{ "--panel-margin": panelOpen ? "340px" : "0px" } as React.CSSProperties}
        >
          <StepMainRenderer />
        </main>
        <TeacherPanel defaultOpen={step !== 5} footer={<PanelFooter />} onOpenChange={setPanelOpen}>
          <StepPanelRenderer />
        </TeacherPanel>
      </div>

      <StepNav currentStep={step} completedSteps={completedSteps} onStepClick={goToStep} />
    </div>
  );
}

function RecordingButton() {
  const { step, recording, setRecording, recordElapsed } = useTeacherSession();
  if ([2, 4].includes(step)) {
    const state: "ready" | "recording" = recording ? "recording" : "ready";
    return <RecordButton state={state} onToggle={() => setRecording(!recording)} elapsed={recordElapsed} />;
  }
  if ([1, 3, 5, 6].includes(step)) {
    return <RecordButton state="disabled" onToggle={() => {}} />;
  }
  return null;
}

function StepMainRenderer() {
  const { step } = useTeacherSession();
  const { showCountdown, countdownNumber, countdownDone } = useStep4Countdown(step);

  switch (step) {
    case 0:
      return <StatementPicker />;
    case 1:
      return <Step1Main />;
    case 2:
      return <Step2Main />;
    case 3:
      return <Step3Main />;
    case 4:
      return (
        <Step4Main
          showCountdown={showCountdown}
          countdownNumber={countdownNumber}
          countdownDone={countdownDone}
        />
      );
    case 5:
      return <Step5Main />;
    case 6:
      return <Step6Main />;
    default:
      return null;
  }
}

function StepPanelRenderer() {
  const { step } = useTeacherSession();

  switch (step) {
    case 0:
      return <p className="text-center text-sm text-muted-foreground">Venter på valg...</p>;
    case 1:
      return <Step1Panel />;
    case 2:
      return <Step2Panel />;
    case 3:
      return <Step3Panel />;
    case 4:
      return <Step4Panel />;
    case 5:
      return <Step5Panel />;
    case 6:
      return <Step6Panel />;
    default:
      return null;
  }
}

function PanelFooter() {
  const { step, fagprat, selectedIdx, usedStatements, markStatementUsed, goToStep, endSession } =
    useTeacherSession();

  if (step === 0) return null;

  if (step === 6) {
    const unusedCount =
      fagprat.statements.length - usedStatements.size - (usedStatements.has(selectedIdx) ? 0 : 1);
    const hasMoreStatements = unusedCount > 0;
    return (
      <div className="flex gap-2">
        {hasMoreStatements && (
          <button
            onClick={() => {
              markStatementUsed(selectedIdx);
              goToStep(0);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)] transition-all hover:-translate-y-px"
          >
            Neste påstand
            <ArrowRight className="size-4" />
          </button>
        )}
        <button
          onClick={endSession}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-px"
        >
          Avslutt
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => goToStep(step + 1)}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_2px_0_oklch(0.35_0.16_295)] transition-all hover:-translate-y-px"
    >
      Neste steg
      <ArrowRight className="size-4" />
    </button>
  );
}

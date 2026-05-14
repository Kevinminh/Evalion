import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { LiveStepSkeleton } from "@workspace/features/components/skeletons/live-step-skeleton";
import { SessionTopBar } from "@workspace/features/components/live/session-top-bar";
import { StepNav } from "@workspace/features/components/live/step-nav";
import { TeacherPanel } from "@workspace/features/components/live/teacher-panel";
import { TopBarTimer } from "@workspace/features/components/live/top-bar-timer";
import { RouteErrorBoundary } from "@workspace/features/components/route-error-boundary";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { fagpratsQueries } from "@workspace/api/fagprats";
import { liveSessionsQueries } from "@workspace/api/liveSessions";
import { sessionBegrunnelserQueries } from "@workspace/api/sessionBegrunnelser";
import { sessionStudentsQueries } from "@workspace/api/sessionStudents";
import { sessionVotesQueries } from "@workspace/api/sessionVotes";

import { cssVars } from "@/lib/css-vars";
import { DASHBOARD_URL } from "@/lib/env";
import { parseSessionId } from "@/lib/route-params";
import { useStep4Countdown } from "@/hooks/use-step4-countdown";

import { DestructiveButton } from "@workspace/ui/components/destructive-button";
import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";
import { SessionEndedScreen } from "@/components/liveokt/session-ended-screen";
import { StatementPicker } from "@/components/liveokt/statement-picker";
import { useStep1 } from "@/components/liveokt/step-1-vote-in-progress";
import { useStep2 } from "@/components/liveokt/step-2-group-discussion";
import { useStep3 } from "@/components/liveokt/step-3-revote";
import { useStep4 } from "@/components/liveokt/step-4-reveal";
import { useStep5 } from "@/components/liveokt/step-5-distribution";
import { useStep6 } from "@/components/liveokt/step-6-rating-summary";
import {
  TeacherSessionProvider,
  useTeacherSession,
} from "@/components/liveokt/teacher-session-context";
import type { TeacherStep } from "@/types/teacher-step";

export const Route = createFileRoute("/liveokt/$sessionId/steg/$step")({
  beforeLoad: ({ params }) => {
    parseSessionId(params.sessionId);
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
  const typedSessionId = parseSessionId(sessionId);

  const { data: session, isPending: sessionLoading } = useQuery(
    liveSessionsQueries.byId(typedSessionId),
  );
  const { data: fagprat, isPending: fagpratLoading } = useQuery(
    fagpratsQueries.byId(session?.fagpratId ?? "skip"),
  );
  const { data: students } = useQuery(sessionStudentsQueries.listBySession(typedSessionId));

  const selectedIdx = session?.currentStatementIndex ?? 0;

  const { data: votes } = useQuery({
    ...sessionVotesQueries.bySessionStatement(typedSessionId, selectedIdx),
    enabled: !!fagprat,
  });
  const { data: analytics } = useQuery({
    ...sessionVotesQueries.analytics(typedSessionId, selectedIdx),
    enabled: !!fagprat && step >= 4,
  });
  const { data: begrunnelser } = useQuery({
    ...sessionBegrunnelserQueries.bySessionStatement(typedSessionId, selectedIdx),
    enabled: !!fagprat && [2, 4, 5].includes(step),
  });

  if (sessionLoading || fagpratLoading) {
    return <LiveStepSkeleton />;
  }

  if (!fagprat || !session) {
    return (
      <EmptyStateMessage>
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </EmptyStateMessage>
    );
  }

  if (session.status === "ended") {
    return <SessionEndedScreen />;
  }

  if (step > 0 && !fagprat.statements[selectedIdx]) {
    return (
      <EmptyStateMessage>
        <p className="text-muted-foreground">Påstanden ble ikke funnet.</p>
      </EmptyStateMessage>
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
  const {
    fagprat,
    step,
    panelOpen,
    setPanelOpen,
    completedSteps,
    goToStep,
    endSession,
    timer,
  } = useTeacherSession();
  const teacherStep = useCurrentStep();

  // Auto-collapse the panel when the timer transitions from idle → running so
  // the teacher's screen mirrors the demo's classroom-presentation flow. We
  // track the last-seen startedAt: any change to a defined value is a fresh
  // start. Manual re-opens are preserved because the effect only fires on
  // startedAt transitions, not on every render.
  const lastSeenStartedAtRef = useRef<number | undefined>(timer.startedAt);
  useEffect(() => {
    const last = lastSeenStartedAtRef.current;
    if (timer.startedAt && timer.startedAt !== last) {
      setPanelOpen(false);
    }
    lastSeenStartedAtRef.current = timer.startedAt;
  }, [timer.startedAt, setPanelOpen]);

  const timerIsRunning =
    timer.startedAt !== undefined && timer.pausedAt === undefined;
  const showTopbarTimer = timerIsRunning && !panelOpen;

  const stepIntent = useMemo(
    () => ({ open: step === 1 || step === 3, key: step }),
    [step],
  );

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[var(--color-bg-primary)]">
      <SessionTopBar
        title={fagprat.title}
        center={
          showTopbarTimer ? (
            <TopBarTimer
              duration={timer.duration}
              startedAt={timer.startedAt}
              pausedAt={timer.pausedAt}
              remainingAtPause={timer.remainingAtPause}
            />
          ) : undefined
        }
      >
        <DestructiveButton onClick={endSession}>Avslutt økt</DestructiveButton>
      </SessionTopBar>

      <div className="flex min-h-0 flex-1 pt-20 pb-[100px]">
        <main
          className="flex min-h-0 flex-1 flex-col transition-[margin] duration-300 md:[margin-right:var(--panel-margin)]"
          style={cssVars({ "--panel-margin": teacherStep && panelOpen ? "340px" : "0px" })}
        >
          {teacherStep ? teacherStep.main : <StatementPicker />}
        </main>
        {teacherStep && (
          <TeacherPanel
            // Panel auto-flips on every step transition: open on 1 & 3, closed
            // on 2, 4, 5, 6. Driven by `forceState` keyed on `step`. The toggle
            // pulses on "closed" steps and while the timer is running.
            defaultOpen={step === 1 || step === 3}
            attentionWhenClosed={
              step === 2 || step === 4 || step === 5 || step === 6 || timerIsRunning
            }
            forceCollapse={timerIsRunning && (step === 1 || step === 3)}
            forceState={stepIntent}
            footer={
              teacherStep.panelFooter === null ? null : (
                <PanelFooter footer={teacherStep.panelFooter} />
              )
            }
            onOpenChange={setPanelOpen}
          >
            {teacherStep.panel}
          </TeacherPanel>
        )}
      </div>

      <StepNav currentStep={step} completedSteps={completedSteps} onStepClick={goToStep} />
    </div>
  );
}

// Returns the TeacherStep for the current step number, or null when on step 0
// (statement picker, no per-step main/panel definition).
function useCurrentStep(): TeacherStep | null {
  const { step } = useTeacherSession();
  const { showCountdown, countdownNumber, countdownDone } = useStep4Countdown(step);

  // Hooks must be called unconditionally; capture every step result and pick.
  const step1 = useStep1();
  const step2 = useStep2();
  const step3 = useStep3();
  const step4 = useStep4({ showCountdown, countdownNumber, countdownDone });
  const step5 = useStep5();
  const step6 = useStep6();

  switch (step) {
    case 1:
      return step1;
    case 2:
      return step2;
    case 3:
      return step3;
    case 4:
      return step4;
    case 5:
      return step5;
    case 6:
      return step6;
    default:
      return null;
  }
}

function PanelFooter({ footer }: { footer: TeacherStep["panelFooter"] }) {
  const { step, goToStep } = useTeacherSession();

  if (footer === null) return null;
  if (footer) return <>{footer}</>;
  if (step === 0) return null;

  return (
    <PrimaryActionButton fullWidth onClick={() => goToStep(step + 1)}>
      Neste steg
      <ArrowRight className="size-4" />
    </PrimaryActionButton>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { LiveStepSkeleton } from "@workspace/evalion/components/skeletons/live-step-skeleton";
import { SessionTopBar } from "@workspace/evalion/components/live/session-top-bar";
import { StepNav } from "@workspace/evalion/components/live/step-nav";
import { TeacherPanel } from "@workspace/evalion/components/live/teacher-panel";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { ArrowRight } from "lucide-react";

import { fagpratQueries, liveSessionQueries } from "@/lib/convex";
import { cssVars } from "@/lib/css-vars";
import { DASHBOARD_URL } from "@/lib/env";
import { parseSessionId, placeholderConvexId } from "@/lib/route-params";
import { useStep4Countdown } from "@/hooks/use-step4-countdown";

import { EmptyStateMessage } from "@workspace/ui/components/empty-state-message";
import { DestructiveButton } from "@workspace/ui/components/destructive-button";
import { PrimaryActionButton } from "@workspace/ui/components/primary-action-button";
import { RecordingButton } from "@/components/liveokt/recording-button";
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
    liveSessionQueries.getById(typedSessionId),
  );
  const { data: fagprat, isPending: fagpratLoading } = useQuery({
    ...fagpratQueries.getById(session?.fagpratId ?? placeholderConvexId<"fagprats">()),
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
  const { fagprat, session, step, panelOpen, setPanelOpen, completedSteps, goToStep, endSession } =
    useTeacherSession();
  const teacherStep = useCurrentStep();

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar
        title={fagprat.title}
        center={session.transcriptionEnabled ? <RecordingButton /> : undefined}
      >
        <a
          href={DASHBOARD_URL}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          Gå til dashboard
        </a>
        <DestructiveButton onClick={endSession}>Avslutt</DestructiveButton>
      </SessionTopBar>

      <div className="flex min-h-svh pt-16 pb-14">
        <main
          className="flex-1 px-4 py-6 transition-[margin] duration-300 sm:px-8 sm:py-8 md:[margin-right:var(--panel-margin)]"
          style={cssVars({ "--panel-margin": teacherStep && panelOpen ? "340px" : "0px" })}
        >
          {teacherStep ? teacherStep.main : <StatementPicker />}
        </main>
        {teacherStep && (
          <TeacherPanel
            defaultOpen={step !== 5}
            footer={<PanelFooter footer={teacherStep.panelFooter} />}
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

  if (footer) return <>{footer}</>;
  if (step === 0) return null;

  return (
    <PrimaryActionButton fullWidth onClick={() => goToStep(step + 1)}>
      Neste steg
      <ArrowRight className="size-4" />
    </PrimaryActionButton>
  );
}

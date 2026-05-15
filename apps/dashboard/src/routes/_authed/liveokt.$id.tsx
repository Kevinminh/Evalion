import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fagpratsQueries } from "@workspace/api/fagprats";
import { liveSessionsMutations } from "@workspace/api/liveSessions";
import { SessionTopBar } from "@workspace/features/components/live/session-top-bar";
import { RouteErrorBoundary } from "@workspace/features/components/route-error-boundary";
import { LiveoktSetupSkeleton } from "@workspace/features/components/skeletons/liveokt-setup-skeleton";
import { Button } from "@workspace/ui/components/button";
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog";
import { ErrorState } from "@workspace/ui/components/states/error-state";
import { NotFoundState } from "@workspace/ui/components/states/not-found-state";
import { useMutation } from "convex/react";
import { CheckSquare, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GroupingSelector } from "@/components/live/grouping-selector";
import { LaunchModal } from "@/components/live/launch-modal";
import { OptionCard } from "@/components/live/option-card";
import { DEFAULT_GROUP_COUNT } from "@/lib/constants";
import { PLAY_URL } from "@/lib/env";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/_authed/liveokt/$id")({
  component: LiveoktSetupPage,
  errorComponent: RouteErrorBoundary,
});

function LiveoktSetupPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending, isError } = useQuery(fagpratsQueries.byId(id as FagPratId));
  const createSession = useMutation(liveSessionsMutations.create);

  const [groupsEnabled, setGroupsEnabled] = useState(false);
  const [groupCount, setGroupCount] = useState(DEFAULT_GROUP_COUNT);
  const [selfEvalEnabled, setSelfEvalEnabled] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);

  if (isPending) {
    return <LiveoktSetupSkeleton />;
  }

  if (isError) {
    return <ErrorState className="flex min-h-svh items-center justify-center" />;
  }

  if (!fagprat) {
    return <NotFoundState className="flex min-h-svh items-center justify-center" />;
  }

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const sessionId = await createSession({
        fagpratId: fagprat._id,
        groupsEnabled,
        groupCount,
        selfEvalEnabled,
      });
      setCreatedSessionId(sessionId);
      setLaunchModalOpen(true);
    } catch {
      toast.error("Kunne ikke opprette liveøkt. Prøv igjen.");
      setLaunching(false);
    }
  };

  const handleGoToSession = () => {
    window.location.href = `${PLAY_URL}/liveokt/${createdSessionId}`;
  };

  const analyticsUrl = createdSessionId
    ? `${window.location.origin}/analytics/${createdSessionId}`
    : "";

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar title={fagprat.title} onExit={() => setCancelOpen(true)} />

      <div className="mx-auto max-w-[720px] px-4 pt-20 pb-12 sm:px-8 sm:pt-24">
        <h1 className="mb-6 text-2xl font-extrabold text-foreground sm:mb-8 sm:text-3xl">
          Oppsett for liveøkt
        </h1>

        <div className="space-y-4">
          <GroupingSelector
            groupsEnabled={groupsEnabled}
            onGroupsEnabledChange={setGroupsEnabled}
            groupCount={groupCount}
            onGroupCountChange={setGroupCount}
          />

          <OptionCard
            icon={<CheckSquare className="size-5" />}
            title="Egenvurdering"
            description="La elevene vurdere sin egen forståelse etter hver påstand"
            enabled={selfEvalEnabled}
            onToggle={() => setSelfEvalEnabled(!selfEvalEnabled)}
          />

          <Button variant="teal" className="w-full" onClick={handleLaunch} disabled={launching}>
            {launching ? "Oppretter..." : "Neste — opprett lobby"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <LaunchModal
        open={launchModalOpen}
        onOpenChange={setLaunchModalOpen}
        analyticsUrl={analyticsUrl}
        onGoToSession={handleGoToSession}
      />

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Er du sikker på at du vil avbryte?"
        description="Oppsettet for liveøkten vil ikke bli lagret hvis du avbryter nå."
        cancelLabel="Nei, fortsett oppsettet"
        confirmLabel="Ja, avbryt"
        onConfirm={() => navigate({ to: "/min-samling" })}
      />
    </div>
  );
}

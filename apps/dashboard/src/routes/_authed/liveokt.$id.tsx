import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog";
import { RouteErrorBoundary } from "@workspace/evalion/components/route-error-boundary";
import { LiveoktSetupSkeleton } from "@workspace/evalion/components/skeletons/liveokt-setup-skeleton";
import { SessionTopBar } from "@workspace/evalion/components/live/session-top-bar";
import { useMutation } from "convex/react";
import { Users, Mic, CheckSquare, ArrowRight, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { NotFoundState } from "@/components/not-found-state";
import { LaunchModal } from "@/components/live/launch-modal";
import { OptionCard } from "@/components/live/option-card";
import { Stepper } from "@/components/live/stepper";
import { DEFAULT_GROUP_COUNT, MIN_GROUP_COUNT, MAX_GROUP_COUNT } from "@/lib/constants";
import { fagpratQueries, api } from "@/lib/convex";
import { PLAY_URL } from "@/lib/env";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/_authed/liveokt/$id")({
  component: LiveoktSetupPage,
  errorComponent: RouteErrorBoundary,
});

function LiveoktSetupPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending, isError } = useQuery(fagpratQueries.getById(id as FagPratId));
  const createSession = useMutation(api.liveSessions.create);

  const [groupsEnabled, setGroupsEnabled] = useState(true);
  const [groupCount, setGroupCount] = useState(DEFAULT_GROUP_COUNT);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);
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
        transcriptionEnabled,
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

      <div className="mx-auto max-w-[1100px] px-4 pt-20 pb-12 sm:px-8 sm:pt-24">
        <h1 className="mb-6 text-2xl font-extrabold text-foreground sm:mb-8 sm:text-3xl">Oppsett for liveøkt</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Left: Options */}
          <div className="space-y-4">
            <OptionCard
              icon={<Users className="size-5" />}
              title="Grupper"
              description="Del elevene inn i grupper for diskusjonsrunden"
              enabled={groupsEnabled}
              onToggle={() => setGroupsEnabled(!groupsEnabled)}
            >
              <Stepper
                label="Antall grupper"
                value={groupCount}
                min={MIN_GROUP_COUNT}
                max={MAX_GROUP_COUNT}
                onChange={setGroupCount}
              />
            </OptionCard>

            <OptionCard
              icon={<Mic className="size-5" />}
              title="Transkribering"
              description="Ta opp og transkriber elevdiskusjoner automatisk"
              enabled={transcriptionEnabled}
              onToggle={() => setTranscriptionEnabled(!transcriptionEnabled)}
            >
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3">
                <Mic className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <p className="text-xs text-amber-800">
                  Opptak krever tillatelse fra elevene. Sørg for at alle er informert før du
                  aktiverer denne funksjonen.
                </p>
              </div>
            </OptionCard>

            <OptionCard
              icon={<CheckSquare className="size-5" />}
              title="Egenvurdering"
              description="La elevene vurdere sin egen forståelse etter hver påstand"
              enabled={selfEvalEnabled}
              onToggle={() => setSelfEvalEnabled(!selfEvalEnabled)}
            />
          </div>

          {/* Right: Summary panel */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border-[1.5px] border-border bg-card p-6">
              {/* Analytics info */}
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Lærer-analytics
              </div>
              <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                <BarChart3 className="size-8 shrink-0 text-primary/40" />
                <p className="text-xs text-muted-foreground">
                  QR-kode for sanntidsanalyse vises etter at lobbyen er opprettet
                </p>
              </div>

              {/* Launch button */}
              <Button
                variant="teal"
                className="w-full"
                onClick={handleLaunch}
                disabled={launching}
              >
                {launching ? "Oppretter..." : "Neste — opprett lobby"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
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

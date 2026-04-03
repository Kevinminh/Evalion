import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { Users, Mic, CheckSquare, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LiveoktSetupSkeleton } from "@workspace/ui/components/skeletons/liveokt-setup-skeleton";
import { OptionCard } from "@/components/live/option-card";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { Stepper } from "@/components/live/stepper";
import { fagpratQueries, api } from "@/lib/convex";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/_authed/liveokt/$id")({
  component: LiveoktSetupPage,
});

function LiveoktSetupPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending, isError } = useQuery(fagpratQueries.getById(id as FagPratId));
  const createSession = useMutation(api.liveSessions.create);

  const [groupsEnabled, setGroupsEnabled] = useState(true);
  const [groupCount, setGroupCount] = useState(4);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);
  const [selfEvalEnabled, setSelfEvalEnabled] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isPending) {
    return <LiveoktSetupSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-destructive">Noe gikk galt. Prøv å laste siden på nytt.</p>
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
      const playUrl = import.meta.env.VITE_PLAY_URL;
      window.location.href = `${playUrl}/liveokt/${sessionId}`;
    } catch {
      toast.error("Kunne ikke opprette liveøkt. Prøv igjen.");
      setLaunching(false);
    }
  };

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
                min={2}
                max={8}
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
              {/* QR placeholder */}
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Lærer-analytics
              </div>
              <div className="mb-4 flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                <svg className="size-20 text-primary/30" viewBox="0 0 80 80" fill="currentColor" role="img" aria-label="QR-kode plassholder">
                  <rect x="4" y="4" width="24" height="24" rx="3" fillOpacity="0.5" />
                  <rect x="8" y="8" width="16" height="16" rx="1" fillOpacity="0.3" />
                  <rect x="12" y="12" width="8" height="8" rx="1" />
                  <rect x="52" y="4" width="24" height="24" rx="3" fillOpacity="0.5" />
                  <rect x="56" y="8" width="16" height="16" rx="1" fillOpacity="0.3" />
                  <rect x="60" y="12" width="8" height="8" rx="1" />
                  <rect x="4" y="52" width="24" height="24" rx="3" fillOpacity="0.5" />
                  <rect x="8" y="56" width="16" height="16" rx="1" fillOpacity="0.3" />
                  <rect x="12" y="60" width="8" height="8" rx="1" />
                  <rect x="34" y="4" width="8" height="8" rx="1" fillOpacity="0.4" />
                  <rect x="34" y="18" width="8" height="8" rx="1" fillOpacity="0.2" />
                  <rect x="4" y="34" width="8" height="8" rx="1" fillOpacity="0.4" />
                  <rect x="18" y="34" width="8" height="8" rx="1" fillOpacity="0.2" />
                  <rect x="34" y="34" width="8" height="8" rx="1" fillOpacity="0.5" />
                  <rect x="52" y="34" width="8" height="8" rx="1" fillOpacity="0.3" />
                  <rect x="34" y="52" width="8" height="8" rx="1" fillOpacity="0.3" />
                  <rect x="52" y="52" width="8" height="8" rx="1" fillOpacity="0.4" />
                  <rect x="66" y="52" width="8" height="8" rx="1" fillOpacity="0.2" />
                  <rect x="52" y="66" width="8" height="8" rx="1" fillOpacity="0.2" />
                  <rect x="66" y="66" width="8" height="8" rx="1" fillOpacity="0.4" />
                </svg>
              </div>
              <p className="mb-6 text-xs text-muted-foreground">
                Se sanntidsdata og elevrespons under økten
              </p>

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

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker på at du vil avbryte?</AlertDialogTitle>
            <AlertDialogDescription>
              Oppsettet for liveøkten vil ikke bli lagret hvis du avbryter nå.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nei, fortsett oppsettet</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate({ to: "/min-samling" })}>
              Ja, avbryt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

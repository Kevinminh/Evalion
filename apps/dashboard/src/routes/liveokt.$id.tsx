import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Users, Mic, CheckSquare, ArrowRight } from "lucide-react";
import { useState } from "react";

import { OptionCard } from "@/components/live/option-card";
import { SessionTopBar } from "@/components/live/session-top-bar";
import { Stepper } from "@/components/live/stepper";
import { fagpratQueries, api } from "@/lib/convex";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/liveokt/$id")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: LiveoktSetupPage,
});

function LiveoktSetupPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending } = useQuery(fagpratQueries.getById(id as FagPratId));
  const createSession = useMutation(api.liveSessions.create);

  const [groupsEnabled, setGroupsEnabled] = useState(true);
  const [groupCount, setGroupCount] = useState(4);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);
  const [selfEvalEnabled, setSelfEvalEnabled] = useState(true);
  const [launching, setLaunching] = useState(false);

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
      const playUrl = import.meta.env.VITE_PLAY_URL || "http://localhost:3000";
      window.location.href = `${playUrl}/liveokt/${sessionId}`;
    } catch {
      setLaunching(false);
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <SessionTopBar title={fagprat.title} />

      <div className="mx-auto max-w-[1100px] px-8 pt-24 pb-12">
        <h1 className="mb-8 text-3xl font-extrabold text-foreground">Oppsett for liveøkt</h1>

        <div className="grid grid-cols-[1fr_340px] gap-8">
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
          <div className="sticky top-24">
            <div className="rounded-2xl border-[1.5px] border-border bg-card p-6">
              {/* QR placeholder */}
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Elevenes skjerm
              </div>
              <div className="mb-4 flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                <span className="text-sm text-primary/60">QR-kode</span>
              </div>
              <p className="mb-6 text-xs text-muted-foreground">
                Skann for å koble til elevenes enheter
              </p>

              {/* Launch button */}
              <button
                onClick={handleLaunch}
                disabled={launching}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-teal px-6 py-3.5 text-sm font-bold text-white shadow-[0_3px_0_var(--secondary-teal-dark)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_var(--secondary-teal-dark)] active:translate-y-0.5 active:shadow-[0_1px_0_var(--secondary-teal-dark)] disabled:opacity-50"
              >
                {launching ? "Oppretter..." : "Neste — opprett lobby"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

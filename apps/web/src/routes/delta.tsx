import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api, liveSessionQueries } from "@/lib/convex";

export const Route = createFileRoute("/delta")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) ?? "",
  }),
  component: DeltaPage,
});

function DeltaPage() {
  const { code } = Route.useSearch();
  const navigate = useNavigate();
  const { data: session, isPending } = useQuery(liveSessionQueries.getByJoinCode(code));
  const addStudent = useMutation(api.liveSessions.addStudent);

  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.status === "ended") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6">
        <p className="text-lg font-bold text-foreground">Økten ble ikke funnet</p>
        <p className="text-sm text-muted-foreground">
          Sjekk at du har riktig spillkode og prøv igjen.
        </p>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="mr-1 inline size-4" />
          Tilbake
        </Link>
      </div>
    );
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Skriv inn navnet ditt");
      return;
    }
    setJoining(true);
    try {
      const studentId = await addStudent({
        sessionId: session._id,
        name: trimmed,
      });
      navigate({
        to: "/spill/$studentId",
        params: { studentId: studentId as string },
      });
    } catch {
      setError("Kunne ikke bli med. Prøv igjen.");
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Evalion" className="h-12" />
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-1.5">
            <span className="font-mono text-lg font-bold tracking-[0.15em] text-primary">
              {code}
            </span>
          </div>
        </div>

        <form onSubmit={handleJoin} className="flex w-full flex-col gap-4">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-foreground">Hva heter du?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Skriv inn navnet ditt for å bli med
            </p>
          </div>

          <Input
            type="text"
            placeholder="Ditt navn"
            className="h-14 text-center text-lg"
            autoFocus
            maxLength={30}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="h-14 text-lg" disabled={joining}>
            {joining ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <UserPlus data-icon="inline-start" className="size-5" />
            )}
            {joining ? "Blir med..." : "Bli med"}
          </Button>
        </form>

        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="mr-1 inline size-3.5" />
          Endre spillkode
        </Link>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Play, LogOut, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { liveSessionQueries } from "@/lib/convex";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { isAuthenticated } = useRouteContext({ from: "/" });
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  // Live query for the entered code — only enabled when user submits
  const [submittedCode, setSubmittedCode] = useState("");
  const { data: foundSession, isFetching } = useQuery({
    ...liveSessionQueries.getByJoinCode(submittedCode.toUpperCase()),
    enabled: submittedCode.length === 6,
  });

  // Handle the result of the lookup
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      setError("Koden må være 6 tegn");
      return;
    }
    setChecking(true);
    setSubmittedCode(trimmed);
  };

  // React to query result via useEffect (not in render body)
  useEffect(() => {
    if (!checking || isFetching || !submittedCode) return;
    if (foundSession && (foundSession.status === "lobby" || foundSession.status === "active")) {
      navigate({ to: "/delta", search: { code: submittedCode } });
    } else {
      setError(foundSession?.status === "ended" ? "Denne økten er avsluttet" : "Ugyldig spillkode");
      setChecking(false);
      setSubmittedCode("");
    }
  }, [checking, isFetching, submittedCode, foundSession, navigate]);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      {/* User info bar */}
      {isAuthenticated && session?.user && (
        <div className="fixed top-0 right-0 left-0 flex items-center justify-end gap-3 border-b bg-card px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
              {session.user.name ? (
                session.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {session.user.name || "Bruker"}
              </span>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logg ut
          </Button>
        </div>
      )}

      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Evalion" className="h-12" />
          <p className="text-muted-foreground">Bli med i en FagPrat-økt</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <Input
            type="text"
            placeholder="Skriv inn spillkode"
            className="h-14 text-center text-lg uppercase"
            autoFocus
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
          />
          {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="h-14 text-lg" disabled={checking}>
            {checking ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Play data-icon="inline-start" />
            )}
            {checking ? "Sjekker..." : "PLAY"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">Spør læreren din om spillkoden</p>
      </div>
    </div>
  );
}

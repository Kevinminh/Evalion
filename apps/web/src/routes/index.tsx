import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { UserAvatar } from "@workspace/evalion/components/auth/user-menu";
import { Play, LogOut, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { liveSessionQueries } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";

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
    ...liveSessionQueries.getByJoinCode(submittedCode),
    enabled: submittedCode.length === 6,
  });

  // Strip anything that isn't alphanumeric so pasted codes with spaces,
  // dashes, or invisible characters get normalized to just the code.
  const sanitizeCode = (raw: string) =>
    raw
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);

  // Handle the result of the lookup
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = sanitizeCode(code);
    if (!/^[A-Z0-9]{6}$/.test(cleaned)) {
      setError("Koden må være 6 tegn (bokstaver og tall)");
      return;
    }
    setChecking(true);
    setSubmittedCode(cleaned);
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
            {session.user.name ? (
              <UserAvatar name={session.user.name} />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                <User className="size-4" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {session.user.name || "Bruker"}
              </span>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            </div>
          </div>
          <a
            href={DASHBOARD_URL}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Gå til dashboard
          </a>
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
              setCode(sanitizeCode(e.target.value));
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

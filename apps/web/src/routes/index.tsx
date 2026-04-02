import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Play, LogOut, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { isAuthenticated } = useRouteContext({ from: "/" });
  const { data: session } = authClient.useSession();
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

        <div className="flex w-full flex-col gap-4">
          <Input
            type="text"
            placeholder="Skriv inn spillkode"
            className="h-14 text-center text-lg"
            autoFocus
          />
          <Button size="lg" className="h-14 text-lg">
            <Play data-icon="inline-start" />
            PLAY
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">Spør læreren din om spillkoden</p>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/private")({
  component: PrivatePage,
});

function PrivatePage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Privat side</h1>
        <p className="mt-2 text-muted-foreground">
          Du er logget inn og har tilgang til denne siden.
        </p>
      </div>
    </div>
  );
}

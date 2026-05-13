import { Link } from "@tanstack/react-router";

export function RootErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-2xl font-extrabold text-foreground">Noe gikk galt</h1>
      <p className="text-muted-foreground">
        {import.meta.env.DEV ? error.message : "En uventet feil oppstod"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Last inn siden på nytt
      </button>
    </div>
  );
}

export function RootNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-4xl font-extrabold text-foreground">404</h1>
      <p className="text-muted-foreground">Siden ble ikke funnet</p>
      <Link to="/" className="text-sm font-semibold text-primary hover:underline">
        Tilbake til forsiden
      </Link>
    </div>
  );
}

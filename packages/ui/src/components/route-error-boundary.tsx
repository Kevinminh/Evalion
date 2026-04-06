import { useRouter } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

interface RouteErrorBoundaryProps {
  error: Error;
  reset?: () => void;
}

/**
 * Minimal route-level error fallback for TanStack Router `errorComponent`.
 * Shows a friendly Norwegian message and a retry button that re-runs the
 * route's loaders/queries via `router.invalidate()`.
 */
export function RouteErrorBoundary({ error, reset }: RouteErrorBoundaryProps) {
  const router = useRouter();

  const handleRetry = () => {
    reset?.();
    router.invalidate();
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="text-xl font-extrabold text-foreground">Noe gikk galt</h1>
        <p className="text-sm text-muted-foreground">
          Vi klarte ikke å laste siden. Prøv igjen.
        </p>
        {import.meta.env.DEV && (
          <pre className="max-w-full overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[0_3px_0_oklch(0.4_0.15_280)] transition-all hover:-translate-y-px"
        >
          <RefreshCw className="size-4" />
          Prøv igjen
        </button>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users, Calendar } from "lucide-react";

import { SessionCardSkeleton } from "@workspace/ui/components/skeletons/session-card-skeleton";
import { liveSessionQueries } from "@/lib/convex";

export const Route = createFileRoute("/_dashboard/historikk")({
  component: HistorikkPage,
});

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistorikkPage() {
  const navigate = useNavigate();
  const { data: sessions, isPending } = useQuery(liveSessionQueries.listByTeacher());

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Historikk</h1>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && sessions && sessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sessions.map((session) => (
            <button
              key={session._id}
              onClick={() => navigate({ to: "/fagprat/$id", params: { id: session.fagpratId } })}
              className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-foreground">{session.fagpratTitle}</h3>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" />
                  {session.studentCount} elever
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {formatDate(session._creationTime)}
                </span>
              </div>

              <span className="mt-auto inline-block rounded-lg bg-muted px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground">
                {session.joinCode}
              </span>
            </button>
          ))}
        </div>
      )}

      {!isPending && (!sessions || sessions.length === 0) && (
        <p className="py-12 text-center text-muted-foreground">
          Du har ingen avsluttede liveøkter ennå.
        </p>
      )}
    </div>
  );
}

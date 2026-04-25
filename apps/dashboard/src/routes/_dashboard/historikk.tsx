import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Users, Calendar, BarChart3, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SessionCardSkeleton } from "@workspace/evalion/components/skeletons/session-card-skeleton";
import { DeleteFagPratDialog } from "@/components/delete-fagprat-dialog";
import { ErrorState } from "@/components/error-state";
import { SKELETON_COUNT } from "@/lib/constants";
import { api, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/_dashboard/historikk")({
  component: HistorikkPage,
});

function HistorikkPage() {
  const navigate = useNavigate();
  const { data: sessions, isPending, isError } = useQuery(liveSessionQueries.listByTeacher());
  const removeSession = useMutation(api.liveSessions.remove);

  const [deleteSession, setDeleteSession] = useState<{
    id: Id<"liveSessions">;
    title: string;
  } | null>(null);

  const handleDelete = async () => {
    if (!deleteSession) return;
    try {
      await removeSession({ id: deleteSession.id });
      setDeleteSession(null);
      toast.success("Liveøkten ble slettet.");
    } catch {
      toast.error("Kunne ikke slette liveøkten. Prøv igjen.");
    }
  };

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Historikk</h1>
      </div>

      {isError && <ErrorState className="py-12 text-center" />}

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && sessions && sessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <button
                onClick={() => navigate({ to: "/fagprat/$id", params: { id: session.fagpratId } })}
                className="text-left"
              >
                <h3 className="text-lg font-bold text-foreground">{session.fagpratTitle}</h3>
              </button>

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

              <span className="inline-block rounded-lg bg-muted px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground self-start">
                {session.joinCode}
              </span>

              <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-3">
                <button
                  onClick={() =>
                    navigate({ to: "/analytics/$id", params: { id: session._id } })
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-card px-3 py-2 text-sm font-bold text-primary transition-all hover:border-primary/60 hover:bg-primary/5"
                >
                  <BarChart3 className="size-4" />
                  Se statistikk
                </button>
                <button
                  onClick={() =>
                    setDeleteSession({ id: session._id, title: session.fagpratTitle })
                  }
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border-2 border-border text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isPending && (!sessions || sessions.length === 0) && (
        <p className="py-12 text-center text-muted-foreground">
          Du har ingen avsluttede liveøkter ennå.
        </p>
      )}

      <DeleteFagPratDialog
        open={deleteSession !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteSession(null);
        }}
        title={deleteSession?.title ?? ""}
        description={`Denne handlingen kan ikke angres. Liveøkten \u201C${deleteSession?.title ?? ""}\u201D og all tilhørende data vil bli permanent slettet.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}

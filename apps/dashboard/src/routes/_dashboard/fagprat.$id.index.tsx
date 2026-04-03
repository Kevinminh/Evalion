import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { useMutation } from "convex/react";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Users, Pencil, MoreVertical, Copy, Trash2, FolderPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { FagPratDetailSkeleton } from "@workspace/ui/components/skeletons/fagprat-detail-skeleton";
import { AuthorAvatar } from "@/components/author-avatar";
import { DeleteFagPratDialog } from "@/components/delete-fagprat-dialog";
import { StatementTable } from "@/components/statement-table";
import { TypeIcon } from "@/components/type-icon";
import { authClient } from "@/lib/auth-client";
import { api, fagpratQueries } from "@/lib/convex";
import type { FagPratId } from "@/lib/types";

export const Route = createFileRoute("/_dashboard/fagprat/$id/")({
  component: FagPratPreviewPage,
});

function FagPratPreviewPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: fagprat, isPending, isError } = useQuery(fagpratQueries.getById(id as FagPratId));
  const { data: session } = authClient.useSession();
  const duplicateFagPrat = useMutation(api.fagprats.duplicate);
  const removeFagPrat = useMutation(api.fagprats.remove);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isPending) {
    return <FagPratDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive">Noe gikk galt. Prøv å laste siden på nytt.</p>
      </div>
    );
  }

  if (!fagprat) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  const isAuthor = session?.user?.id && fagprat.authorId === session.user.id;

  const handleDuplicate = async () => {
    try {
      const newId = await duplicateFagPrat({ id: fagprat._id });
      navigate({ to: "/fagprat/$id", params: { id: newId } });
    } catch {
      toast.error("Kunne ikke duplisere FagPraten. Prøv igjen.");
    }
  };

  const handleDelete = async () => {
    try {
      await removeFagPrat({ id: fagprat._id });
      navigate({ to: "/min-samling" });
    } catch {
      toast.error("Kunne ikke slette FagPraten. Prøv igjen.");
    }
  };

  return (
    <div className="max-w-[1100px]">
      {/* Back link */}
      <button
        onClick={() => navigate({ to: isAuthor ? "/min-samling" : "/" })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tilbake
      </button>
      {/* Header */}
      <div className="mb-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{fagprat.title}</h1>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="teal"
            size="lg"
            onClick={() => navigate({ to: "/liveokt/$id", params: { id } })}
          >
            <Users className="size-4" />
            Start liveøkt
          </Button>

          {isAuthor ? (
            /* Author view: Edit + More menu with duplicate/delete */
            (<>
              <button
                onClick={() => navigate({ to: "/fagprat/$id/rediger", params: { id } })}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-card px-4 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary/60 hover:bg-primary/5 sm:px-5 sm:py-3"
              >
                <Pencil className="size-4" />
                Endre
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-xl border-2 border-border px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:border-muted-foreground/50 hover:bg-muted">
                  <MoreVertical className="size-4" />
                  Mer
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="size-4" />
                    Dupliser
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="size-4" />
                    Slett
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>)
          ) : (
            /* Browse view: Add to collection */
            (<button
              onClick={handleDuplicate}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-card px-4 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary/60 hover:bg-primary/5 sm:px-5 sm:py-3"
            >
              <FolderPlus className="size-4" />Legg til i min samling
            </button>)
          )}

          <DeleteFagPratDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title={fagprat.title}
            onConfirm={handleDelete}
          />
        </div>
      </div>
      {/* Meta tags */}
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-block rounded-full border-[1.5px] border-muted-foreground/30 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          {fagprat.subject}
        </span>
        <span className="inline-block rounded-full border-[1.5px] border-muted-foreground/30 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          {fagprat.level}
        </span>
        <TypeIcon type={fagprat.type} />
      </div>
      {/* Author info (only shown when browsing) */}
      {!isAuthor && fagprat.authorName && (
        <div className="mb-6">
          <AuthorAvatar name={fagprat.authorName} />
        </div>
      )}
      {/* Begreper */}
      <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Viktige begreper
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {fagprat.concepts.map((concept) => (
          <span
            key={concept}
            className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary"
          >
            {concept}
          </span>
        ))}
      </div>
      {/* Statements table */}
      <StatementTable statements={fagprat.statements} />
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { Users, Pencil, MoreVertical, Play, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthorAvatar } from "@/components/author-avatar";
import { DeleteFagPratDialog } from "@/components/delete-fagprat-dialog";
import { TypeIcon } from "@/components/type-icon";
import { api } from "@/lib/convex";
import type { FagPrat } from "@/lib/types";

interface FagPratCardProps {
  fagprat: FagPrat;
  variant: "browse" | "collection";
}

export function FagPratCard({ fagprat, variant }: FagPratCardProps) {
  const navigate = useNavigate();
  const duplicateFagPrat = useMutation(api.fagprats.duplicate);
  const removeFagPrat = useMutation(api.fagprats.remove);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (duplicating) return;
    setDuplicating(true);
    try {
      const newId = await duplicateFagPrat({ id: fagprat._id });
      navigate({ to: "/fagprat/$id", params: { id: newId } });
    } catch {
      toast.error("Kunne ikke duplisere FagPraten. Prøv igjen.");
    } finally {
      setDuplicating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await removeFagPrat({ id: fagprat._id });
      setDeleteOpen(false);
    } catch {
      toast.error("Kunne ikke slette FagPraten. Prøv igjen.");
    }
  };

  return (
    <div
      className="flex cursor-pointer flex-col rounded-2xl border-[1.5px] border-border bg-card p-6 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[3px] hover:border-primary/30 hover:shadow-md"
      onClick={() => navigate({ to: "/fagprat/$id", params: { id: fagprat._id } })}
    >
      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {fagprat.subject}
        </span>
        <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {fagprat.level}
        </span>
        <TypeIcon type={fagprat.type} />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-extrabold leading-snug text-foreground">{fagprat.title}</h3>

      {/* Statement count */}
      <p className="mb-5 text-sm text-muted-foreground">{fagprat.statements.length} påstander</p>

      {variant === "browse" ? (
        <>
          {/* Usage */}
          <div className="mt-auto flex items-center gap-2 pb-3 text-sm text-muted-foreground">
            <Play className="size-5 text-teal-400" />
            Brukt {fagprat.usageCount} ganger
          </div>
          {/* Author */}
          <div className="border-t border-border/50 pt-3">
            <AuthorAvatar name={fagprat.authorName} />
          </div>
        </>
      ) : (
        /* Collection actions */
        <div className="mt-auto flex items-center gap-3">
          <Button
            variant="teal"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/liveokt/$id", params: { id: fagprat._id } });
            }}
          >
            <Users className="size-4" />
            Start liveøkt
          </Button>
          <button
            aria-label="Rediger"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-primary/30 bg-card text-primary transition-all hover:border-primary/60 hover:bg-primary/5"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/fagprat/$id/rediger", params: { id: fagprat._id } });
            }}
          >
            <Pencil className="size-4" />
          </button>

          {/* Mer dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Flere valg"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-border text-muted-foreground transition-all hover:border-muted-foreground/50 hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4}>
              <DropdownMenuItem onClick={handleDuplicate} disabled={duplicating}>
                <Copy className="size-4" />
                {duplicating ? "Dupliserer..." : "Dupliser"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="size-4" />
                Slett
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteFagPratDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title={fagprat.title}
            onConfirm={handleDelete}
            stopPropagation
          />
        </div>
      )}
    </div>
  );
}

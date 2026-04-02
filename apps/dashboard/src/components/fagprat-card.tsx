import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { Sprout, Target, Users, Pencil, MoreVertical, Play, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

import { api } from "@/lib/convex";
import type { FagPrat } from "@/lib/types";

function TypeIcon({ type }: { type: "intro" | "oppsummering" }) {
  if (type === "intro") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-500">
        <Sprout className="size-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
      <Target className="size-3.5" />
    </span>
  );
}

interface FagPratCardProps {
  fagprat: FagPrat;
  variant: "browse" | "collection";
}

export function FagPratCard({ fagprat, variant }: FagPratCardProps) {
  const navigate = useNavigate();
  const createFagPrat = useMutation(api.fagprats.create);
  const removeFagPrat = useMutation(api.fagprats.remove);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = await createFagPrat({
      title: fagprat.title + " (kopi)",
      subject: fagprat.subject,
      level: fagprat.level,
      type: fagprat.type,
      concepts: fagprat.concepts,
      statements: fagprat.statements,
      visibility: fagprat.visibility,
    });
    navigate({ to: "/fagprat/$id", params: { id: newId } });
  };

  const handleDelete = async () => {
    await removeFagPrat({ id: fagprat._id });
    setDeleteOpen(false);
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
          <div className="flex items-center gap-2 border-t border-border/50 pt-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <svg
                className="size-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{fagprat.authorName}</span>
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
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-border text-muted-foreground transition-all hover:border-muted-foreground/50 hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4}>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="size-4" />
                Dupliser
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

          {/* Delete confirmation dialog */}
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                <AlertDialogDescription>
                  Denne handlingen kan ikke angres. FagPraten &ldquo;{fagprat.title}&rdquo; vil bli
                  permanent slettet.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Slett</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

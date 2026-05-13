import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { useMutation } from "convex/react";
import { Copy, FileText, Globe, Lock, Share2, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";

import { AuthorAvatar } from "@/components/author-avatar";
import { DeleteFagPratDialog } from "@/components/delete-fagprat-dialog";
import { ShareFagPratDialog } from "@/components/share-fagprat-dialog";
import { TypeIcon } from "@/components/type-icon";
import { api } from "@/lib/convex";
import type { FagPratSummary } from "@/lib/types";

interface FagPratCardProps {
  fagprat: FagPratSummary;
  variant: "browse" | "collection";
}

export const FagPratCard = memo(FagPratCardImpl);

function FagPratCardImpl({ fagprat, variant }: FagPratCardProps) {
  const navigate = useNavigate();
  const duplicateFagPrat = useMutation(api.fagprats.duplicate);
  const removeFagPrat = useMutation(api.fagprats.remove);
  const setVisibility = useMutation(api.fagprats.setVisibility).withOptimisticUpdate(
    (localStore, args) => {
      const list = localStore.getQuery(api.fagprats.listByAuthor, {});
      if (list) {
        localStore.setQuery(
          api.fagprats.listByAuthor,
          {},
          list.map((fp) => (fp._id === args.id ? { ...fp, visibility: args.visibility } : fp)),
        );
      }
      const single = localStore.getQuery(api.fagprats.getById, { id: args.id });
      if (single) {
        localStore.setQuery(
          api.fagprats.getById,
          { id: args.id },
          {
            ...single,
            visibility: args.visibility,
          },
        );
      }
    },
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const isPublic = fagprat.visibility === "public";

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

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = isPublic ? "private" : "public";
    try {
      await setVisibility({ id: fagprat._id, visibility: next });
      toast.success(next === "public" ? "FagPraten er nå offentlig." : "FagPraten er nå privat.");
    } catch {
      toast.error("Kunne ikke endre synlighet. Prøv igjen.");
    }
  };

  return (
    <div
      className="fp-card"
      onClick={() => navigate({ to: "/fagprat/$id", params: { id: fagprat._id } })}
    >
      <div className="fp-card-tags">
        <span className="fp-card-tag">{fagprat.subject}</span>
        <span className="fp-card-tag">{fagprat.level}</span>
        <TypeIcon type={fagprat.type} />
      </div>

      <h3 className="fp-card-title">{fagprat.title}</h3>
      <p className="fp-card-count">{fagprat.statementsCount} påstander</p>

      {variant === "browse" ? (
        <>
          <div className="fp-card-usage">
            <svg
              className="fp-card-usage-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Brukt {fagprat.usageCount} ganger
          </div>
          <AuthorAvatar name={fagprat.authorName} />
        </>
      ) : (
        <div className="fp-card-actions">
          <button
            type="button"
            className="btn-liveokt"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/liveokt/$id", params: { id: fagprat._id } });
            }}
          >
            <span className="btn-liveokt-icon">👥</span>
            Start liveøkt
          </button>
          <button
            type="button"
            aria-label="Rediger"
            className="btn-endre"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/fagprat/$id/rediger", params: { id: fagprat._id } });
            }}
          >
            ✏️
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Flere valg"
              className="btn-more"
              onClick={(e) => e.stopPropagation()}
            >
              ⋮
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6} className="card-menu-content">
              <DropdownMenuItem
                className="card-menu-item"
                onClick={handleDuplicate}
                disabled={duplicating}
              >
                <Copy className="group-focus/dropdown-menu-item:!text-inherit" />
                {duplicating ? "Dupliserer..." : "Dupliser"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="card-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setShareOpen(true);
                }}
              >
                <Share2 className="hover:text-inherit!" />
                Del
              </DropdownMenuItem>
              <DropdownMenuItem
                className="card-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: "/fagprat/$id/pdf", params: { id: fagprat._id } });
                }}
              >
                <FileText className="group-focus/dropdown-menu-item:!text-inherit" />
                Lag PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="card-menu-item" onClick={handleToggleVisibility}>
                {isPublic ? (
                  <Lock className="group-focus/dropdown-menu-item:!text-inherit" />
                ) : (
                  <Globe className="group-focus/dropdown-menu-item:!text-inherit" />
                )}
                {isPublic ? "Gjør privat" : "Gjør offentlig"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="card-menu-separator" />
              <DropdownMenuItem
                className="card-menu-item"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="group-focus/dropdown-menu-item:!text-inherit" />
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

          <ShareFagPratDialog
            open={shareOpen}
            onOpenChange={setShareOpen}
            fagpratId={fagprat._id}
            title={fagprat.title}
            stopPropagation
          />
        </div>
      )}
    </div>
  );
}

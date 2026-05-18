import { useQuery } from "@tanstack/react-query";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { sessionJustificationsMutations, sessionJustificationsQueries } from "@workspace/api/sessionJustifications";
import { sessionStudentsQueries } from "@workspace/api/sessionStudents";
import { cn } from "@workspace/ui/lib/utils";
import { useMutation } from "convex/react";
import { GripVertical, Sparkles, X } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useEffect, useMemo, useState } from "react";

interface HighlightedReorderPanelProps {
  sessionId: Id<"liveSessions">;
  statementIndex: number;
  /** Optional round filter. When set, only highlighted justifications written
   * in that round are shown. Omit to show highlights from both rounds (used by
   * the Resultat tab as a final summary). */
  round?: 1 | 2;
}

interface PanelItem {
  id: Id<"sessionJustifications">;
  text: string;
  studentName: string;
  highlightOrder: number;
}

export function HighlightedReorderPanel({
  sessionId,
  statementIndex,
  round,
}: HighlightedReorderPanelProps) {
  const { data: begrunnelser } = useQuery(
    sessionJustificationsQueries.bySessionStatement(sessionId, statementIndex),
  );
  const { data: students } = useQuery(sessionStudentsQueries.listBySession(sessionId));
  const reorder = useMutation(sessionJustificationsMutations.reorder);
  const setHighlight = useMutation(sessionJustificationsMutations.highlight);

  const remoteItems = useMemo<PanelItem[]>(() => {
    if (!begrunnelser || !students) return [];
    const nameByStudent = new Map(students.map((s) => [s._id, s.name]));
    return begrunnelser
      .filter((b) => b.highlighted && (round === undefined || b.round === round))
      .map((b, fallbackIdx) => ({
        id: b._id,
        text: b.text,
        studentName: nameByStudent.get(b.studentId) ?? "Ukjent",
        // Undefined order sinks to end while preserving stable relative position.
        highlightOrder: b.highlightOrder ?? Number.MAX_SAFE_INTEGER - fallbackIdx,
      }))
      .sort((a, b) => a.highlightOrder - b.highlightOrder);
  }, [begrunnelser, students, round]);

  // Local mirror of the server order so the drag interaction is responsive.
  // We resync when the remote list changes (additions, removals, server-confirmed
  // reorders) but keep the user's optimistic order in between.
  const [localItems, setLocalItems] = useState<PanelItem[]>(remoteItems);
  useEffect(() => {
    setLocalItems(remoteItems);
  }, [remoteItems]);

  if (localItems.length === 0) return null;

  const handleReorder = (next: PanelItem[]) => {
    setLocalItems(next);
    void reorder({
      sessionId,
      statementIndex,
      orderedIds: next.map((i) => i.id),
    });
  };

  const handleUnhighlight = (id: Id<"sessionJustifications">) => {
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
    void setHighlight({ id, highlighted: false });
  };

  return (
    <div className="rounded-[16px] border border-primary/20 bg-primary/[0.04] p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-primary" />
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
          Fremhevet rekkefølge
        </span>
        <span className="ml-auto text-[10px] font-semibold text-muted-foreground">
          Dra for å endre
        </span>
      </div>
      <Reorder.Group
        as="div"
        axis="y"
        values={localItems}
        onReorder={handleReorder}
        className="flex flex-col gap-1.5"
      >
        {localItems.map((item) => (
          <HighlightItem key={item.id} item={item} onUnhighlight={handleUnhighlight} />
        ))}
      </Reorder.Group>
    </div>
  );
}

interface HighlightItemProps {
  item: PanelItem;
  onUnhighlight: (id: Id<"sessionJustifications">) => void;
}

function HighlightItem({ item, onUnhighlight }: HighlightItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={item}
      dragListener={false}
      dragControls={dragControls}
      transition={{ type: "spring", stiffness: 600, damping: 40 }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
      }}
      style={{ position: "relative" }}
      className="flex items-center gap-2 rounded-[10px] border border-neutral-200 bg-white px-2 py-1.5"
    >
      <button
        type="button"
        aria-label="Dra for å endre rekkefølge"
        onPointerDown={(e) => dragControls.start(e)}
        className={cn(
          "flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground transition-colors select-none hover:bg-neutral-100 active:cursor-grabbing",
        )}
      >
        <GripVertical className="size-3.5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-foreground">{item.studentName}</div>
        <div className="truncate text-[11px] italic text-muted-foreground">«{item.text}»</div>
      </div>
      <button
        type="button"
        aria-label="Fjern fremheving"
        onClick={() => onUnhighlight(item.id)}
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="size-3.5" />
      </button>
    </Reorder.Item>
  );
}

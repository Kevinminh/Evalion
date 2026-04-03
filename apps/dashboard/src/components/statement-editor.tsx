import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@workspace/ui/lib/utils";
import { GripVertical, Trash2, Sparkles, ImageIcon } from "lucide-react";

import { ComingSoonButton } from "@/components/coming-soon-button";
import { LABEL_CLASS, TEXTAREA_CLASS } from "@/lib/constants";
import { FASIT_OPTIONS } from "@/lib/fasit-config";
import { getStatementColor } from "@/lib/statement-colors";
import type { Fasit } from "@/lib/types";

interface StatementEditorProps {
  id: number | string;
  index: number;
  text: string;
  fasit: Fasit;
  explanation: string;
  colorIndex?: number;
  onTextChange: (value: string) => void;
  onFasitChange: (value: Fasit) => void;
  onExplanationChange: (value: string) => void;
  onDelete: () => void;
}

export function StatementEditor({
  id,
  index,
  text,
  fasit,
  explanation,
  colorIndex,
  onTextChange,
  onFasitChange,
  onExplanationChange,
  onDelete,
}: StatementEditorProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const color = colorIndex !== undefined ? getStatementColor(colorIndex) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-2xl border-[1.5px] border-border bg-card",
        isDragging && "z-10 opacity-80 shadow-lg",
      )}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-extrabold",
              color
                ? `${color.bg} ${color.text}`
                : "bg-primary text-white",
            )}
          >
            {index + 1}
          </div>
          <button
            aria-label="Dra for å sortere"
            className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
          <ComingSoonButton icon={<Sparkles className="size-4" />} ariaLabel="Generer med AI" />
        </div>
        <button
          onClick={onDelete}
          aria-label="Slett påstand"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="space-y-4 p-5">
        {/* Påstand */}
        <div>
          <label className={`mb-1.5 block ${LABEL_CLASS}`}>
            Påstand
          </label>
          <div className="flex gap-2">
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Skriv en påstand..."
              className={`min-h-16 ${TEXTAREA_CLASS}`}
            />
            <ComingSoonButton
              icon={<ImageIcon className="size-4" />}
              ariaLabel="Legg til bilde for påstand"
              className="flex size-10 shrink-0 items-center justify-center self-start rounded-lg border-2 border-dashed border-muted-foreground/30"
            />
          </div>
        </div>

        {/* Fasit */}
        <div>
          <label className={`mb-1.5 block ${LABEL_CLASS}`}>
            Fasit
          </label>
          <div className="flex gap-2">
            {FASIT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onFasitChange(option.value)}
                className={cn(
                  "rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all",
                  fasit === option.value
                    ? `${option.bg} ${option.text} ${option.border}`
                    : "border-border text-muted-foreground hover:border-muted-foreground/50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Forklaring */}
        <div>
          <label className={`mb-1.5 block ${LABEL_CLASS}`}>
            Forklaring
          </label>
          <div className="flex gap-2">
            <textarea
              value={explanation}
              onChange={(e) => onExplanationChange(e.target.value)}
              placeholder="Forklar hvorfor svaret er riktig..."
              className={`min-h-16 ${TEXTAREA_CLASS}`}
            />
            <ComingSoonButton
              icon={<ImageIcon className="size-4" />}
              ariaLabel="Legg til bilde for forklaring"
              className="flex size-10 shrink-0 items-center justify-center self-start rounded-lg border-2 border-dashed border-muted-foreground/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

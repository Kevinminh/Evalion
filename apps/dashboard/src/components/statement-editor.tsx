import type { StatementWithId } from "@workspace/evalion/hooks/use-statements";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useRef, useState } from "react";

import { FASIT_OPTIONS } from "@/lib/fasit-config";
import { useClickOutside } from "@/lib/use-click-outside";
import type { Fasit } from "@/lib/types";

interface StatementEditorProps {
  value: StatementWithId;
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

const ACTION_BTN_CLASS =
  "flex size-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-border bg-card text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary";

const FASIT_TRIGGER_CLASS: Record<Fasit, string> = {
  sant: "bg-sant-bg text-sant border-sant",
  usant: "bg-usant-bg text-usant border-usant",
  delvis: "bg-delvis-bg text-delvis border-delvis",
};

function FasitDropdown({ value, onChange }: { value: Fasit; onChange: (v: Fasit) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const selected = FASIT_OPTIONS.find((o) => o.value === value) ?? FASIT_OPTIONS[0];

  return (
    <div ref={ref} className="relative w-40">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border-[1.5px] px-4 py-3 text-sm font-bold uppercase outline-none transition-colors",
          FASIT_TRIGGER_CLASS[selected.value],
        )}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className="size-4 shrink-0 opacity-70" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 z-30 mt-2 rounded-xl border-[1.5px] border-border bg-popover p-2 shadow-lg"
        >
          {FASIT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm font-bold uppercase transition-colors",
                opt.value === value
                  ? FASIT_TRIGGER_CLASS[opt.value]
                  : "text-foreground hover:bg-muted/60",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function StatementEditor({
  value,
  index,
  text,
  fasit,
  explanation,
  onTextChange,
  onFasitChange,
  onExplanationChange,
  onDelete,
}: StatementEditorProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={value}
      dragListener={false}
      dragControls={dragControls}
      transition={{ type: "spring", stiffness: 600, damping: 40 }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
        zIndex: 10,
      }}
      style={{ position: "relative" }}
      className="rounded-2xl border-[1.5px] border-border bg-card px-6 py-5 transition-colors hover:border-primary/30 hover:shadow-sm"
    >
      {/* Top bar: number + actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
          {index + 1}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onDelete}
            aria-label="Slett påstand"
            className={cn(
              ACTION_BTN_CLASS,
              "hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive",
            )}
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Dra for å sortere"
            onPointerDown={(e) => dragControls.start(e)}
            className={cn(ACTION_BTN_CLASS, "cursor-grab touch-none select-none active:cursor-grabbing")}
          >
            <GripVertical className="size-4" />
          </button>
        </div>
      </div>

      {/* Påstand input row */}
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Påstand
      </div>
      <div className="flex items-stretch gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Skriv en påstand..."
          className="flex-1 rounded-lg border-[1.5px] border-border bg-muted/40 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card focus:ring-3 focus:ring-primary/20"
        />
      </div>

      {/* Bottom: Fasit + Forklaring */}
      <div className="mt-4 flex items-stretch gap-6">
        <div className="flex shrink-0 flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fasit
          </span>
          <FasitDropdown value={fasit} onChange={onFasitChange} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Forklaring
          </span>
          <div className="flex h-full items-stretch gap-3">
            <input
              type="text"
              value={explanation}
              onChange={(e) => onExplanationChange(e.target.value)}
              placeholder="Forklar hvorfor svaret er riktig..."
              className="flex-1 rounded-lg border-[1.5px] border-border bg-muted/40 px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card focus:ring-3 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

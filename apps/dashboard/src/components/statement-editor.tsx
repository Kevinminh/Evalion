import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface StatementEditorProps {
  index: number;
  statement: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
  onStatementChange: (value: string) => void;
  onFasitChange: (value: "sant" | "usant" | "delvis") => void;
  onExplanationChange: (value: string) => void;
  onDelete: () => void;
}

const fasitOptions = [
  { value: "sant" as const, label: "Sant", bg: "bg-[#E8F5E9]", text: "text-[#4CAF50]", border: "border-[#4CAF50]" },
  { value: "usant" as const, label: "Usant", bg: "bg-[#FFEBEE]", text: "text-[#EF5350]", border: "border-[#EF5350]" },
  { value: "delvis" as const, label: "Delvis sant", bg: "bg-[#FFF3E0]", text: "text-[#E65100]", border: "border-[#E65100]" },
];

export function StatementEditor({
  index,
  statement,
  fasit,
  explanation,
  onStatementChange,
  onFasitChange,
  onExplanationChange,
  onDelete,
}: StatementEditorProps) {
  return (
    <div className="rounded-2xl border-[1.5px] border-border bg-card">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {index + 1}
          </div>
          <GripVertical className="size-4 text-muted-foreground/50" />
        </div>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="space-y-4 p-5">
        {/* Påstand */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Påstand
          </label>
          <textarea
            value={statement}
            onChange={(e) => onStatementChange(e.target.value)}
            placeholder="Skriv en påstand..."
            className="min-h-16 w-full resize-none rounded-xl border-2 border-input bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:ring-3 focus:ring-primary/20"
          />
        </div>

        {/* Fasit */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fasit
          </label>
          <div className="flex gap-2">
            {fasitOptions.map((option) => (
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
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Forklaring
          </label>
          <textarea
            value={explanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            placeholder="Forklar hvorfor svaret er riktig..."
            className="min-h-16 w-full resize-none rounded-xl border-2 border-input bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:ring-3 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}

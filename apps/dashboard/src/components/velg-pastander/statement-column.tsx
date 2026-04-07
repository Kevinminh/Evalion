import { cn } from "@workspace/ui/lib/utils";

interface Statement {
  id: string;
  text: string;
  fasit: string;
  explanation: string;
}

export function StatementColumn({
  title,
  statements,
  selected,
  onToggle,
  headerBg,
  headerText,
  selectedBorder,
  selectedGlow,
  borderTopColor,
}: {
  title: string;
  statements: Statement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  headerBg: string;
  headerText: string;
  selectedBorder: string;
  selectedGlow: string;
  borderTopColor: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border-[1.5px] border-border bg-card p-4",
        "border-t-4",
        borderTopColor,
      )}
    >
      <div
        className={cn(
          "mb-4 rounded-xl px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider",
          headerBg,
          headerText,
        )}
      >
        {title}
      </div>
      <div className="space-y-3">
        {statements.map((stmt) => {
          const isSelected = selected.has(stmt.id);
          return (
            <button
              key={stmt.id}
              onClick={() => onToggle(stmt.id)}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left text-sm leading-relaxed transition-all",
                isSelected
                  ? `${selectedBorder} ${selectedGlow} bg-card`
                  : "border-border bg-muted/30 hover:border-muted-foreground/30 hover:bg-muted/60",
              )}
            >
              {stmt.text}
            </button>
          );
        })}
        {statements.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Ingen påstander i denne kategorien
          </p>
        )}
      </div>
    </div>
  );
}

import { cn } from "@workspace/ui/lib/utils";

interface Statement {
  id: string;
  text: string;
  fasit: string;
  explanation: string;
}

export interface StatementColumnConfig {
  title: string;
  headerBg: string;
  headerText: string;
  headerBorderBottom: string;
  selectedBorder: string;
  selectedRing: string;
}

export function StatementColumn({
  title,
  statements,
  selected,
  onToggle,
  headerBg,
  headerText,
  headerBorderBottom,
  selectedBorder,
  selectedRing,
}: StatementColumnConfig & {
  statements: Statement[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 bg-card shadow-sm">
      <div
        className={cn(
          "flex items-center justify-center border-b-[3px] px-6 py-4 text-base font-extrabold",
          headerBg,
          headerText,
          headerBorderBottom,
        )}
      >
        {title}
      </div>
      <div className="flex flex-col gap-3 p-4">
        {statements.map((stmt) => {
          const isSelected = selected.has(stmt.id);
          return (
            <button
              key={stmt.id}
              onClick={() => onToggle(stmt.id)}
              className={cn(
                "cursor-pointer rounded-xl border-[1.5px] px-4 py-3.5 text-left text-sm leading-normal text-foreground transition-all",
                isSelected
                  ? cn("bg-card", selectedBorder, selectedRing)
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100",
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

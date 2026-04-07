import { cn } from "@workspace/ui/lib/utils";

export function SkeletonColumn({ title, headerBg, headerText, borderTopColor }: {
  title: string;
  headerBg: string;
  headerText: string;
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
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl border-2 border-border bg-muted/30 p-4">
            <div className="mb-2 h-3 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

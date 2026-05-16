import { cn } from "@workspace/ui/lib/utils";

export function SkeletonColumn({
  title,
  headerBg,
  headerText,
  headerBorderBottom,
}: {
  title: string;
  headerBg: string;
  headerText: string;
  headerBorderBottom: string;
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
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl border-[1.5px] border-neutral-200 bg-neutral-50 px-4 py-3.5"
          >
            <div className="mb-2 h-3 w-4/5 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

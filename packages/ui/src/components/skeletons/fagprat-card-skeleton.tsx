import { Skeleton } from "../skeleton";

export function FagPratCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border-[1.5px] border-border bg-card p-6">
      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
      </div>
      {/* Title */}
      <Skeleton className="mb-2 h-6 w-3/4" />
      {/* Subtitle */}
      <Skeleton className="mb-5 h-4 w-24" />
      {/* Footer */}
      <div className="mt-auto space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="flex items-center gap-2 border-t border-border/50 pt-3">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

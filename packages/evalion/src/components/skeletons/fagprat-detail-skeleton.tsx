import { Skeleton } from "../skeleton";

export function FagPratDetailSkeleton() {
  return (
    <div className="max-w-[1100px]">
      {/* Back link */}
      <Skeleton className="mb-4 h-4 w-20" />
      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <Skeleton className="h-9 w-64" />
        <div className="flex shrink-0 items-center gap-3">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
        </div>
      </div>
      {/* Meta tags */}
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
      </div>
      {/* Concepts */}
      <Skeleton className="mb-2 h-3 w-28" />
      <div className="mb-8 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
      {/* Statements table */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

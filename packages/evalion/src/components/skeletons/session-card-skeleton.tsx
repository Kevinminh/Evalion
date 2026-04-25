import { Skeleton } from "../skeleton";

export function SessionCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5">
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      {/* Meta row */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      {/* Code badge */}
      <Skeleton className="mt-auto h-6 w-16 rounded-lg" />
    </div>
  );
}

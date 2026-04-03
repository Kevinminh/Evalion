import { Skeleton } from "../skeleton";

export function TeacherLobbySkeleton() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Top bar */}
      <Skeleton className="h-14 w-full" />

      <div className="flex flex-1 pt-16">
        {/* Left: QR panel */}
        <div className="w-[38%] min-w-[340px] max-w-[480px] p-4">
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-card p-8 shadow-lg">
            <Skeleton className="mb-2 h-16 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-16 w-56 rounded-xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="size-[130px] rounded-xl" />
          </div>
        </div>

        {/* Right: Student list area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-6">
            <div className="flex flex-wrap content-start gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

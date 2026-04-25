import { Skeleton } from "@workspace/ui/components/skeleton";

export function LiveStepSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <Skeleton className="h-14 w-full" />

      <div className="flex pt-16 pb-14">
        {/* Main content */}
        <main className="flex-1 px-8 py-8" style={{ marginRight: 340 }}>
          <div className="flex flex-col items-center gap-8 pt-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mx-auto h-20 w-full max-w-2xl rounded-2xl" />
            <Skeleton className="h-16 w-48 rounded-xl" />
          </div>
        </main>

        {/* Teacher panel */}
        <div className="fixed top-14 right-0 bottom-14 w-[340px] border-l border-border bg-card p-5">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-px w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-2.5 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <Skeleton className="fixed bottom-0 right-0 left-0 h-14" />
    </div>
  );
}

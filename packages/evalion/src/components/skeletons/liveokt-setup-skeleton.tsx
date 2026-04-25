import { Skeleton } from "@workspace/ui/components/skeleton";

export function LiveoktSetupSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <Skeleton className="h-14 w-full" />

      <div className="mx-auto max-w-[1100px] px-8 pt-24 pb-12">
        <Skeleton className="mb-8 h-9 w-64" />

        <div className="grid grid-cols-[1fr_340px] gap-8">
          {/* Left: Options */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>

          {/* Right: Summary panel */}
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

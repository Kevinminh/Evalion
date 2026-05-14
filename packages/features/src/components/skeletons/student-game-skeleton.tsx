import { Skeleton } from "@workspace/ui/components/skeleton";

export function StudentGameSkeleton() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-8">
      {/* Student header */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>

      {/* Main content */}
      <div className="flex w-full max-w-md flex-col items-center pt-8">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-24 rounded-xl" />
            <Skeleton className="h-12 w-24 rounded-xl" />
            <Skeleton className="h-12 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

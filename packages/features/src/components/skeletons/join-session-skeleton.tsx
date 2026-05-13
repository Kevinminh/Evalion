import { Skeleton } from "@workspace/ui/components/skeleton";

export function JoinSessionSkeleton() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="text-center">
            <Skeleton className="mx-auto mb-2 h-7 w-40" />
            <Skeleton className="mx-auto h-4 w-52" />
          </div>
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

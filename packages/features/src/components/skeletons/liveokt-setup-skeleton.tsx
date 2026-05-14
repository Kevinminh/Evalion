import { Skeleton } from "@workspace/ui/components/skeleton";

export function LiveoktSetupSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="fixed top-0 right-0 left-0 z-40 flex h-20 min-h-20 items-center justify-between border-b-[1.5px] border-[#EEEEEE] bg-white px-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-28" />
          <div className="h-8 w-[1.5px] bg-[#E0E0E0]" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 pt-20 pb-12 sm:px-8 sm:pt-24">
        <Skeleton className="mb-6 h-8 w-64 sm:mb-8 sm:h-9" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <div className="space-y-4">
            <div className="rounded-2xl border-[1.5px] border-l-4 border-primary/30 border-l-primary bg-primary/[0.02]">
              <OptionCardHeader />
              <div className="flex items-center gap-3 border-t border-border/50 px-5 py-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-[120px] rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl border-[1.5px] border-l-4 border-border border-l-border bg-card">
              <OptionCardHeader />
            </div>

            <div className="rounded-2xl border-[1.5px] border-l-4 border-primary/30 border-l-primary bg-primary/[0.02]">
              <OptionCardHeader />
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border-[1.5px] border-border bg-card p-6">
              <Skeleton className="mb-4 h-3 w-32" />
              <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                <Skeleton className="size-8 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionCardHeader() {
  return (
    <div className="flex items-start gap-4 p-5">
      <Skeleton className="size-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
    </div>
  );
}

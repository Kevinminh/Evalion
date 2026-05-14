import { Skeleton } from "@workspace/ui/components/skeleton";

const STUDENT_NAME_WIDTHS = ["w-16", "w-20", "w-24", "w-28", "w-20", "w-16"] as const;

export function TeacherLobbySkeleton() {
  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-bg-warm)]">
      <div className="fixed top-0 right-0 left-0 z-40 flex h-20 min-h-20 items-center justify-between border-b-[1.5px] border-[#EEEEEE] bg-white px-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-32" />
          <div className="h-7 w-[1.5px] bg-[#E0E0E0]" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-20 lg:flex-row">
        <div className="w-full p-4 lg:w-[42%] lg:min-w-[420px] lg:max-w-[560px]">
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-border bg-card p-6 shadow-lg sm:p-8">
            <Skeleton className="mb-2 h-16 w-32" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-16 w-64 rounded-xl" />
            <Skeleton className="h-5 w-20" />
            <div className="rounded-xl bg-white p-3">
              <Skeleton className="size-[130px] rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-wrap content-start gap-3">
              {STUDENT_NAME_WIDTHS.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card p-2 pr-3 shadow-xs"
                >
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <Skeleton className={`h-4 ${w}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between px-6 py-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

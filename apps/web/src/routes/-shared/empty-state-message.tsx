import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

export function EmptyStateMessage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center gap-2 bg-background px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

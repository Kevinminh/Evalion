import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface PanelCardProps {
  children: ReactNode;
  gap?: "2" | "3";
  className?: string;
}

export function PanelCard({ children, gap = "3", className }: PanelCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-white p-3 shadow-[var(--shadow-card-soft)]",
        gap === "2" ? "gap-2" : "gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

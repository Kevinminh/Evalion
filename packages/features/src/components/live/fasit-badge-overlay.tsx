import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

import type { Fasit } from "@workspace/api/types";

import { FasitBadge } from "./fasit-badge";

interface FasitBadgeOverlayProps {
  fasit: Fasit;
  show?: boolean;
  animated?: boolean;
  className?: string;
  children: ReactNode;
}

export function FasitBadgeOverlay({
  fasit,
  show = true,
  animated,
  className,
  children,
}: FasitBadgeOverlayProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {show && (
        <div className="absolute left-1/2 -top-1 z-10 -translate-x-1/2 -translate-y-[65%]">
          <FasitBadge fasit={fasit} animated={animated} size="lg" />
        </div>
      )}
      {children}
    </div>
  );
}

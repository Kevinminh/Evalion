import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface ComingSoonButtonProps {
  icon: ReactNode;
  ariaLabel: string;
  className?: string;
}

export function ComingSoonButton({ icon, ariaLabel, className }: ComingSoonButtonProps) {
  return (
    <button
      disabled
      title="Kommer snart"
      aria-label={ariaLabel}
      className={cn("rounded-lg p-1.5 text-muted-foreground/40", className)}
    >
      {icon}
    </button>
  );
}

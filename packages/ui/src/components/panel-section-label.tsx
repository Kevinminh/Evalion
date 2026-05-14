import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface PanelSectionLabelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Small uppercase label shown above a panel section (e.g. "NEDTELLING", "Resultat",
 * "Elevsvar – Første stemmerunde"). Matches the mockup's `.panel-section-label`
 * styling — `text-xs`, `font-bold`, `uppercase`, `tracking-[0.08em]`, ink-soft color.
 */
export function PanelSectionLabel({ children, className }: PanelSectionLabelProps) {
  return (
    <p
      className={cn(
        "shrink-0 px-1 text-xs font-bold tracking-[0.08em] text-[var(--color-text-ink-soft)] uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

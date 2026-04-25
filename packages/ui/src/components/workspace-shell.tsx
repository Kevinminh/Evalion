import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

interface WorkspaceShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Top-level layout container for workspace routes (lag-pastander, velg-pastander, etc.).
 * Applies the shared light gradient background, body font, and design-token scope
 * (primary/secondary/neutrals/text/sant-usant-delvis) defined in `globals.css`.
 */
export function WorkspaceShell({ children, className }: WorkspaceShellProps) {
  return <div className={cn("workspace-shell", className)}>{children}</div>;
}

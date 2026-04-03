import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

interface OptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function OptionCard({
  icon,
  title,
  description,
  enabled,
  onToggle,
  children,
}: OptionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-[1.5px] bg-card transition-all",
        enabled ? "border-primary/30 bg-primary/[0.02]" : "border-border",
      )}
      style={{ borderLeftWidth: 4, borderLeftColor: enabled ? "var(--primary)" : "var(--border)" }}
    >
      <div className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            enabled ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
              enabled && "translate-x-5",
            )}
          />
        </button>
      </div>
      {enabled && children && <div className="border-t border-border/50 px-5 py-4">{children}</div>}
    </div>
  );
}

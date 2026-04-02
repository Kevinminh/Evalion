import { cn } from "@workspace/ui/lib/utils";
import { GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

interface ProfessorProps {
  size?: "xs" | "sm" | "lg";
  text?: ReactNode;
  label?: string;
  animate?: boolean;
  className?: string;
}

const sizeConfig = {
  xs: { container: "size-12", icon: "size-5" },
  sm: { container: "size-24", icon: "size-10" },
  lg: { container: "size-[220px]", icon: "size-20" },
};

export function Professor({
  size = "sm",
  text,
  label,
  animate = true,
  className,
}: ProfessorProps) {
  const { container, icon } = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary/10",
            container,
          )}
        >
          <GraduationCap className={cn("text-primary", icon)} />
        </div>
        {label && (
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        )}
      </div>
      {text && (
        <div className="relative flex items-center">
          <div
            className="absolute -left-2 size-0 border-8 border-transparent border-r-white"
            style={{ filter: "drop-shadow(-1px 0 0 var(--border))" }}
          />
          <div
            className={cn(
              "rounded-2xl border border-border bg-white px-5 py-4",
              animate && "animate-[fadeInUp_0.5s_ease_0.2s_both]",
            )}
          >
            <p className="text-base font-medium italic text-foreground/80">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

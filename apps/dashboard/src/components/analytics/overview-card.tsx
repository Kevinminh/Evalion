import type { ReactNode } from "react";

interface OverviewCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function OverviewCard({ icon, label, value }: OverviewCardProps) {
  return (
    <div className="rounded-2xl border-[1.5px] border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xl font-extrabold text-foreground">{value}</div>
    </div>
  );
}

import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
}

interface PanelTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children: ReactNode;
}

export function PanelTabs({ tabs, activeTab, onTabChange, children }: PanelTabsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg bg-neutral-200 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

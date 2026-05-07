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
    <div className="flex h-full min-h-0 flex-col gap-2.5">
      <div className="flex shrink-0 gap-[3px] rounded-xl bg-[#EEEEEE] p-[3px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex-1 rounded-md px-2 py-2 text-center text-xs font-bold transition-all",
              activeTab === tab.key
                ? "bg-white text-[#212121] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                : "text-[#9E9E9E] hover:text-[#616161]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

import { Stepper } from "@workspace/ui/components/stepper";
import { cn } from "@workspace/ui/lib/utils";
import { Users, UsersRound } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";

import { MAX_GROUP_COUNT, MIN_GROUP_COUNT } from "@/lib/constants";

interface GroupingSelectorProps {
  groupsEnabled: boolean;
  onGroupsEnabledChange: (enabled: boolean) => void;
  groupCount: number;
  onGroupCountChange: (count: number) => void;
}

export function GroupingSelector({
  groupsEnabled,
  onGroupsEnabledChange,
  groupCount,
  onGroupCountChange,
}: GroupingSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Gruppering" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Tile
        selected={!groupsEnabled}
        onSelect={() => onGroupsEnabledChange(false)}
        icon={<Users className="size-5" />}
        title="Ingen gruppering"
        description="Gjennomfør aktiviteten sånn som elevene sitter. En alternativ variant er at elevene får gå rundt på steg 2 og 4."
      />
      <Tile
        selected={groupsEnabled}
        onSelect={() => onGroupsEnabledChange(true)}
        icon={<UsersRound className="size-5" />}
        title="Grupper"
        description="Del elevene inn i definerte eller tilfeldige grupper. Du kan endre gruppene mellom hver påstand om du vil det."
      >
        <div className={cn("transition-opacity", !groupsEnabled && "opacity-60")}>
          <Stepper
            label="Antall grupper"
            value={groupCount}
            min={MIN_GROUP_COUNT}
            max={MAX_GROUP_COUNT}
            onChange={onGroupCountChange}
          />
        </div>
      </Tile>
    </div>
  );
}

interface TileProps {
  selected: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

function Tile({ selected, onSelect, icon, title, description, children }: TileProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex cursor-pointer flex-col gap-3 rounded-2xl border-[1.5px] p-5 text-left transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
        selected
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-border bg-card hover:border-primary/20 hover:bg-primary/[0.02]",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

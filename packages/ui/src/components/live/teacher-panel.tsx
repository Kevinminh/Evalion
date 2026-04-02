import { cn } from "@workspace/ui/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState, type ReactNode } from "react";

interface TeacherPanelProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function TeacherPanel({ children, defaultOpen = true }: TeacherPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-20 z-30 rounded-l-lg border border-r-0 border-border bg-card p-2 text-muted-foreground shadow-sm transition-all hover:bg-muted"
        style={{ right: open ? "340px" : "0px" }}
      >
        {open ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
      </button>
      <div
        className={cn(
          "fixed right-0 top-16 bottom-14 z-20 w-[340px] overflow-y-auto border-l bg-card transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-5">{children}</div>
      </div>
    </>
  );
}

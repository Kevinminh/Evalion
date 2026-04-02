import { X } from "lucide-react";

interface SessionTopBarProps {
  title: string;
  onExit?: () => void;
  children?: React.ReactNode;
}

export function SessionTopBar({ title, onExit, children }: SessionTopBarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Evalion" className="h-8 object-contain" />
        <div className="h-6 w-px bg-border" />
        <span className="text-sm font-bold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {onExit && (
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-destructive/30 px-4 py-2 text-sm font-bold text-destructive transition-all hover:bg-destructive/10"
          >
            <X className="size-4" />
            Avslutt
          </button>
        )}
      </div>
    </div>
  );
}

import { X } from "lucide-react";

interface SessionTopBarProps {
  title: string;
  onExit?: () => void;
  center?: React.ReactNode;
  children?: React.ReactNode;
}

export function SessionTopBar({ title, onExit, center, children }: SessionTopBarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b bg-card px-3 sm:h-16 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <img src="/fagprat-logo.png" alt="FagPrat" className="h-8 object-contain sm:h-10" />
        <div className="hidden h-6 w-px bg-border sm:block" />
        <span className="hidden text-sm font-bold text-foreground sm:inline">{title}</span>
      </div>
      {center && <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">{center}</div>}
      <div className="flex items-center gap-2 sm:gap-3">
        {children}
        {onExit && (
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive transition-all hover:bg-destructive/10 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          >
            <X className="size-4" />
            <span className="hidden sm:inline">Avslutt</span>
          </button>
        )}
      </div>
    </div>
  );
}

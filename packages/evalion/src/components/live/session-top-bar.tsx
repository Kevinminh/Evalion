import { X } from "lucide-react";

interface SessionTopBarProps {
  title: string;
  onExit?: () => void;
  center?: React.ReactNode;
  children?: React.ReactNode;
}

export function SessionTopBar({ title, onExit, center, children }: SessionTopBarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex h-20 min-h-20 items-center justify-between border-b-[1.5px] border-[#EEEEEE] bg-white px-8">
      <div className="flex items-center gap-4">
        <img src="/fagprat-logo.png" alt="FagPrat" className="h-12 object-contain" />
        <div className="h-8 w-[1.5px] bg-[#E0E0E0]" />
        <span className="text-lg font-bold text-[#212121]">{title}</span>
      </div>
      {center && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto">{center}</div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {children}
        {onExit && (
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-full bg-[#EF5350] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#D32F2F]"
          >
            <X className="size-[18px]" strokeWidth={2} />
            Avslutt aktiviteten
          </button>
        )}
      </div>
    </div>
  );
}

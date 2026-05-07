import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border-[1.5px] border-[#E0E0E0] bg-transparent px-4 py-2 text-sm font-semibold text-[#616161] transition-all hover:border-[#A3A39A] hover:bg-white/60 hover:text-[#212121]"
    >
      <ChevronLeft className="size-4" strokeWidth={2.5} />
      Alle påstander
    </button>
  );
}

import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
    >
      <ChevronLeft className="size-4" />
      Alle påstander
    </button>
  );
}

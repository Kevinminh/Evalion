import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

const VOTE_PILL: Record<Fasit, { label: string; bg: string }> = {
  sant: { label: "Sant", bg: "#4CAF50" },
  delvis: { label: "Delvis sant", bg: "#FF9800" },
  usant: { label: "Usant", bg: "#EF5350" },
};

interface BegrunnelseCardProps {
  text: string;
  studentName?: string;
  vote?: Fasit;
  highlighted?: boolean;
  className?: string;
}

export function BegrunnelseCard({
  text,
  studentName,
  vote,
  highlighted = false,
  className,
}: BegrunnelseCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-l-none rounded-r-xl border-l-[3px] bg-[#F3EEFF] px-5 py-4 text-base font-medium leading-relaxed text-[#212121]",
        className,
      )}
      style={{
        borderLeftColor: highlighted ? "#8554F6" : "#A37EFF",
      }}
    >
      {vote && (
        <span
          className="mb-2 inline-flex items-center rounded-full px-[9px] py-0.5 text-[11px] font-extrabold uppercase text-white"
          style={{ backgroundColor: VOTE_PILL[vote].bg, letterSpacing: "0.02em" }}
        >
          {VOTE_PILL[vote].label}
        </span>
      )}
      <p className="italic leading-relaxed text-[#212121]">«{text}»</p>
      {studentName && (
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#9E9E9E]">
          — {studentName}
        </p>
      )}
    </div>
  );
}

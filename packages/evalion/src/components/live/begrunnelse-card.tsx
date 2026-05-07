import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

const VOTE_PILL: Record<Fasit, { label: string; bg: string }> = {
  sant: { label: "Sant", bg: "bg-sant" },
  delvis: { label: "Delvis sant", bg: "bg-delvis" },
  usant: { label: "Usant", bg: "bg-usant" },
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
        "relative rounded-r-2xl border-l-[3px] p-4 pl-5 transition-shadow duration-300",
        highlighted
          ? "border-primary bg-primary/10 shadow-[0_0_0_3px_rgba(108,63,197,0.15)]"
          : "border-primary/40 bg-primary/[0.06] shadow-sm",
        className,
      )}
    >
      {vote && (
        <span
          className={cn(
            "mb-2 inline-flex rounded-full px-3 py-0.5 text-[11px] font-bold text-white",
            VOTE_PILL[vote].bg,
          )}
        >
          {VOTE_PILL[vote].label}
        </span>
      )}
      <p className="text-sm italic leading-relaxed text-foreground/85">{text}</p>
      {studentName && (
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          — {studentName}
        </p>
      )}
    </div>
  );
}

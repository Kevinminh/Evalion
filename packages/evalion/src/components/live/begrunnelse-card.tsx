import type { Fasit } from "@workspace/evalion/lib/types";
import { cn } from "@workspace/ui/lib/utils";

const VOTE_PILL: Record<Fasit, { label: string; bg: string }> = {
  sant: { label: "Sant", bg: "var(--color-fasit-correct-text)" },
  delvis: { label: "Delvis sant", bg: "var(--color-vote-delvis)" },
  usant: { label: "Usant", bg: "var(--color-error)" },
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
        "relative rounded-l-none rounded-r-xl border-l-[3px] bg-[var(--color-highlight-strip-bg)] px-5 py-4 text-base font-medium leading-relaxed text-[var(--color-text-ink-strong)]",
        className,
      )}
      style={{
        borderLeftColor: highlighted ? "var(--color-purple-400)" : "var(--color-highlight-strip)",
      }}
    >
      {vote && (
        <span
          className="mb-2 inline-flex items-center rounded-full px-[9px] py-0.5 text-[11px] font-extrabold uppercase tracking-[0.02em] text-white"
          style={{ backgroundColor: VOTE_PILL[vote].bg }}
        >
          {VOTE_PILL[vote].label}
        </span>
      )}
      <p className="italic leading-relaxed text-[var(--color-text-ink-strong)]">«{text}»</p>
      {studentName && (
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-ink-faint)]">
          — {studentName}
        </p>
      )}
    </div>
  );
}

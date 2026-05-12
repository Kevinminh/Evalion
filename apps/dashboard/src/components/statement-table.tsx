import type { Fasit } from "@workspace/evalion/lib/types";

import type { FagPratStatement } from "@/lib/types";

const FASIT_CONFIG: Record<Fasit, { label: string; className: string }> = {
  sant: { label: "Sant", className: "bg-sant-bg text-sant" },
  usant: { label: "Usant", className: "bg-usant-bg text-usant" },
  delvis: { label: "Delvis sant", className: "bg-delvis-bg text-[#E65100]" },
};

function PreviewFasitBadge({ fasit }: { fasit: Fasit }) {
  const { label, className } = FASIT_CONFIG[fasit];
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

export function StatementTable({ statements }: { statements: FagPratStatement[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-border bg-card shadow-sm">
      <div className="grid grid-cols-[2fr_120px_3fr] gap-4 border-b-[1.5px] border-border bg-muted/50 px-6 py-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Påstand
        </span>
        <span className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Fasit
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Forklaring
        </span>
      </div>
      {statements.map((statement, index) => (
        <div
          key={index}
          className="grid grid-cols-[2fr_120px_3fr] items-center gap-4 border-b border-border/50 px-6 py-5 last:border-b-0"
        >
          <div className="text-base leading-normal text-foreground">{statement.text}</div>
          <div className="flex justify-center">
            <PreviewFasitBadge fasit={statement.fasit} />
          </div>
          <div className="text-base leading-normal text-muted-foreground">
            {statement.explanation}
          </div>
        </div>
      ))}
    </div>
  );
}

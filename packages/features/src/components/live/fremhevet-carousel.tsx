import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import type { Fasit } from "@workspace/features/lib/types";
import { Smartphone } from "lucide-react";
import { useState } from "react";

import { BegrunnelseCard } from "./begrunnelse-card";
import { BegrunnelseNav } from "./begrunnelse-nav";

const PAGE_SIZE = 3;

interface FremhevetItem {
  id: Id<"sessionBegrunnelser">;
  text: string;
  vote?: Fasit;
}

interface FremhevetCarouselProps {
  items: FremhevetItem[];
  onDismiss: (id: Id<"sessionBegrunnelser">) => void;
}

export function FremhevetCarousel({ items, onDismiss }: FremhevetCarouselProps) {
  const [page, setPage] = useState(0);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center">
        <Smartphone className="size-9 text-[var(--color-neutral-400)]" strokeWidth={1.5} />
        <p className="max-w-[240px] text-sm leading-relaxed text-[var(--color-text-ink-faint)]">
          Trykk på begrunnelser i live-statistikken på din eksterne enhet for å fremheve dem her.
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);
  const rangeEnd = Math.min(start + PAGE_SIZE, items.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-highlight-strip-text)]">
          Fremhevet
        </p>
        {items.length > PAGE_SIZE && (
          <BegrunnelseNav
            current={safePage + 1}
            total={totalPages}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            label={`${start + 1}–${rangeEnd} av ${items.length}`}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        {visible.map((item) => (
          <BegrunnelseCard
            key={item.id}
            text={item.text}
            vote={item.vote}
            highlighted
            onDismiss={() => onDismiss(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

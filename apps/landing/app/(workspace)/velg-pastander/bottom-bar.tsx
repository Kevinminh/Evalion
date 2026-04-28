"use client";

type Props = {
  totalSelected: number;
  submitting: boolean;
  onAdd: () => void;
};

export function BottomBar({ totalSelected, submitting, onAdd }: Props) {
  const addLabel =
    totalSelected > 0
      ? `Legg til ${totalSelected} påstand${totalSelected === 1 ? "" : "er"}`
      : "Legg til påstander";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t-[1.5px] border-neutral-200 bg-neutral-0 px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] sm:px-8 sm:py-4">
      <div className="mx-auto flex max-w-[900px] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/assets/Reddi.png" alt="Reddi" className="size-11 object-contain" />
          <span className="hidden text-[15px] font-bold text-ink-secondary sm:inline">
            Laget av Reddi
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={totalSelected === 0 || submitting}
          className={
            "inline-flex items-center gap-2 rounded-[var(--workspace-radius-xl)] border-none px-4 py-2.5 font-[var(--font-family-body)] text-sm font-bold text-white transition-all duration-150 disabled:opacity-70 sm:px-6 sm:py-3 " +
            (totalSelected > 0
              ? "cursor-pointer bg-purple-500 shadow-[0_4px_0_var(--color-purple-700)] hover:not-disabled:-translate-y-0.5 hover:not-disabled:bg-purple-400 hover:not-disabled:shadow-[0_6px_0_var(--color-purple-700),var(--shadow-glow-primary)] active:not-disabled:translate-y-0.5 active:not-disabled:shadow-[0_2px_0_var(--color-purple-700)]"
              : "cursor-not-allowed bg-neutral-300")
          }
        >
          <span>{submitting ? "Legger til …" : addLabel}</span>
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

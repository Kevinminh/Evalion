import type { FagPratType } from "@/lib/types";

export function TypeIcon({ type }: { type: FagPratType }) {
  if (type === "intro") {
    return (
      <span className="fp-card-forkunnskap intro">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="22" x2="12" y2="11" />
          <path d="M12 15c-2-2-6-2-7-1s0 4 3 5" />
          <path d="M12 12c2-2 6-2 7-1s0 4-3 5" />
          <line x1="4" y1="22" x2="20" y2="22" />
        </svg>
      </span>
    );
  }
  return (
    <span className="fp-card-forkunnskap summary">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </span>
  );
}

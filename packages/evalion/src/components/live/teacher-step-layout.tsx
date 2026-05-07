import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface TeacherStepLayoutProps {
  /** Row pinned to the top of the available height (back-button + counters). */
  top?: ReactNode;
  /** Primary content — usually the StatementCard. */
  statement?: ReactNode;
  /** Secondary content — usually the Professor. */
  professor?: ReactNode;
  /** Anything appended below the professor (e.g. group-members in step 2). */
  extras?: ReactNode;
  className?: string;
}

/**
 * Mirrors the demo mock's `.student-area` flex distribution exactly:
 *   top → spacer(1) → statement → spacer(2) → professor → spacer(1.5) → extras
 *
 * Padding matches `.student-area { padding: var(--space-5) var(--space-8); }`.
 */
export function TeacherStepLayout({
  top,
  statement,
  professor,
  extras,
  className,
}: TeacherStepLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col items-center px-8 py-5",
        className,
      )}
    >
      {top && <div className="w-full">{top}</div>}
      <div className="flex-1" />
      {statement && <div className="w-full max-w-[760px]">{statement}</div>}
      <div className="flex-[2]" />
      {professor && <div className="w-full">{professor}</div>}
      {extras && (
        <>
          <div className="flex-1" />
          <div className="w-full">{extras}</div>
        </>
      )}
      <div className="flex-[1.5]" />
    </div>
  );
}

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
 * Mirrors the demo mock's `.student-area` flex distribution:
 *   top → spacer(1) → statement → spacer(2) → professor → spacer(1.5) → extras
 *
 * On phone (< sm) the spacers collapse to fixed gaps so the layout doesn't
 * spread thin on narrow viewports.
 */
export function TeacherStepLayout({
  top,
  statement,
  professor,
  extras,
  className,
}: TeacherStepLayoutProps) {
  return (
    <div className={cn("flex h-full w-full flex-col items-center", className)}>
      {top && <div className="w-full">{top}</div>}
      <div className="hidden sm:block sm:flex-1" />
      {statement && <div className="w-full max-w-3xl">{statement}</div>}
      <div className="my-6 hidden sm:my-0 sm:block sm:flex-[2]" />
      {!statement && professor && <div className="my-6 sm:my-0" />}
      {professor && <div className="w-full">{professor}</div>}
      {extras && (
        <>
          <div className="my-4 sm:my-0 sm:flex-1" />
          <div className="w-full">{extras}</div>
        </>
      )}
      <div className="hidden sm:block sm:flex-[1.5]" />
    </div>
  );
}

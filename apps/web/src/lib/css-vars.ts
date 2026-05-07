import type { CSSProperties } from "react";

// React's CSSProperties type rejects custom properties (--foo) by design.
// Centralize the single sanctioned cast here so callsites stay clean.
export function cssVars(vars: Record<`--${string}`, string | number | undefined>): CSSProperties {
  // oxlint-disable-next-line typescript/consistent-type-assertions
  return vars as CSSProperties;
}

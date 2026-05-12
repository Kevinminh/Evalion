import type { CSSProperties } from "react";

// React's CSSProperties intentionally omits an index signature for CSS custom
// properties. Augment it once here so `style={{ "--foo": 1 }}` typechecks
// everywhere without casts at the callsite.
declare module "react" {
  interface CSSProperties {
    [variable: `--${string}`]: string | number | undefined;
  }
}

export function cssVars(vars: Record<`--${string}`, string | number | undefined>): CSSProperties {
  return vars;
}

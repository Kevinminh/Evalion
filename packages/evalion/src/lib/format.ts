/** Returns "–" (en dash) for nullish input so callers can pass values unguarded. */
export function formatDecimal1(value: number | null | undefined): string {
  if (value === null || value === undefined) return "–";
  return value.toFixed(1).replace(".", ",");
}

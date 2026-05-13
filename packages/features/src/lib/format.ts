/** Returns "–" (en dash) for nullish input so callers can pass values unguarded. */
export function formatDecimal1(value: number | null | undefined): string {
  if (value === null || value === undefined) return "–";
  return value.toFixed(1).replace(".", ",");
}

/** Integer percentage with a zero-denominator guard. */
export function percentage(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

/** Grade levels from barneskole through videregående (values sent to Reddi / PDF metadata). */
export const TRINN_OPTIONS: readonly string[] = [
  "1. klasse",
  "2. klasse",
  "3. klasse",
  "4. klasse",
  "5. klasse",
  "6. klasse",
  "7. klasse",
  "8. trinn",
  "9. trinn",
  "10. trinn",
  "VG1",
  "VG2",
  "VG3",
];

const LEGACY_TRINN: Readonly<Record<string, string>> = {
  "5. trinn": "5. klasse",
  "6. trinn": "6. klasse",
  "7. trinn": "7. klasse",
};

/** Maps older stored/URL values to current labels so selects stay controlled. */
export const normalizeTrinn = (trinn: string): string => {
  if (!trinn) return "";
  const candidate = LEGACY_TRINN[trinn] ?? trinn;
  return TRINN_OPTIONS.includes(candidate) ? candidate : "";
};

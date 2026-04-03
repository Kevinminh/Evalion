export const SUBJECT_OPTIONS = [
  { value: "Naturfag", label: "Naturfag" },
  { value: "Matematikk", label: "Matematikk" },
  { value: "Samfunnsfag", label: "Samfunnsfag" },
  { value: "Norsk", label: "Norsk" },
  { value: "Engelsk", label: "Engelsk" },
] as const;

export const LEVEL_OPTIONS = [
  { value: "8. trinn", label: "8. trinn" },
  { value: "9. trinn", label: "9. trinn" },
  { value: "10. trinn", label: "10. trinn" },
  { value: "VG1", label: "VG1" },
  { value: "VG2", label: "VG2" },
  { value: "VG3", label: "VG3" },
] as const;

/** Standard 3-column responsive card grid */
export const CARD_GRID_CLASS =
  "grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3";

/** Skeleton placeholder count for loading states */
export const SKELETON_COUNT = 6;

/** Shared label typography style */
export const LABEL_CLASS = "text-xs font-bold uppercase tracking-wider text-muted-foreground";

/** Shared textarea base style (compose with cn() and add min-h as needed) */
export const TEXTAREA_CLASS =
  "w-full resize-none rounded-xl border-2 border-input bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:ring-3 focus:ring-primary/20";

/** Group count bounds for live sessions */
export const DEFAULT_GROUP_COUNT = 4;
export const MIN_GROUP_COUNT = 2;
export const MAX_GROUP_COUNT = 8;

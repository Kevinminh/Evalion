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

/** Group count bounds for live sessions */
export const DEFAULT_GROUP_COUNT = 4;
export const MIN_GROUP_COUNT = 2;
export const MAX_GROUP_COUNT = 8;

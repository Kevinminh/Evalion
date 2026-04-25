export {
  LEVEL_OPTIONS,
  SUBJECT_OPTIONS,
  DEFAULT_GROUP_COUNT,
  MIN_GROUP_COUNT,
  MAX_GROUP_COUNT,
} from "@workspace/evalion/lib/constants";

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

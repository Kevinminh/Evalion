import type { Fasit } from "./types";

// ── Vote labels & colors ────────────────────────────────────────────────────
export const VOTE_LABELS: Record<Fasit, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

export const VOTE_DOT_COLORS: Record<Fasit, string> = {
  sant: "bg-sant",
  usant: "bg-usant",
  delvis: "bg-delvis",
};

// ── Fasit configuration ─────────────────────────────────────────────────────
export const FASIT_OPTIONS = [
  {
    value: "sant" as const,
    label: "Sant",
    bg: "bg-sant-bg",
    text: "text-sant",
    border: "border-sant",
  },
  {
    value: "usant" as const,
    label: "Usant",
    bg: "bg-usant-bg",
    text: "text-usant",
    border: "border-usant",
  },
  {
    value: "delvis" as const,
    label: "Delvis sant",
    bg: "bg-delvis-bg",
    text: "text-delvis",
    border: "border-delvis",
  },
] as const;

export const FASIT_STYLES: Record<Fasit, string> = {
  sant: "bg-sant-bg text-sant",
  usant: "bg-usant-bg text-usant",
  delvis: "bg-delvis-bg text-delvis",
};

export const FASIT_LABELS: Record<Fasit, string> = {
  sant: "Sant",
  usant: "Usant",
  delvis: "Delvis sant",
};

export const FASIT_TEXT: Record<Fasit, string> = {
  sant: "sant",
  usant: "usant",
  delvis: "delvis sant",
};

export const FASIT_COLUMN_CONFIG: Record<
  Fasit,
  {
    title: string;
    headerBg: string;
    headerText: string;
    selectedBorder: string;
    selectedGlow: string;
    borderTopColor: string;
  }
> = {
  sant: {
    title: "Sant",
    headerBg: "bg-sant-bg",
    headerText: "text-sant",
    selectedBorder: "border-sant",
    selectedGlow: "shadow-[0_0_12px_color-mix(in_oklch,var(--sant)_25%,transparent)]",
    borderTopColor: "border-t-sant",
  },
  usant: {
    title: "Usant",
    headerBg: "bg-usant-bg",
    headerText: "text-usant",
    selectedBorder: "border-usant",
    selectedGlow: "shadow-[0_0_12px_color-mix(in_oklch,var(--usant)_25%,transparent)]",
    borderTopColor: "border-t-usant",
  },
  delvis: {
    title: "Delvis sant",
    headerBg: "bg-delvis-bg",
    headerText: "text-delvis",
    selectedBorder: "border-delvis",
    selectedGlow: "shadow-[0_0_12px_color-mix(in_oklch,var(--delvis)_25%,transparent)]",
    borderTopColor: "border-t-delvis",
  },
};

// ── Student vote buttons (3D style for student game) ───────────────────────
export const STUDENT_VOTE_OPTIONS = [
  { value: "sant" as const, label: "Sant", bg: "bg-sant", shadow: "shadow-[0_4px_0_#2E7D32]" },
  { value: "delvis" as const, label: "Delvis sant", bg: "bg-delvis", shadow: "shadow-[0_4px_0_#E65100]" },
  { value: "usant" as const, label: "Usant", bg: "bg-usant", shadow: "shadow-[0_4px_0_#B71C1C]" },
] as const;

// ── Confidence / rating circle colors (1-5 scale) ─────────────────────────
export const LEVEL_CIRCLE_COLORS: Record<number, { border: string; text: string }> = {
  1: { border: "border-red-500", text: "text-red-500" },
  2: { border: "border-orange-500", text: "text-orange-500" },
  3: { border: "border-yellow-500", text: "text-yellow-600" },
  4: { border: "border-green-400", text: "text-green-500" },
  5: { border: "border-green-700", text: "text-green-700" },
};

// ── Statement colors ────────────────────────────────────────────────────────
export const STATEMENT_COLORS = [
  { name: "yellow", bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-700" },
  { name: "blue", bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" },
  { name: "orange", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-700" },
  { name: "purple", bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700" },
  { name: "red", bg: "bg-red-100", border: "border-red-300", text: "text-red-700" },
] as const;

/** Hex variant of statement colors for use outside Tailwind (e.g. inline styles).
 * `text` is the teacher-card text color; `textStudent` is the slightly
 * different student-card text color. These mirror the demo HTML mockups
 * (`fagprat-steg0.html` / `demo-steg0-elev.html`). */
export const STATEMENT_COLORS_HEX = [
  { bg: "#FFFDE7", border: "#FFE082", text: "#8D6E00", textStudent: "#5D4037" },
  { bg: "#E3F1FC", border: "#90CAF9", text: "#2C5F8A", textStudent: "#1565C0" },
  { bg: "#FFF3E0", border: "#FFCC80", text: "#B35C00", textStudent: "#BF360C" },
  { bg: "#F3EEFF", border: "#CE93D8", text: "#6A1B9A", textStudent: "#6A1B9A" },
  { bg: "#FFEBEE", border: "#EF9A9A", text: "#C62828", textStudent: "#B71C1C" },
] as const;

/** Student card variants. Slightly warmer bg/border than the teacher set;
 *  matches `demo-steg0-elev.html` `.sv-card-*` classes. */
export const STATEMENT_COLORS_STUDENT_HEX = [
  { bg: "#FFF8E1", border: "#FFD54F", text: "#5D4037" },
  { bg: "#E8F4FD", border: "#90CAF9", text: "#1565C0" },
  { bg: "#FFF3E0", border: "#FFB74D", text: "#BF360C" },
  { bg: "#F3E5F5", border: "#CE93D8", text: "#6A1B9A" },
  { bg: "#FFEBEE", border: "#EF9A9A", text: "#B71C1C" },
] as const;

export function getStatementColor(index: number) {
  return STATEMENT_COLORS[index % STATEMENT_COLORS.length]!;
}

export function getStatementColorHex(index: number) {
  return STATEMENT_COLORS_HEX[index % STATEMENT_COLORS_HEX.length]!;
}

export function getStatementColorStudentHex(index: number) {
  return STATEMENT_COLORS_STUDENT_HEX[index % STATEMENT_COLORS_STUDENT_HEX.length]!;
}

// ── Domain options ──────────────────────────────────────────────────────────
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

// ── Live session group bounds ───────────────────────────────────────────────
// Backend mirrors these limits in packages/backend/convex/liveSessions.ts
// (see create, createGroups — hard-coded to match).
export const DEFAULT_GROUP_COUNT = 4;
export const MIN_GROUP_COUNT = 2;
export const MAX_GROUP_COUNT = 8;

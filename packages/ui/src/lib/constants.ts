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

// ── Statement colors ────────────────────────────────────────────────────────
export const STATEMENT_COLORS = [
  { name: "yellow", bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-700" },
  { name: "blue", bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" },
  { name: "orange", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-700" },
  { name: "purple", bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700" },
  { name: "red", bg: "bg-red-100", border: "border-red-300", text: "text-red-700" },
] as const;

/** Hex variant of statement colors for use outside Tailwind (e.g. inline styles) */
export const STATEMENT_COLORS_HEX = [
  { bg: "#FFFDE7", border: "#FFE082" },
  { bg: "#E3F1FC", border: "#90CAF9" },
  { bg: "#FFF3E0", border: "#FFCC80" },
  { bg: "#F3EEFF", border: "#CE93D8" },
  { bg: "#FFEBEE", border: "#EF9A9A" },
] as const;

export function getStatementColor(index: number) {
  return STATEMENT_COLORS[index % STATEMENT_COLORS.length]!;
}

export function getStatementColorHex(index: number) {
  return STATEMENT_COLORS_HEX[index % STATEMENT_COLORS_HEX.length]!;
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

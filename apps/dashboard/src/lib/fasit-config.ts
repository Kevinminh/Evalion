import type { Fasit } from "@/lib/types";

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

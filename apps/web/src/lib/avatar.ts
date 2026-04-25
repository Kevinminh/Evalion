const AVATAR_PASTELS = [
  "#E8D5F0",
  "#D6ECFA",
  "#FFE0B2",
  "#C8E6C9",
  "#FFCDD2",
  "#FFF3CD",
  "#B3E5FC",
  "#F0E68C",
  "#D1C4E9",
  "#F8BBD0",
];

export function pastelFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PASTELS[hash % AVATAR_PASTELS.length];
}

export const STATEMENT_COLORS = [
  { name: "yellow", bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-700" },
  { name: "blue", bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" },
  { name: "orange", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-700" },
  { name: "purple", bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700" },
  { name: "red", bg: "bg-red-100", border: "border-red-300", text: "text-red-700" },
] as const;

export function getStatementColor(index: number) {
  return STATEMENT_COLORS[index % STATEMENT_COLORS.length]!;
}

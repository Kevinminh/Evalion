import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";

const chartConfig = {
  count: {
    label: "Antall",
  },
  Sant: {
    label: "Sant",
    color: "var(--sant)",
  },
  Usant: {
    label: "Usant",
    color: "var(--usant)",
  },
  Delvis: {
    label: "Delvis",
    color: "var(--delvis)",
  },
} satisfies ChartConfig;

const COLORS = ["var(--sant)", "var(--usant)", "var(--delvis)"];

interface VoteChartProps {
  data: { sant: number; usant: number; delvis: number; total: number };
  label: string;
}

export function VoteChart({ data, label }: VoteChartProps) {
  const chartData = [
    { category: "Sant", count: data.sant },
    { category: "Usant", count: data.usant },
    { category: "Delvis", count: data.delvis },
  ];

  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={chartData[index]!.category} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-1 text-center text-xs text-muted-foreground">
        {data.total} {data.total === 1 ? "stemme" : "stemmer"}
      </div>
    </div>
  );
}

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";

const COLORS = [
  "var(--usant)",
  "var(--delvis)",
  "var(--chart-4)",
  "var(--chart-2)",
  "var(--sant)",
];

const chartConfig = {
  count: {
    label: "Antall",
  },
} satisfies ChartConfig;

interface RatingChartProps {
  distribution: { score: number; count: number }[];
  average: number;
}

export function AnalyticsRatingChart({ distribution, average }: RatingChartProps) {
  const chartData = distribution.map((d) => ({
    score: String(d.score),
    count: d.count,
  }));

  return (
    <div>
      <div className="mb-1">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Gjennomsnitt
        </div>
        <p className="text-3xl font-extrabold text-foreground">{average.toFixed(1)}</p>
      </div>
      <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid vertical={false} />
          <XAxis dataKey="score" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={chartData[index]!.score} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

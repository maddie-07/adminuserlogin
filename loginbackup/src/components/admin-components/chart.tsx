"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartProps = {
  chartData: Array<{ [key: string]: any }>;
  chartConfig: ChartConfig;
  dataKeys: { key1: string }; // Only key1 is needed for area chart
  chartType: "area";
  fillColors?: {
    key1Fill?: string;
    fillOpacity?: number;
    strokeColor?: string;
  };
};

export function Chart({
  chartData,
  chartConfig,
  dataKeys,
  chartType,
  fillColors = {}, // Default values for fill parameters
}: ChartProps) {
  const {
    key1Fill = "var(--color-desktop)",
    fillOpacity = 0.4,
    strokeColor = "var(--color-desktop)",
  } = fillColors;

  if (chartType !== "area") {
    return null; // Return null if the chart type is not "area"
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={true} />
        <XAxis
          dataKey="week" // Set to "week" for x-axis data
          tickLine={false}
          axisLine={true}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 5)} // Format week data
        />
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey={dataKeys.key1}
          type="linear"
          fill={key1Fill}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export type { ChartConfig };

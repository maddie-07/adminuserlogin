"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { Chart } from "@/components/admin-components/chart";
import { ChartConfig } from "@/components/ui/chart";

// Define the props for the ChartCard component
interface ChartCardProps {
  title: string;
  description: string;
  chartData: Array<{ week: string; issue: number }>; // Data format
  footerContent?: ReactNode;
}

// Default chart configuration
const defaultChartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

// ChartCard functional component
export function ChartCard({
  title,
  description,
  chartData,
  footerContent,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          chartData={chartData}
          chartConfig={defaultChartConfig}
          dataKeys={{ key1: "issue" }}
          chartType="area" // Always render area chart
          fillColors={{
            key1Fill: "var(--color-desktop)", // Default fill color
            fillOpacity: 0.6, // Default fill opacity
          }}
        />
      </CardContent>
      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
}

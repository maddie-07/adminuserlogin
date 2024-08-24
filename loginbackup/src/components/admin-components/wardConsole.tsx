"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface IssueData {
  date: string;
  issues: number;
}

interface OverviewData {
  date: string;
  [key: string]: number | string; // This allows additional properties to be of type number or string
}

interface WardIssuesProps {
  chartConfig: ChartConfig;
  wardData: Record<string, IssueData[]>;
  overviewData: OverviewData[];
}

export function WardIssuesComponent({
  chartConfig,
  wardData,
  overviewData,
}: WardIssuesProps) {
  const [activeSection, setActiveSection] = React.useState<string>("Overview");

  // Calculate total issues per ward
  const totalIssues = React.useMemo(() => {
    return Object.keys(wardData).reduce((totals, ward) => {
      totals[ward] = wardData[ward].reduce((acc, curr) => acc + curr.issues, 0);
      return totals;
    }, {} as Record<string, number>);
  }, [wardData]);

  const isOverview = activeSection === "Overview";

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            {isOverview ? "Overview" : `${activeSection} Issues`}
          </CardTitle>
          <CardDescription>
            {isOverview
              ? "Showing issues for all wards"
              : `Issues in ${activeSection}`}
          </CardDescription>
        </div>
        <div className="flex">
          {["Overview", ...Object.keys(wardData)].map((section) => (
            <button
              key={section}
              data-active={activeSection === section}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveSection(section)}
            >
              <span className="text-xs text-muted-foreground">
                {section === "Overview" ? "All Wards" : section}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {section === "Overview"
                  ? "Overview"
                  : totalIssues[section]?.toLocaleString() || "0"}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {isOverview ? (
            <AreaChart
              data={overviewData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="issues"
                    labelFormatter={(value) => value}
                  />
                }
              />
              {Object.keys(overviewData[0] || {})
                .filter((key) => key !== "date")
                .map((wardKey, index) => (
                  <Area
                    key={index}
                    type="monotone"
                    dataKey={wardKey}
                    stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
            </AreaChart>
          ) : (
            <BarChart
              data={wardData[activeSection]}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="issues"
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey="issues"
                fill={`hsl(var(--chart-${
                  Object.keys(wardData).indexOf(activeSection) + 1
                }))`}
              />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

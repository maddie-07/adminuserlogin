"use client";
import React, { useEffect, useState } from "react";
import { type ChartConfig } from "@/components/ui/chart";
import { WardIssuesComponent } from "@/components/admin-components/wardConsole";
import { useParams } from "next/navigation";

// Define the type for OverviewData
type OverviewData = {
  date: string;
  [key: string]: number | string;
};

// Define the type for WardData
type WardData = Record<string, { date: string; issues: number }[]>;

// Define type for chart items
type ChartItem = {
  label: string;
  color: string;
};

// Define the available colors
const availableColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Function to create chart config dynamically
function createChartConfig(wardNames: string[]): ChartConfig {
  const config: ChartConfig = {};

  wardNames.forEach((wardName, index) => {
    config[`item${index + 1}`] = {
      label: wardName,
      color: availableColors[index % availableColors.length], // Ensure unique colors
    };
  });

  return config;
}

// Function to generate overview data dynamically based on wardData
function generateOverviewData(wardData: WardData): OverviewData[] {
  // Create a map to aggregate issues by date for each ward
  const dateMap: Record<string, Record<string, number>> = {};

  // Create a set to track all unique dates
  const dateSet = new Set<string>();

  // Aggregate issues by date for each ward
  Object.entries(wardData).forEach(([wardName, data]) => {
    data.forEach(({ date, issues }) => {
      if (!dateMap[date]) {
        dateMap[date] = {};
      }
      dateMap[date][wardName] = issues;
      dateSet.add(date); // Add the date to the set of unique dates
    });
  });

  // Convert the aggregated data to the desired format
  return Array.from(dateSet).map((date) => {
    // Ensure each date includes entries for all wards, with 0 issues if none were reported
    const issues = Object.keys(wardData).reduce((acc, wardName) => {
      acc[wardName] = dateMap[date]?.[wardName] || 0;
      return acc;
    }, {} as Record<string, number>);

    return {
      date,
      ...issues,
    };
  });
}

const SettingsPage = () => {
  const [wardData, setWardData] = useState<WardData>({});
  const [overviewData, setOverviewData] = useState<OverviewData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const params = useParams();
  const admin_id = params?.admin_id as string | undefined;

  useEffect(() => {
    // Fetch data from the API
    const fetchWardData = async () => {
      try {
        const response = await fetch(`/api/admin/wards/${admin_id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);

        // Set wardData from server response
        setWardData(data.wardData);

        // Generate overviewData dynamically using the provided function
        const generatedOverviewData = generateOverviewData(data.wardData);
        setOverviewData(generatedOverviewData);
        console.log(generatedOverviewData);

        // Create chart configuration dynamically
        const wardNames = Object.keys(data.wardData);
        const generatedChartConfig = createChartConfig(wardNames);
        setChartConfig(generatedChartConfig);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (admin_id) {
      fetchWardData();
    }
  }, [admin_id]); // Add admin_id as a dependency to re-fetch if it changes

  return (
    <div>
      <div className="font-bold text-2xl">Ward Stats</div>
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Ward Issues Dashboard</h1>
          <WardIssuesComponent
            chartConfig={chartConfig}
            wardData={wardData}
            overviewData={overviewData}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

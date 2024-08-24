"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ChartCard } from "@/components/admin-components/ChartCard";
import RankedIssue from "@/components/admin-components/RankedIssue";
import { Condiment } from "next/font/google";

const Dashboard = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [topIssues, setTopIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const params = useParams();
   const admin_id = params?.admin_id as string | undefined; // Get the dynamic route parameter

  useEffect(() => {
    const fetchData = async () => {
      if (!admin_id) return;

      try {
        const res = await fetch(`/api/admin/dashboard/${admin_id}`); // Fetch from the API
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        console.log(data);

        setWards(data.wards || []);
        setTopIssues(data.topIssues || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin_id]);

  if (loading) {
    return <div>Loading...</div>; // You can also use a spinner or a loading component
  }

  return (
    <div className="m-3 h-full flex flex-col">
      <div className="font-bold text-2xl">Hello Admin</div>
      <Separator />
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="flex items-start justify-center gap-5 flex-wrap m-3">
          {wards.map((ward, index) => (
            <ChartCard
              key={index}
              title={ward.title}
              description={ward.description}
              chartData={ward.chartData}
            />
          ))}
        </div>
        <Separator className="m-5" />
        <div className="m-7">
          <div className="font-bold text-2xl">Top Issues</div>
          {topIssues.map((issue, index) => (
            <RankedIssue
              key={index}
              rank={issue.rank}
              title={issue.title}
              description={issue.description}
              wardName={issue.wardName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

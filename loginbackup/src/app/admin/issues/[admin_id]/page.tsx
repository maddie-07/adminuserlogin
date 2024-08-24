"use client";
import React, { useEffect, useState } from "react";
import IssueCard from "@/components/admin-components/IssueCard";
import { useParams } from "next/navigation";

interface Issue {
  id: number;
  title: string;
  description: string;
  ward: string;
  location: string;
  isResolved: boolean;
}

const ProfilePage = () => {
   const params = useParams();
   const admin_id = params?.admin_id as string | undefined; // Get the dynamic route parameter

  const [issues, setIssues] = useState<Issue[]>([]); // Specify the type of the issues array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin_id) {
      const fetchIssues = async () => {
        try {
          const response = await fetch(`/api/admin/issues/${admin_id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch issues");
          }
          const data = await response.json();
          setIssues(data.issues); // TypeScript now knows the structure of data.issues
        } catch (err:any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchIssues();
    } else {
      setLoading(false);
      setError("No admin_id provided");
    }
  }, [admin_id]);

  const handleClick = (issue_id: number) => {
    console.log(`Issue with ID ${issue_id} clicked`);
    // Handle the click event for the specific issue here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full h-full">
      <div className="font-bold text-2xl mb-4">Issues</div>
      <h1 className="mb-4">Here are the issues</h1>
      <div className="flex flex-wrap overflow-y-auto mt-4 w-fit justify-center max-h-[calc(100vh-10rem)]">
        {issues.map((issue) => (
          <div
            key={issue.id}
            onClick={() => handleClick(issue.id)}
            className="w-full md:w-1/2 p-2"
          >
            <IssueCard
              title={issue.title}
              description={issue.description}
              ward={issue.ward}
              location={issue.location}
              isResolved={issue.isResolved}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

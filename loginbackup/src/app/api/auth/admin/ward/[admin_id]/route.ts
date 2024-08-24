import { NextResponse } from "next/server";
import { doQuery } from "@/lib/db";

// Define the type for the structure of the admin details
type AdminDetails = {
  role: string;
  ward_id?: number;
  sarpanch_id?: number;
  mla_id?: number;
};

// Define the type for issues retrieved from the database
type Issue = {
  id: number;
  title: string;
  description: string;
  location: string;
  resolved: boolean;
  ward: string;
  created_at: Date;
};

// Define the type for the data structure that will hold the ward issues
type WardData = Record<string, { date: string; issues: number }[]>;

// Define the type for the overview data format
type OverviewData = {
  date: string;
  [key: string]: number | string;
}[];

// Function to generate overviewData in the desired format
function generateOverviewData(
  wardData: WardData
): OverviewData {
  const dateMap: Record<string, Record<string, number>> = {};

  Object.entries(wardData).forEach(([wardName, data]) => {
    data.forEach(({ date, issues }) => {
      if (!dateMap[date]) {
        dateMap[date] = {};
      }
      dateMap[date][wardName] = issues;
    });
  });

  return Object.entries(dateMap).map(([date, issues]) => ({
    date,
    ...issues,
  }));
}

// Helper function to fetch issues and generate response based on admin_id
const getIssuesByAdmin = async (adminId: number) => {
  const adminDetails = await doQuery<AdminDetails>(
    "SELECT role, ward_id, sarpanch_id, mla_id FROM admins WHERE id = $1",
    [adminId]
  );

  if (adminDetails.length === 0) {
    return { wardData: {}, overviewData: [] as OverviewData };
  }

  const { role, ward_id, sarpanch_id, mla_id } = adminDetails[0];
  let issuesQuery = "";
  let issuesParams: any[] = [];

  if (role === "Panch" && ward_id) {
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward, i.created_at
      FROM issues i
      JOIN wards w ON i.ward_id = w.id
      WHERE w.id = $1
    `;
    issuesParams = [ward_id];
  } else if (role === "Sarpanch") {
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward, i.created_at
      FROM issues i
      JOIN wards w ON i.ward_id = w.id
      WHERE w.id IN (
        SELECT ward_id
        FROM ward_panches
        WHERE admin_id IN (
          SELECT id
          FROM admins
          WHERE sarpanch_id = $1
        )
      )
    `;
    issuesParams = [adminId];
  } else if (role === "MLA") {
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward, i.created_at
      FROM issues i
      JOIN wards w ON i.ward_id = w.id
      WHERE w.id IN (
        SELECT w.id
        FROM wards w
        JOIN ward_panches wp ON w.id = wp.ward_id
        JOIN admins a ON wp.admin_id = a.id
        WHERE a.sarpanch_id IN (
          SELECT id
          FROM admins
          WHERE mla_id = $1
        )
        UNION
        SELECT w.id
        FROM wards w
        JOIN admins a ON w.id = a.ward_id
        WHERE a.mla_id = $1
      )
    `;
    issuesParams = [adminId];
  } else {
    return { wardData: {}, overviewData: [] as OverviewData };
  }

  const issues = await doQuery<Issue>(issuesQuery, issuesParams);

  const wardData: WardData = {};

  // Populate the wardData with issues
  issues.forEach((issue) => {
    const issueDate = new Date(issue.created_at).toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    if (!wardData[issue.ward]) {
      wardData[issue.ward] = [];
    }

    wardData[issue.ward].push({ date: issueDate, issues: 1 });
  });

  // Aggregate issues by date for each ward in wardData
  Object.keys(wardData).forEach((wardName) => {
    const aggregatedData: { [date: string]: number } = {};

    wardData[wardName].forEach(({ date, issues }) => {
      if (aggregatedData[date]) {
        aggregatedData[date] += issues;
      } else {
        aggregatedData[date] = issues;
      }
    });

    // Update the wardData to use the aggregated data
    wardData[wardName] = Object.entries(aggregatedData).map(([date, issues]) => ({
      date,
      issues,
    }));
  });

  // Generate overviewData
  const overviewData = generateOverviewData(wardData);
  

  return { wardData, overviewData };
};

// Next.js API route handler
export async function GET(
  request: Request,
  { params }: { params: { admin_id: string } }
) {
  const adminId = parseInt(params.admin_id, 10);

  if (isNaN(adminId) || adminId <= 0) {
    return NextResponse.json({ error: "Invalid admin_id parameter" }, { status: 400 });
  }

  try {
    const { wardData, overviewData } = await getIssuesByAdmin(adminId);
    return NextResponse.json({ wardData, overviewData });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { doQuery } from '@/lib/db';

// Helper function to fetch issues and generate response based on admin_id
const getIssuesByAdmin = async (adminId: number) => {
  const adminDetails = await doQuery<{ role: string; ward_id?: number; sarpanch_id?: number; mla_id?: number }>(
    'SELECT role, ward_id, sarpanch_id, mla_id FROM admins WHERE id = $1',
    [adminId]
  );

  if (adminDetails.length === 0) {
    return { wards: [], topIssues: [] };
  }

  const { role, ward_id, sarpanch_id, mla_id } = adminDetails[0];
  let issuesQuery = '';
  let issuesParams: any[] = [];

  if (role === 'Panch') {
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward, i.created_at
      FROM issues i
      JOIN wards w ON i.ward_id = w.id
      WHERE w.id = $1
    `;
    issuesParams = [ward_id];
  } else if (role === 'Sarpanch') {
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
  } else if (role === 'MLA') {
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
    return { wards: [], topIssues: [] };
  }

  const issues = await doQuery<{ id: number; title: string; description: string; location: string; resolved: boolean; ward: string; created_at: Date }>(
    issuesQuery,
    issuesParams
  );

  const wardsMap: { [ward: string]: { title: string; description: string; chartData: { week: string; issue: number }[] } } = {};
  const topIssues: { rank: number; title: string; description: string; wardName: string }[] = [];

  // Initialize the current month weeks
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const weeks: { [week: string]: number } = {};

  let startOfWeek = startDate;
  while (startOfWeek <= endDate) {
    const weekStart = startOfWeek.getDate();
    const weekLabel = `${startOfWeek.getDate().toString().padStart(2, '0')}/${(startOfWeek.getMonth() + 1).toString().padStart(2, '0')}`;
    weeks[weekLabel] = 0;
    startOfWeek.setDate(weekStart + 7); // Move to the start of the next week
  }

  issues.forEach(issue => {
    const issueDate = new Date(issue.created_at);
    const weekStart = new Date(issueDate.getFullYear(), issueDate.getMonth(), 1);
    while (weekStart <= issueDate) {
      const weekStartDate = weekStart.getDate();
      const weekLabel = `${weekStartDate.toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
      if (weekLabel in weeks) {
        weeks[weekLabel] += 1;
      }
      weekStart.setDate(weekStart.getDate() + 7); // Move to the start of the next week
    }

    if (!wardsMap[issue.ward]) {
      wardsMap[issue.ward] = {
        title: issue.ward,
        description: issue.location,
        chartData: Object.keys(weeks).map(week => ({ week, issue: 0 }))
      };
    }

    const ward = wardsMap[issue.ward];
    const weekLabel = Object.keys(weeks).find(label => {
      const weekDate = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${label.split('/')[0]}`);
      return issueDate >= weekDate && issueDate < new Date(weekDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    });
    if (weekLabel) {
      const weekIndex = ward.chartData.findIndex(data => data.week === weekLabel);
      if (weekIndex !== -1) {
        ward.chartData[weekIndex].issue += 1;
      }
    }
  });

  // Populate top issues
  issues.slice(0, 5).forEach((issue, index) => {
    topIssues.push({
      rank: index + 1,
      title: issue.title,
      description: issue.description,
      wardName: issue.ward
    });
  });

  // Convert wardsMap to an array
  const wards = Object.values(wardsMap);

  return { wards, topIssues };
};

// Next.js API route handler
export async function GET(
  request: Request,
  { params }: { params: { admin_id: string } }
) {
  const adminId = parseInt(params.admin_id, 10);

  if (isNaN(adminId) || adminId <= 0) {
    return NextResponse.json({ error: 'Invalid admin_id parameter' }, { status: 400 });
  }

  try {
    const { wards, topIssues } = await getIssuesByAdmin(adminId);
    return NextResponse.json({ wards, topIssues });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}
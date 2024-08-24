import { NextResponse } from 'next/server';
import { doQuery } from '@/lib/db';

// Helper function to fetch issues based on admin_id
const getIssuesByAdmin = async (adminId: number) => {
  // Query to fetch the role of the admin and their responsibilities
  const adminRole = await doQuery<{ role: string; ward_id: number; mla_id: number }>(
    'SELECT role, ward_id, mla_id FROM admins WHERE id = $1',
    [adminId]
  );

  if (adminRole.length === 0) {
    return [];
  }

  const { role, ward_id, mla_id } = adminRole[0];
  let issuesQuery = '';
  let issuesParams: any[] = [];

  if (role === 'Panch') {
    // Panch sees only issues in their assigned ward
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward
      FROM issues i
      INNER JOIN wards w ON i.ward_id = w.id
      WHERE i.ward_id = $1
    `;
    issuesParams = [ward_id];
  } else if (role === 'Sarpanch') {
    // Sarpanch sees issues in their ward and those of their Panches
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward
      FROM issues i
      INNER JOIN wards w ON i.ward_id = w.id
      WHERE i.ward_id = $1 OR i.ward_id IN (
        SELECT ward_id FROM ward_panches WHERE admin_id IN (
          SELECT panch_id FROM sarpanch_panches WHERE sarpanch_id = $2
        )
      )
    `;
    issuesParams = [ward_id, adminId];
  } else if (role === 'MLA') {
    // MLA sees issues in all wards they are responsible for, and those of their Sarpanches and Panches
    issuesQuery = `
      SELECT i.id, i.title, i.description, i.location, i.resolved, w.name AS ward
      FROM issues i
      INNER JOIN wards w ON i.ward_id = w.id
      WHERE i.ward_id IN (
        SELECT ward_id FROM ward_panches WHERE admin_id IN (
          SELECT panch_id FROM sarpanch_panches WHERE sarpanch_id IN (
            SELECT sarpanch_id FROM mla_sarpanches WHERE mla_id = $1
          )
        )
      )
    `;
    issuesParams = [adminId];
  } else {
    return []; // In case the role is not recognized
  }

  const issues = await doQuery<{ id: number; title: string; description: string; location: string; resolved: number; ward: string }>(
    issuesQuery,
    issuesParams
  );

  // Format the issues in the required structure and convert resolved to boolean
  const formattedIssues = issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    ward: issue.ward,
    location: issue.location,
    isResolved: issue.resolved === 1,  // Convert 0/1 to boolean
  }));

  return formattedIssues;
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
    const issues = await getIssuesByAdmin(adminId);
    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}
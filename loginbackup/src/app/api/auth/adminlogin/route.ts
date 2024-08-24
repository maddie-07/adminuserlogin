import { doQuery } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { adminloginSchema } from "@/validator/authSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";

export async function POST(request: NextRequest) {
  try {
    // Parse JSON request body
    const body = await request.json();

    // Compile and validate input using the schema
    const validator = vine.compile(adminloginSchema);
    validator.errorReporter = () => new ErrorReporter();
    const output = await validator.validate(body);

    // Extract fields from validated output
    const userId = output.user_id;
    const role = output.role;
    const wardId = output.ward_id;

    // Query to check if an admin exists with the given user_id, role, and optionally ward_id
    const query = 'SELECT * FROM "admins" WHERE user_id = $1 AND role = $2 AND (ward_id IS NULL OR ward_id = $3)';
    const rows = await doQuery(query, [userId, role, wardId || null]);

    // Check if any rows are returned
    if (rows.length > 0) {
      return NextResponse.json({
        status: 200,
        message: "Admin logged in successfully!",
      }, { status: 200 });
    }

    // Return error response if no admin found
    return NextResponse.json({
      status: 400,
      errors: {
        userId: "No admin found with this User ID, Role, and Ward ID",
      },
    }, { status: 400 });
  } catch (error) {
    // Return internal server error response
    return NextResponse.json({
      status: 500,
      errors: { server: "Internal Server Error" },
    }, { status: 500 });
  }
}

import { doQuery } from "@/lib/db"; 
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validator/authSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validator = vine.compile(loginSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(body);

        // Use doQuery to check if the email exists in the database
        const query = 'SELECT * FROM users WHERE email = $1';
        const rows = await doQuery(query, [output.email]);

        if (rows.length > 0) {
            const user = rows[0];

            // Compare the password
            const checkPassword = bcrypt.compareSync(output.password!, user.password_hash);
            if (checkPassword) {
                return NextResponse.json({
                    status: 200,
                    message: "User logged in successfully!",
                }, { status: 200 });
            }

            return NextResponse.json({
                status: 400,
                errors: {
                    email: "Please check your credentials",
                },
            }, { status: 200 });
        }

        return NextResponse.json({
            status: 400,
            errors: {
                email: "No email found!",
            },
        }, { status: 200 });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({ status: 400, errors: error.messages }, { status: 200 });
        }
        console.error(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    }
}

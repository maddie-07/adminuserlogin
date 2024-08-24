import { doQuery } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validator/authSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validator = vine.compile(registerSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(body);

        // Check if email already exists in PostgreSQL
        const checkEmailQuery = 'SELECT * FROM "users" WHERE email = $1';
        const existingUsers = await doQuery(checkEmailQuery, [output.email]);

        if (existingUsers.length > 0) {
            return NextResponse.json({
                status: 400,
                errors: {
                    email: "Email is already taken. Please use another email.",
                },
            }, { status: 200 });
        } else {
            // Hash the password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(output.password, salt);

            // Insert the new user into PostgreSQL
            const insertUserQuery = `
                INSERT INTO "users" ("username", "password_hash", "email", "ward_id")
                VALUES ($1, $2, $3, $4)
            `;
            await doQuery(insertUserQuery, [
                output.username,
                hashedPassword,
                output.email,
                output.ward_id
            ]);

            return NextResponse.json({ status: 200, message: "User created successfully" }, { status: 200 });
        }
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({ status: 400, errors: error.messages }, { status: 200 });
        }
        console.error(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    }
}

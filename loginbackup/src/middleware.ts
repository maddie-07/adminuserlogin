import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CustomUser } from "@/types/customTypes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login and registration pages without authentication
  if (
    pathname === "/login" ||
    pathname === "/adminlogin"
  ) {
    return NextResponse.next();
  }

  // Retrieve token from request
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware Token:", token); // Debug log


  // If there's no token, redirect to login for protected routes
  if (!token) {
    if (
      pathname.startsWith("/user") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Extract user information from the token
  const user: CustomUser | null = token.user as CustomUser;

  // Determine user role
  const userRole = user?.role;

  // Restrict access based on role and route
  if (pathname.startsWith("/admin")) {
    if (userRole === "User") {
      return NextResponse.redirect(new URL("/login?error=Access denied. Admins only.", request.url));
    }
  } else if (pathname.startsWith("/user")) {
    if (["Panch", "Sarpanch", "MLA"].includes(userRole || "")) {
      return NextResponse.redirect(new URL("/adminlogin?error=Access denied. Users only.", request.url));
    }
  }

  
  return NextResponse.next();
}

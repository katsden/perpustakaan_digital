import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
const encodedKey = new TextEncoder().encode(secret);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  let isValid = false;

  if (token) {
    try {
      await jwtVerify(token, encodedKey);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

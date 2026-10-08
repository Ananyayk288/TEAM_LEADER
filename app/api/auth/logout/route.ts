// app/api/auth/logout/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-Side Logout Endpoint
// Clears session cookie and invalidates session.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  // Expire session cookie immediately
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });

  // Anti-caching headers
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate, private");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export async function GET() {
  return POST();
}

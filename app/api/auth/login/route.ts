// app/api/auth/login/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hardened Team Leader Login Endpoint
// - Generic error message: "Invalid email or ID."
// - Constant-time credential verification with SHA-256 hashing
// - Rate limiting: 5 failed attempts per 15 mins per IP+Email
// - CSRF checks & HTTP-only, SameSite=Lax session cookie
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyTeamLeaderCredentials,
  createSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF Verification
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: "Forbidden — Invalid request origin" },
        { status: 403 }
      );
    }

    // 2. Parse payload safely
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid email or ID." },
        { status: 400 }
      );
    }

    const { email, teamUniqueId } = body;
    if (typeof email !== "string" || typeof teamUniqueId !== "string") {
      return NextResponse.json(
        { error: "Invalid email or ID." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanId = teamUniqueId.trim();

    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "local_client";
    const rateLimitKey = `${ip}:${cleanEmail}`;

    // 3. Rate Limit Check
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again after ${rateCheck.remainingMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    // 4. Verify Credentials in Constant-Time using Server Hashing
    const result = await verifyTeamLeaderCredentials(cleanEmail, cleanId);

    if (!result.success || !result.user) {
      // Record failure for rate limiting
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Invalid email or ID." },
        { status: 401 }
      );
    }

    // 5. Success — Reset Rate Limit & Create Session Token
    resetRateLimit(rateLimitKey);
    const sessionToken = await createSessionToken(result.user);

    // 6. Build response with HTTP-only, Secure, SameSite=Lax cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          teamId: result.user.teamId,
          email: result.user.email,
          teamName: result.user.teamName,
          role: result.user.role,
        },
      },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid email or ID." },
      { status: 400 }
    );
  }
}

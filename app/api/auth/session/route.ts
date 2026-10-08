// app/api/auth/session/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server Session Verification Endpoint
// Returns authenticated user details derived from HTTP-only session cookie.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);

  if (!user) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      teamId: user.teamId,
      email: user.email,
      teamName: user.teamName,
      role: user.role,
    },
  });
}

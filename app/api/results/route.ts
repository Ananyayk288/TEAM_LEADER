// app/api/results/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure Results API
// Returns ONLY the authenticated team's own result, and ONLY if Admin has published results.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getServerWorkflowState } from "@/lib/server/stateStore";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized — Valid session required" }, { status: 401 });
  }

  // Derive state strictly from the session team
  const state = getServerWorkflowState(user.teamId);

  if (!state.resultsPublished) {
    return NextResponse.json({
      published: false,
      message: "Results have not yet been published by the organizing committee.",
      teamResult: null,
    });
  }

  return NextResponse.json({
    published: true,
    teamId: user.teamId,
    teamName: state.teamName,
    teamResult: state.teamResult,
  });
}

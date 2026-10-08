// app/api/workflow/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server Workflow State API
// Verifies session token and returns workflow state derived strictly from the session teamId.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getServerWorkflowState } from "@/lib/server/stateStore";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Derived STRICTLY from session user — never from request query or body
  const state = getServerWorkflowState(user.teamId);

  return NextResponse.json({ success: true, state });
}

// app/api/payment/submit/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure Payment Submission API
// Verifies session, validates ownership & state, sanitizes UTR input,
// and records payment proof for the session team.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getServerWorkflowState, updateServerWorkflowState } from "@/lib/server/stateStore";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Session
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = await verifySessionToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized — Valid session required" }, { status: 401 });
    }

    // 2. CSRF Check
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: "Forbidden — Invalid request origin" }, { status: 403 });
    }

    // 3. Parse and Validate Body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { utrRef, proofUrl, proofFileName } = body;

    if (typeof utrRef !== "string" || utrRef.trim().length < 6 || utrRef.trim().length > 50) {
      return NextResponse.json(
        { error: "Invalid UTR / Transaction reference. Must be between 6 and 50 characters." },
        { status: 400 }
      );
    }

    const cleanUtr = utrRef.trim().replace(/[^\w\s-]/gi, "");

    // 4. Verify Server State for Session Team
    const currentState = getServerWorkflowState(user.teamId);

    // Verify correct state: payment must be UNPAID or resubmissionAllowed must be true
    if (currentState.paymentStatus === "APPROVED") {
      return NextResponse.json(
        { error: "Payment has already been verified and approved by admin." },
        { status: 400 }
      );
    }

    if (currentState.paymentStatus === "PENDING" && !currentState.resubmissionAllowed) {
      return NextResponse.json(
        { error: "Payment verification is already in progress. Resubmission is not currently enabled." },
        { status: 400 }
      );
    }

    // 5. Update Server State for Session Team
    const formattedDate = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const updatedState = updateServerWorkflowState(user.teamId, (prev) => ({
      ...prev,
      paymentStatus: "PENDING",
      paymentProof: {
        utrRef: cleanUtr,
        proofFileName: typeof proofFileName === "string" ? proofFileName.slice(0, 100) : "payment_proof.png",
        proofUrl: typeof proofUrl === "string" ? proofUrl.slice(0, 200) : undefined,
        submittedAt: formattedDate,
      },
    }));

    return NextResponse.json({
      success: true,
      message: "Payment proof submitted successfully for verification",
      paymentStatus: updatedState.paymentStatus,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred processing your payment proof submission." },
      { status: 500 }
    );
  }
}

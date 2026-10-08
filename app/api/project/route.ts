// app/api/project/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure Project & Final Submission API
// Enforces session auth, server-derived team identity, window & lock checks,
// and strict HTTPS-only URL validation for PPT and secondary links.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getServerWorkflowState, updateServerWorkflowState, ProjectData } from "@/lib/server/stateStore";

function isStrictHttpsUrl(urlStr: unknown): boolean {
  if (typeof urlStr !== "string" || !urlStr.trim()) return false;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeText(str: unknown, maxLen: number): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen).replace(/<[^>]*>/g, ""); // Strip raw HTML tags
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized — Valid session required" }, { status: 401 });
  }

  const state = getServerWorkflowState(user.teamId);
  return NextResponse.json({
    success: true,
    finalWindowOpen: state.finalWindowOpen,
    projectStatus: state.projectStatus,
    submissionReopened: state.submissionReopened,
    projectData: state.projectData,
    submittedAt: state.submittedAt,
    submissionRef: state.submissionRef,
  });
}

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

    // 3. Verify Server State Window & Locking Constraints
    const state = getServerWorkflowState(user.teamId);

    const isWindowOpen = state.finalWindowOpen || state.submissionReopened;
    if (!isWindowOpen) {
      return NextResponse.json(
        { error: "Submission window is currently closed by the organizing committee." },
        { status: 400 }
      );
    }

    if (state.projectStatus === "SUBMITTED" && !state.submissionReopened) {
      return NextResponse.json(
        { error: "Your project submission is locked and has already been submitted." },
        { status: 400 }
      );
    }

    // 4. Parse Body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const {
      projectName,
      problemStatement,
      proposedSolution,
      projectDescription,
      domain,
      technologiesUsed,
      pptUrl,
      githubUrl,
      pitchDeckUrl,
      demoUrl,
      additionalMaterialUrl,
      isFinalSubmit,
    } = body;

    // 5. Input Sanitization & Validation
    const cleanProjectName = sanitizeText(projectName, 100);
    const cleanProblem = sanitizeText(problemStatement, 1000);
    const cleanSolution = sanitizeText(proposedSolution, 1000);
    const cleanDesc = sanitizeText(projectDescription, 2000);
    const cleanDomain = sanitizeText(domain, 100);
    const cleanTech = sanitizeText(technologiesUsed, 500);

    if (cleanProjectName.length < 3) {
      return NextResponse.json({ error: "Project Title must be at least 3 characters long." }, { status: 400 });
    }
    if (cleanProblem.length < 20) {
      return NextResponse.json({ error: "Problem Statement must be at least 20 characters long." }, { status: 400 });
    }
    if (cleanSolution.length < 20) {
      return NextResponse.json({ error: "Proposed Solution must be at least 20 characters long." }, { status: 400 });
    }
    if (cleanDesc.length < 30) {
      return NextResponse.json({ error: "Project Description must be at least 30 characters long." }, { status: 400 });
    }

    // 6. STRICT HTTPS-ONLY URL VALIDATION FOR PPT LINK (REQUIRED)
    if (!isStrictHttpsUrl(pptUrl)) {
      return NextResponse.json(
        { error: "PPT / Presentation Link is required and MUST be a secure https:// URL (e.g., https://drive.google.com/...)." },
        { status: 400 }
      );
    }

    // Validate Optional Links — IF provided, MUST be https:// URLs
    if (githubUrl && !isStrictHttpsUrl(githubUrl)) {
      return NextResponse.json(
        { error: "GitHub Repository URL must be a valid https:// link." },
        { status: 400 }
      );
    }
    if (pitchDeckUrl && !isStrictHttpsUrl(pitchDeckUrl)) {
      return NextResponse.json(
        { error: "Pitch Deck URL must be a valid https:// link." },
        { status: 400 }
      );
    }
    if (demoUrl && !isStrictHttpsUrl(demoUrl)) {
      return NextResponse.json(
        { error: "Demo / Prototype URL must be a valid https:// link." },
        { status: 400 }
      );
    }
    if (additionalMaterialUrl && !isStrictHttpsUrl(additionalMaterialUrl)) {
      return NextResponse.json(
        { error: "Additional Material URL must be a valid https:// link." },
        { status: 400 }
      );
    }

    const projectData: ProjectData = {
      projectName: cleanProjectName,
      problemStatement: cleanProblem,
      proposedSolution: cleanSolution,
      projectDescription: cleanDesc,
      domain: cleanDomain || state.selectedDomainName,
      technologiesUsed: cleanTech,
      pptUrl: (pptUrl as string).trim(),
      githubUrl: githubUrl ? (githubUrl as string).trim() : undefined,
      pitchDeckUrl: pitchDeckUrl ? (pitchDeckUrl as string).trim() : undefined,
      demoUrl: demoUrl ? (demoUrl as string).trim() : undefined,
      additionalMaterialUrl: additionalMaterialUrl ? (additionalMaterialUrl as string).trim() : undefined,
    };

    const isSubmit = Boolean(isFinalSubmit);
    const submissionRef = isSubmit ? `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}` : state.submissionRef;
    const submittedAt = isSubmit ? new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : state.submittedAt;
    const newStatus = isSubmit ? "SUBMITTED" : "DRAFT";

    updateServerWorkflowState(user.teamId, (prev) => ({
      ...prev,
      projectData,
      projectStatus: newStatus,
      submittedAt,
      submissionRef,
      submissionReopened: isSubmit ? false : prev.submissionReopened,
    }));

    return NextResponse.json({
      success: true,
      message: isSubmit ? "Project submitted successfully" : "Draft saved successfully",
      status: newStatus,
      submissionRef,
      submittedAt,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred processing your project data." },
      { status: 500 }
    );
  }
}

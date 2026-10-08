// lib/services/workflowService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central Workflow State Manager enforcing the exact end-to-end specification.
// Persists state to localStorage so the application flows logically step by step.
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentStatus = "UNPAID" | "PENDING" | "APPROVED" | "REJECTED";
export type EventStatus   = "NOT_READY" | "READY" | "IN_PROGRESS" | "COMPLETED";
export type ProjectStatus = "LOCKED" | "OPEN" | "DRAFT" | "SUBMITTED";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  isLeader: boolean;
  initials: string;
  accentColor: string;
  email?: string;
  phone?: string;
  college?: string;
}

export interface PaymentProof {
  utrRef: string;
  proofFileName?: string;
  proofUrl?: string;
  submittedAt: string;
  rejectionReason?: string;
}

export interface TeamResult {
  evaluationRound: string;
  evaluationOutcome: string;
  score: number;
  rank: number;
  totalTeams: number;
  innovationScore: number;
  techScore: number;
  presentationScore: number;
  feedback: string;
}

export interface WorkflowState {
  // Pre-assigned Team & Domain Data
  teamId: string;
  teamName: string;
  college: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  selectedDomainId: string;
  selectedDomainName: string;
  domainDescription: string;
  members: TeamMember[];
  teamSubmitted: boolean;

  // Payment
  paymentStatus: PaymentStatus;
  paymentProof: PaymentProof | null;
  resubmissionAllowed: boolean;

  // Event
  checkedIn: boolean;

  // Final Hours Project & Submission
  submissionWindowOpen: boolean; // finalWindowOpen
  finalWindowOpen: boolean;
  submissionReopened: boolean;
  projectStatus: ProjectStatus;

  // Results
  resultsPublished: boolean;
  teamResult: TeamResult | null;
}

// ─── INITIAL PRE-REGISTERED STATE ──────────────────────────────────────────────

const STORAGE_KEY = "vv_workflow_state";

const DEFAULT_STATE: WorkflowState = {
  teamId: "VV-2026-X89K",
  teamName: "SHADOW NINE",
  college: "VVCE Mysore",
  leaderName: "Alex Vance",
  leaderEmail: "alex.vance@vvce.ac.in",
  leaderPhone: "+91 98765 43210",
  selectedDomainId: "cyber-security",
  selectedDomainName: "CYBER SECURITY",
  domainDescription: "Defend digital infrastructure with next-generation security architectures.",
  members: [
    { id: "m1", name: "Alex Vance", role: "Team Leader", branch: "CSE", isLeader: true, initials: "AV", accentColor: "#FF0F5A", email: "alex.vance@vvce.ac.in", phone: "+91 98765 43210", college: "VVCE Mysore" },
    { id: "m2", name: "Sarah Connor", role: "Fullstack Dev", branch: "ISE", isLeader: false, initials: "SC", accentColor: "#38E1E8", email: "sarah.c@vvce.ac.in", phone: "+91 98765 43211", college: "VVCE Mysore" },
    { id: "m3", name: "Marcus Wright", role: "AI / ML Engineer", branch: "AIML", isLeader: false, initials: "MW", accentColor: "#E91E8C", email: "marcus.w@vvce.ac.in", phone: "+91 98765 43212", college: "VVCE Mysore" },
  ],
  teamSubmitted: true,

  paymentStatus: "UNPAID",
  paymentProof: null,
  resubmissionAllowed: true,

  checkedIn: false,
  submissionWindowOpen: false,
  finalWindowOpen: false,
  submissionReopened: false,
  projectStatus: "LOCKED",

  resultsPublished: false,
  teamResult: {
    evaluationRound: "ROUND 01 · FINAL EVALUATION DECK",
    evaluationOutcome: "QUALIFIED / APPROVED",
    score: 94.5,
    rank: 2,
    totalTeams: 48,
    innovationScore: 28,
    techScore: 34,
    presentationScore: 32.5,
    feedback: "Exceptional architecture with robust real-time security telemetry. Great presentation clarity.",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function readState(): WorkflowState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw) as WorkflowState;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      finalWindowOpen: parsed.finalWindowOpen ?? parsed.submissionWindowOpen ?? false,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: WorkflowState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("vv_workflow_updated"));
  } catch {
    /* ignore */
  }
}

// ─── EXPORTED SERVICE METHODS ────────────────────────────────────────────────

export function getWorkflowState(): WorkflowState {
  return readState();
}

export function updateWorkflowState(updater: (prev: WorkflowState) => WorkflowState) {
  const current = readState();
  const next = updater(current);
  writeState(next);
  return next;
}

// Payment Actions
export function submitPaymentProof(utrRef: string, fileName?: string) {
  return updateWorkflowState((prev) => ({
    ...prev,
    paymentStatus: "PENDING",
    paymentProof: {
      utrRef,
      proofFileName: fileName || "payment_proof.png",
      submittedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    },
  }));
}

export function adminApprovePayment() {
  return updateWorkflowState((prev) => ({
    ...prev,
    paymentStatus: "APPROVED",
  }));
}

export function adminRejectPayment(reason: string) {
  return updateWorkflowState((prev) => ({
    ...prev,
    paymentStatus: "REJECTED",
    paymentProof: prev.paymentProof ? { ...prev.paymentProof, rejectionReason: reason } : null,
  }));
}

export function adminSetResubmissionAllowed(allowed: boolean) {
  return updateWorkflowState((prev) => ({
    ...prev,
    resubmissionAllowed: allowed,
  }));
}

// Project & Final Hours Actions
export function adminToggleFinalHours(open: boolean) {
  return updateWorkflowState((prev) => ({
    ...prev,
    submissionWindowOpen: open,
    finalWindowOpen: open,
    projectStatus: open ? (prev.projectStatus === "LOCKED" ? "OPEN" : prev.projectStatus) : "LOCKED",
  }));
}

export function adminToggleSubmissionReopened(reopened: boolean) {
  return updateWorkflowState((prev) => ({
    ...prev,
    submissionReopened: reopened,
  }));
}

// Results Actions
export function adminToggleResultsPublished(published: boolean) {
  return updateWorkflowState((prev) => ({
    ...prev,
    resultsPublished: published,
  }));
}

/**
 * Service Contract: Requests ONLY the authenticated team's own result (by teamId)
 * and ONLY if results have been published by the system.
 */
export function getAuthenticatedTeamResult(teamId: string): TeamResult | null {
  const state = readState();
  if (!state.resultsPublished) return null;
  if (state.teamId === teamId || !teamId) {
    return state.teamResult;
  }
  return null;
}

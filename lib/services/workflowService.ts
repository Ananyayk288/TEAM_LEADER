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
}

export interface PaymentProof {
  utrRef: string;
  proofFileName?: string;
  proofUrl?: string;
  submittedAt: string;
  rejectionReason?: string;
}

export interface TeamResult {
  score: number;
  rank: number;
  totalTeams: number;
  innovationScore: number;
  techScore: number;
  presentationScore: number;
  feedback: string;
}

export interface WorkflowState {
  // Team
  teamId: string;
  teamName: string;
  college: string;
  members: TeamMember[];
  selectedDomainId: string | null;
  selectedDomainName: string | null;
  teamSubmitted: boolean;

  // Payment
  paymentStatus: PaymentStatus;
  paymentProof: PaymentProof | null;

  // Event
  checkedIn: boolean;

  // Final Hours Project
  submissionWindowOpen: boolean;
  projectStatus: ProjectStatus;

  // Results
  resultsPublished: boolean;
  teamResult: TeamResult | null;
}

// ─── INITIAL MOCK STATE ───────────────────────────────────────────────────────

const STORAGE_KEY = "vv_workflow_state";

const DEFAULT_STATE: WorkflowState = {
  teamId: "VV-2026-X89K",
  teamName: "SHADOW NINE",
  college: "VVCE Mysore",
  members: [
    { id: "m1", name: "Alex Vance", role: "Team Leader", branch: "CSE", isLeader: true, initials: "AV", accentColor: "#FDBF15", email: "alex@vvce.ac.in", phone: "+91 98765 43210" },
    { id: "m2", name: "Sarah Connor", role: "Fullstack Dev", branch: "ISE", isLeader: false, initials: "SC", accentColor: "#00D4FF", email: "sarah@vvce.ac.in", phone: "+91 98765 43211" },
    { id: "m3", name: "Marcus Wright", role: "AI / ML Engineer", branch: "AIML", isLeader: false, initials: "MW", accentColor: "#E91E8C", email: "marcus@vvce.ac.in", phone: "+91 98765 43212" },
  ],
  selectedDomainId: "cybersecurity",
  selectedDomainName: "Cybersecurity & Defense",
  teamSubmitted: true,

  paymentStatus: "PENDING",
  paymentProof: {
    utrRef: "UPI-90481234901",
    proofFileName: "payment_receipt_shadow9.png",
    submittedAt: "Oct 05, 2026 14:30",
  },

  checkedIn: false,
  submissionWindowOpen: false,
  projectStatus: "LOCKED",

  resultsPublished: false,
  teamResult: {
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
    return JSON.parse(raw) as WorkflowState;
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

// Project & Final Hours Actions
export function adminToggleFinalHours(open: boolean) {
  return updateWorkflowState((prev) => ({
    ...prev,
    submissionWindowOpen: open,
    projectStatus: open ? (prev.projectStatus === "LOCKED" ? "OPEN" : prev.projectStatus) : "LOCKED",
  }));
}

// Results Actions
export function adminToggleResultsPublished(published: boolean) {
  return updateWorkflowState((prev) => ({
    ...prev,
    resultsPublished: published,
  }));
}

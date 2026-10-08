// lib/server/stateStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-Side Single Source of Truth for Team Leader Portal
// Manages team workflow state, payment proof, project data, and results.
// Enforces team boundary security: team identity is derived strictly from session.
// ─────────────────────────────────────────────────────────────────────────────

import { MOCK_TEAM, MOCK_MISSION, MOCK_SPOC, MOCK_ANNOUNCEMENTS } from "@/lib/mockData";

export type PaymentStatus = "UNPAID" | "PENDING" | "APPROVED" | "REJECTED";
export type ProjectStatus = "LOCKED" | "OPEN" | "DRAFT" | "SUBMITTED";

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

export interface ProjectData {
  projectName: string;
  problemStatement: string;
  proposedSolution: string;
  projectDescription: string;
  domain: string;
  technologiesUsed: string;
  pptUrl: string;
  githubUrl?: string;
  pitchDeckUrl?: string;
  demoUrl?: string;
  additionalMaterialUrl?: string;
}

export interface ServerWorkflowState {
  teamId: string;
  teamName: string;
  college: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  selectedDomainId: string;
  selectedDomainName: string;
  domainDescription: string;
  members: typeof MOCK_TEAM.members;

  // Payment State
  paymentStatus: PaymentStatus;
  paymentProof: PaymentProof | null;
  resubmissionAllowed: boolean;

  // Final Hours Project & Submission State
  finalWindowOpen: boolean;
  submissionReopened: boolean;
  projectStatus: ProjectStatus;
  projectData: ProjectData | null;
  submittedAt?: string;
  submissionRef?: string;

  // Results State
  resultsPublished: boolean;
  teamResult: TeamResult | null;
}

// Global server-side state per teamId
const serverStateStore = new Map<string, ServerWorkflowState>();

function getDefaultServerState(teamId: string): ServerWorkflowState {
  return {
    teamId,
    teamName: teamId === "VV-024" ? "NEXUS" : "SHADOW NINE",
    college: teamId === "VV-024" ? "VVCE, Mysuru" : "VVCE Mysore",
    leaderName: teamId === "VV-024" ? "Ananya Y K" : "Alex Vance",
    leaderEmail: teamId === "VV-024" ? "ananya.yk@vvce.ac.in" : "alex.vance@vvce.ac.in",
    leaderPhone: "+91 98765 43210",
    selectedDomainId: "cyber-security",
    selectedDomainName: "CYBER SECURITY",
    domainDescription: "Defend digital infrastructure with next-generation security architectures.",
    members: MOCK_TEAM.members,

    paymentStatus: "UNPAID",
    paymentProof: null,
    resubmissionAllowed: true,

    finalWindowOpen: false,
    submissionReopened: false,
    projectStatus: "LOCKED",
    projectData: null,

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
}

export function getServerWorkflowState(teamId: string): ServerWorkflowState {
  if (!serverStateStore.has(teamId)) {
    serverStateStore.set(teamId, getDefaultServerState(teamId));
  }
  return serverStateStore.get(teamId)!;
}

export function updateServerWorkflowState(
  teamId: string,
  updater: (prev: ServerWorkflowState) => ServerWorkflowState
): ServerWorkflowState {
  const current = getServerWorkflowState(teamId);
  const updated = updater(current);
  serverStateStore.set(teamId, updated);
  return updated;
}

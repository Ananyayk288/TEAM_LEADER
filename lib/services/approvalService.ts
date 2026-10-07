// lib/services/approvalService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Service layer for the Confirmed / Post-Approval dashboard.
// Replace each function with a real API call when the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import { getDomainById, type Domain } from "./domainService";
import { MOCK_TEAM } from "@/lib/mockData";

// ─── STATUS ENUMS ─────────────────────────────────────────────────────────────
export type ApprovalStatus  = "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type PaymentStatus   = "UNPAID" | "PENDING" | "PAID";
export type TeamStatus      = "DRAFT" | "SUBMITTED" | "CONFIRMED" | "DISQUALIFIED";
export type EventStatus     = "NOT_READY" | "READY" | "IN_PROGRESS" | "COMPLETED";

// ─── INTERFACES ───────────────────────────────────────────────────────────────
export interface ConfirmedMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  isLeader: boolean;
  initials: string;
  accentColor: string;
}

export interface ConfirmedTeamData {
  teamId: string;
  teamName: string;
  college: string;
  members: ConfirmedMember[];
  memberCount: number;
  maxMembers: number;
  domain: Domain | null;
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  teamStatus: TeamStatus;
  eventStatus: EventStatus;
  registrationRef: string;
  confirmedAt: string;
  /** QR content slot — to be populated by QR module developer */
  qrSlot: null;
}

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const APPROVAL_KEY   = "vv_approval_status";
const SUBMISSION_KEY = "vv_team_submission";
const DOMAIN_KEY     = "vv_domain_selection";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readLS<T>(key: string): T | null {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : null; }
  catch { return null; }
}

function writeLS(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Fetch confirmed team data.
 * Replace with: GET /api/team/confirmed
 */
export async function getConfirmedTeamData(): Promise<ConfirmedTeamData | null> {
  await delay(400);

  const approvalStore  = readLS<{ status: ApprovalStatus }>(APPROVAL_KEY);
  const submissionStore = readLS<{ ref: string; submittedAt: string; status: string }>(SUBMISSION_KEY);
  const domainStore    = readLS<{ domainId: string }>(DOMAIN_KEY);

  const approvalStatus: ApprovalStatus = approvalStore?.status ?? "APPROVED"; // mock: default APPROVED
  if (approvalStatus !== "APPROVED") return null;

  const domain: Domain | null = domainStore?.domainId
    ? (getDomainById(domainStore.domainId) ?? null)
    : null;

  return {
    teamId:          MOCK_TEAM.teamId,
    teamName:        MOCK_TEAM.teamName,
    college:         MOCK_TEAM.college,
    members:         MOCK_TEAM.members.map(m => ({ ...m, isLeader: m.isLeader ?? false })),
    memberCount:     MOCK_TEAM.memberCount,
    maxMembers:      MOCK_TEAM.maxMembers,
    domain,
    approvalStatus,
    paymentStatus:   "PENDING", // Requirement: PAYMENT STATUS MUST REMAIN PENDING
    teamStatus:      "CONFIRMED",
    eventStatus:     "READY",
    registrationRef: submissionStore?.ref ?? "REG-MOCK001",
    confirmedAt:     "Oct 05, 2026",
    qrSlot:          null,
  };
}

/**
 * Get current approval status only.
 * Replace with: GET /api/team/approval-status
 */
export async function getApprovalStatus(): Promise<ApprovalStatus> {
  await delay(100);
  const store = readLS<{ status: ApprovalStatus }>(APPROVAL_KEY);
  return store?.status ?? "APPROVED"; // mock default
}
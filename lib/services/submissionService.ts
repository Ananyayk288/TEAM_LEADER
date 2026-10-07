// lib/services/submissionService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Service layer for Team Submission module.
// Replace each function with a real API call when backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import { getDomainById, type Domain } from "./domainService";
import { MOCK_TEAM } from "@/lib/mockData";

// ─── STATUS MODEL ─────────────────────────────────────────────────────────────
export type RegistrationStatus =
  | "DRAFT"
  | "READY_TO_SUBMIT"
  | "SUBMITTED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "CONFIRMED";

export interface RegistrationMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  isLeader: boolean;
  initials: string;
  accentColor: string;
}

export interface TeamRegistration {
  teamId: string;
  teamName: string;
  college: string;
  members: RegistrationMember[];
  memberCount: number;
  requiredMembers: number;
  domain: Domain | null;
  status: RegistrationStatus;
  submittedAt?: string;
  registrationRef?: string;
  teamComplete: boolean;
  domainSelected: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SubmitResult {
  success: boolean;
  message: string;
  registrationRef?: string;
}

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const SUBMISSION_KEY = "vv_team_submission";
const DOMAIN_KEY     = "vv_domain_selection";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readLocalStorage<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch { return null; }
}

function writeLocalStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────────────────────────

/** Fetch full team registration record. Replace with: GET /api/registration */
export async function getTeamRegistration(): Promise<TeamRegistration> {
  await delay(350);

  // Read persisted states
  const domainStore = readLocalStorage<{ domainId: string; submitted: boolean }>(DOMAIN_KEY);
  const subStore    = readLocalStorage<{ ref: string; submittedAt: string; status: RegistrationStatus }>(SUBMISSION_KEY);

  const domain: Domain | null = domainStore?.domainId
    ? (getDomainById(domainStore.domainId) ?? null)
    : null;

  let status: RegistrationStatus = "DRAFT";
  if (subStore?.status) {
    status = subStore.status;
  } else if (domain && MOCK_TEAM.memberCount >= MOCK_TEAM.maxMembers) {
    status = "READY_TO_SUBMIT";
  }

  return {
    teamId:          MOCK_TEAM.teamId,
    teamName:        MOCK_TEAM.teamName,
    college:         MOCK_TEAM.college,
    members:         MOCK_TEAM.members.map(m => ({ ...m, isLeader: m.isLeader ?? false })),
    memberCount:     MOCK_TEAM.memberCount,
    requiredMembers: MOCK_TEAM.maxMembers,
    domain,
    teamComplete:    MOCK_TEAM.memberCount >= MOCK_TEAM.maxMembers,
    domainSelected:  !!domain,
    status,
    submittedAt:     subStore?.submittedAt,
    registrationRef: subStore?.ref,
  };
}

/** Validate team is ready for submission. Replace with: POST /api/registration/validate */
export async function validateTeamForSubmission(reg: TeamRegistration): Promise<ValidationResult> {
  await delay(200);
  const errors: string[] = [];
  if (!reg.teamComplete)   errors.push("Team requirements not complete — add all required members.");
  if (!reg.domainSelected) errors.push("No domain selected — complete domain selection first.");
  if (!reg.domain)         errors.push("Domain data is missing. Please re-select your domain.");
  if (reg.memberCount < reg.requiredMembers)
    errors.push(`Need ${reg.requiredMembers} members — currently ${reg.memberCount}.`);
  return { valid: errors.length === 0, errors };
}

/** Submit team for registration. Replace with: POST /api/registration/submit */
export async function submitTeamRegistration(teamId: string): Promise<SubmitResult> {
  await delay(1500);
  const ref = "REG-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  const now = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  writeLocalStorage(SUBMISSION_KEY, {
    ref,
    submittedAt: now,
    status: "PAYMENT_PENDING" as RegistrationStatus,
  });
  // Also mark domain as submitted
  const ds = readLocalStorage<{ domainId: string }>(DOMAIN_KEY);
  if (ds) writeLocalStorage(DOMAIN_KEY, { ...ds, submitted: true });
  return { success: true, message: "SUBMISSION ACCEPTED", registrationRef: ref };
}

/** Get current submission status. Replace with: GET /api/registration/status */
export async function getSubmissionStatus(): Promise<RegistrationStatus> {
  await delay(100);
  const sub = readLocalStorage<{ status: RegistrationStatus }>(SUBMISSION_KEY);
  return sub?.status ?? "DRAFT";
}
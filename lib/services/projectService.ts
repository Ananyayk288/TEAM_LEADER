// lib/services/projectService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Service layer for the Project & Final Submission module.
// Fast local storage reader without artificial latency delays.
// ─────────────────────────────────────────────────────────────────────────────

import { getDomainById } from "./domainService";
import { updateWorkflowState } from "./workflowService";

// ─── STATUS MODEL ─────────────────────────────────────────────────────────────

/** The four states the Project module can be in. */
export type ProjectStatus = "LOCKED" | "OPEN" | "DRAFT" | "SUBMITTED";

// ─── INTERFACES ───────────────────────────────────────────────────────────────

export interface AdminField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: "text" | "textarea" | "url";
}

export interface ProjectData {
  projectName: string;
  problemStatement: string;
  proposedSolution: string;
  projectDescription: string;
  domain: string;
  technologiesUsed: string;

  // FINAL SUBMISSION LINKS (URLs only)
  pptUrl: string;                 // PPT / PRESENTATION LINK — REQUIRED
  githubUrl?: string;             // GITHUB REPOSITORY URL — OPTIONAL
  pitchDeckUrl?: string;          // PITCH DECK URL — OPTIONAL
  demoUrl?: string;               // PROTOTYPE / DEMO URL — OPTIONAL
  additionalMaterialUrl?: string; // ADDITIONAL MATERIAL URL — OPTIONAL

  adminFieldValues?: Record<string, string>;
}

export interface ProjectRecord {
  status: ProjectStatus;
  submissionWindowOpen: boolean;
  data: ProjectData | null;
  submittedAt?: string;
  submissionRef?: string;
  adminFields: AdminField[];
}

export interface ProjectSaveResult {
  success: boolean;
  message: string;
  ref?: string;
}

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const PROJECT_DATA_KEY   = "vv_project_data";
const PROJECT_STATUS_KEY = "vv_project_status";
const PROJECT_WINDOW_KEY = "vv_project_window";

const ADMIN_EXTRA_FIELDS: AdminField[] = [];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function readLS<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────────────────────────

export async function getProjectRecord(): Promise<ProjectRecord> {
  // Fast synchronous read
  const windowStore = readLS<{ open: boolean }>(PROJECT_WINDOW_KEY);
  const submissionWindowOpen = windowStore?.open ?? false;

  const statusStore = readLS<{ status: ProjectStatus; ref?: string; submittedAt?: string }>(PROJECT_STATUS_KEY);
  const dataStore = readLS<ProjectData>(PROJECT_DATA_KEY);

  const domainStore = readLS<{ domainId: string }>("vv_domain_selection");
  const domain = domainStore?.domainId
    ? (getDomainById(domainStore.domainId)?.name ?? "")
    : "";

  let status: ProjectStatus = "LOCKED";
  if (submissionWindowOpen) {
    if (statusStore?.status && statusStore.status !== "LOCKED") {
      status = statusStore.status;
    } else {
      status = "OPEN";
    }
  }

  if (dataStore && status === "OPEN") {
    status = "DRAFT";
  }

  return {
    status,
    submissionWindowOpen,
    data: dataStore
      ? { ...dataStore, domain: domain || dataStore.domain }
      : null,
    submittedAt: statusStore?.submittedAt,
    submissionRef: statusStore?.ref,
    adminFields: ADMIN_EXTRA_FIELDS,
  };
}

export async function saveProjectDraft(data: ProjectData): Promise<ProjectSaveResult> {
  const statusStore = readLS<{ status: ProjectStatus; ref?: string; submittedAt?: string }>(PROJECT_STATUS_KEY);
  writeLS(PROJECT_DATA_KEY, data);
  if (statusStore?.status !== "SUBMITTED") {
    writeLS(PROJECT_STATUS_KEY, { status: "DRAFT" as ProjectStatus });
  }
  return { success: true, message: "DRAFT SAVED" };
}

export async function submitProject(data: ProjectData): Promise<ProjectSaveResult> {
  const statusStore = readLS<{ status: ProjectStatus; ref?: string; submittedAt?: string }>(PROJECT_STATUS_KEY);
  const ref = statusStore?.ref || ("PRJ-" + Math.random().toString(36).substring(2, 9).toUpperCase());
  const now = statusStore?.submittedAt || new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  writeLS(PROJECT_DATA_KEY, data);
  writeLS(PROJECT_STATUS_KEY, { status: "SUBMITTED" as ProjectStatus, ref, submittedAt: now });
  updateWorkflowState((prev) => ({ ...prev, projectStatus: "SUBMITTED" }));
  return { success: true, message: "PROJECT SUBMITTED", ref };
}

export async function getProjectStatus(): Promise<ProjectStatus> {
  const windowStore = readLS<{ open: boolean }>(PROJECT_WINDOW_KEY);
  if (!windowStore?.open) return "LOCKED";
  const statusStore = readLS<{ status: ProjectStatus }>(PROJECT_STATUS_KEY);
  return statusStore?.status ?? "OPEN";
}

export function devSetProjectWindow(open: boolean) {
  writeLS(PROJECT_WINDOW_KEY, { open });
}

export function devSetProjectStatus(status: ProjectStatus) {
  writeLS(PROJECT_STATUS_KEY, { status });
}

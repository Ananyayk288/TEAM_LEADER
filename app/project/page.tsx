"use client";
// app/project/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Project Submission Module — Team Leader Portal
// States: LOCKED → OPEN → DRAFT → SUBMITTED
// Locked until Admin opens Final Hours submission window.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from "react";
import { Unlock } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import {
  getProjectRecord,
  saveProjectDraft,
  submitProject,
  devSetProjectWindow,
  type ProjectRecord,
  type ProjectData,
  type ProjectStatus,
} from "@/lib/services/projectService";
import { getWorkflowState, adminToggleFinalHours } from "@/lib/services/workflowService";
import ProjectLockedCard from "@/components/project/ProjectLockedCard";
import ProjectStatusBanner from "@/components/project/ProjectStatusBanner";
import ProjectForm from "@/components/project/ProjectForm";

// ─── SUBMITTED BANNER ─────────────────────────────────────────────────────────
function SubmittedSuccessBanner({ ref: submissionRef, at }: { ref?: string; at?: string }) {
  return (
    <div
      style={{
        padding: "2rem",
        background: "rgba(0,255,136,0.04)",
        border: "1px solid rgba(0,255,136,0.2)",
        marginBottom: "1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        animation: "vv-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", filter: "drop-shadow(0 0 12px rgba(0,255,136,0.5))" }}>
          ✓
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(0,255,136,0.5)", letterSpacing: "3px", marginBottom: "0.4rem" }}>
          TRANSMISSION COMPLETE
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "#00ff88", letterSpacing: "2px", marginBottom: "0.5rem", textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
          PROJECT SUBMITTED
        </div>
        {submissionRef && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
            REF: <span style={{ color: "rgba(0,255,136,0.7)" }}>{submissionRef}</span>
            {at && <span style={{ marginLeft: "1rem" }}>· {at}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const { authUser } = usePortal();

  const [record, setRecord] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [flashSubmitted, setFlashSubmitted] = useState(false);

  // ── Load project record ──────────────────────────────────────────────────
  const loadRecord = useCallback(async () => {
    try {
      const wf = getWorkflowState();
      // Sync Dev Toggle with Workflow State
      const isOpen = wf.finalWindowOpen || wf.submissionWindowOpen;
      devSetProjectWindow(isOpen);
      const r = await getProjectRecord();
      setRecord(r);
    } catch (e) {
      console.error("Failed to load project record", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecord();
    window.addEventListener("vv_workflow_updated", loadRecord);
    return () => {
      window.removeEventListener("vv_workflow_updated", loadRecord);
    };
  }, [loadRecord]);

  // ── Save draft ────────────────────────────────────────────────────────────
  const handleSaveDraft = useCallback(async (data: ProjectData) => {
    setIsSaving(true);
    setDraftSaved(false);
    try {
      await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isFinalSubmit: false }),
        credentials: "same-origin",
      });
      await saveProjectDraft(data);
      setDraftSaved(true);
      setRecord((prev) =>
        prev ? { ...prev, status: "DRAFT" as ProjectStatus, data } : prev
      );
      setTimeout(() => setDraftSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ── Final submit ──────────────────────────────────────────────────────────
  const handleSubmitProject = useCallback(async (data: ProjectData) => {
    setIsSubmittingFinal(true);
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isFinalSubmit: true }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Submission failed");
      }
      await submitProject(data);
      setFlashSubmitted(true);
      await loadRecord();
    } catch (err: any) {
      console.error("Project submission error:", err);
    } finally {
      setIsSubmittingFinal(false);
    }
  }, [loadRecord]);

  // ── Dev toggle ───────────────────────────────────────────────────────────
  const devToggleWindow = () => {
    const wf = getWorkflowState();
    const current = wf.finalWindowOpen || wf.submissionWindowOpen;
    adminToggleFinalHours(!current);
    loadRecord();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <div className="vv-spinner" />
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--primary)", letterSpacing: "3px" }}>
          LOADING PROJECT DATA...
        </div>
      </div>
    );
  }

  const wfState = getWorkflowState();
  const isFinalWindowOpen = wfState.finalWindowOpen || wfState.submissionWindowOpen;
  const isSubmitted = wfState.projectStatus === "SUBMITTED" || record?.status === "SUBMITTED";
  const isReopened = wfState.submissionReopened;
  const isEditingLocked = isSubmitted && !isReopened;

  // ── LOCKED STATE (WHEN ADMIN HAS NOT OPENED FINAL WINDOW) ────────────────
  if (!isFinalWindowOpen) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-deep)", position: "relative", padding: "0" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "20%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(233,30,140,0.06) 0%,transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(253,191,21,0.04) 0%,transparent 70%)" }} />
        </div>

        <div className="vv-narrow-container" style={{ position: "relative", zIndex: 1 }}>
          <ProjectLockedCard />

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "rgba(255,255,255,0.12)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
              // ADMIN CONTROL — SIMULATE FINAL WINDOW UNLOCK
            </div>
            <button
              onClick={devToggleWindow}
              id="dev-toggle-project-window"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "transparent", border: "1px dashed rgba(0,212,255,0.2)",
                color: "rgba(0,212,255,0.4)", fontFamily: "var(--font-mono)",
                fontSize: "0.6rem", letterSpacing: "1px", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)"; e.currentTarget.style.color = "rgba(0,212,255,0.4)"; }}
            >
              <Unlock size={11} />
              ADMIN SIMULATOR: UNLOCK FINAL PROJECT WINDOW (finalWindowOpen = true)
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── UNLOCKED STATE (FINAL WINDOW OPEN) ──────────────────────────────────
  const domain = record?.data?.domain
    || wfState.selectedDomainName
    || "CYBER SECURITY";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-deep)", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(233,30,140,0.05) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(253,191,21,0.04) 0%,transparent 70%)" }} />
      </div>

      <div className="vv-narrow-container" style={{ position: "relative", zIndex: 1 }}>
        <div className="animate-slide-up" style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "0.4rem" }}>
            // PROJECT SUBMISSION MODULE
          </div>
          <h1 className="text-glow-pink" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginBottom: "0.4rem" }}>
            PROJECT DETAILS
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
            FINAL PROJECT BRIEF · TEAM LEADER PORTAL ·{" "}
            <span style={{ color: "var(--cyan)" }}>{authUser?.teamName ?? "TEAM"}</span>
          </p>
        </div>

        <ProjectStatusBanner
          status={isSubmitted ? "SUBMITTED" : (record?.status ?? "OPEN")}
          submittedAt={record?.submittedAt}
          submissionRef={record?.submissionRef}
        />

        {!isSubmitted && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(0,212,255,0.7)", letterSpacing: "1px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)", flexShrink: 0, animation: "status-pulse 2s ease-in-out infinite" }} />
            FINAL WINDOW OPEN — Fill in project fields (Project Name, Problem Statement, Solution, Description, Stack).
          </div>
        )}

        {flashSubmitted && isSubmitted && (
          <SubmittedSuccessBanner ref={record?.submissionRef} at={record?.submittedAt} />
        )}

        <ProjectForm
          initialData={record?.data ?? null}
          domain={domain}
          adminFields={record?.adminFields ?? []}
          currentStatus={isEditingLocked ? "SUBMITTED" : (record?.status ?? "OPEN")}
          onSaveDraft={handleSaveDraft}
          onSubmitProject={handleSubmitProject}
          isSaving={isSaving}
          isSubmittingFinal={isSubmittingFinal}
          draftSaved={draftSaved}
        />

        <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "rgba(255,255,255,0.12)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
            // DEV TOOLS — SIMULATE LOCKING WINDOW
          </div>
          <button
            onClick={devToggleWindow}
            id="dev-close-project-window"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent", border: "1px dashed rgba(233,30,140,0.2)",
              color: "rgba(233,30,140,0.4)", fontFamily: "var(--font-mono)",
              fontSize: "0.6rem", letterSpacing: "1px", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--pink)"; e.currentTarget.style.color = "var(--pink)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(233,30,140,0.2)"; e.currentTarget.style.color = "rgba(233,30,140,0.4)"; }}
          >
            🔒 SIMULATE: LOCK SUBMISSION WINDOW (finalWindowOpen = false)
          </button>
        </div>
      </div>
    </main>
  );
}
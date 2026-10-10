"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCheck,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Edit,
  Send,
  X,
  ShieldCheck,
} from "lucide-react";
import {
  getWorkflowState,
  getAuthenticatedTeamResult,
  adminToggleFinalHours,
  type WorkflowState,
} from "@/lib/services/workflowService";
import {
  getProjectRecord,
  submitProject,
  saveProjectDraft,
  type ProjectData,
} from "@/lib/services/projectService";
import { useToast } from "@/components/ui/Toast";

export default function SubmitPage() {
  const router = useRouter();
  const [state, setState] = useState<WorkflowState | null>(null);
  const [pptUrl, setPptUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const loadData = () => {
    const wf = getWorkflowState();
    setState(wf);
    const proj = getProjectRecord();
    proj.then((r) => {
      if (r?.data?.pptUrl) setPptUrl(r.data.pptUrl);
      if (r?.data?.githubUrl) setGithubUrl(r.data.githubUrl);
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener("vv_workflow_updated", loadData);
    return () => {
      window.removeEventListener("vv_workflow_updated", loadData);
    };
  }, []);

  if (!state) return null;

  const isFinalWindowOpen = state.finalWindowOpen || state.submissionWindowOpen;
  const isSubmitted = state.projectStatus === "SUBMITTED";
  const isReopened = state.submissionReopened;
  const isLocked = isSubmitted && !isReopened;

  const validatePptLink = (url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError("PPT presentation link is required.");
      return false;
    }
    if (!trimmed.toLowerCase().startsWith("https://")) {
      setValidationError("PPT link must be a valid https:// URL (e.g. https://drive.google.com/... or https://canva.com/...)");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePptLink(pptUrl)) {
      setModalError(null);
      setShowReviewModal(true);
    } else {
      showToast("Please provide a valid https:// PPT presentation link.", "error");
    }
  };

  const handleConfirmFinalSubmit = async () => {
    setSubmitting(true);
    setModalError(null);
    try {
      const proj = await getProjectRecord();
      const existingData: ProjectData = proj.data || {
        projectName: "",
        problemStatement: "",
        proposedSolution: "",
        systemArchitectureLink: "",
        domain: state.selectedDomainName,
        technologiesUsed: "",
        pptUrl: pptUrl.trim(),
      };

      const updatedData: ProjectData = {
        ...existingData,
        pptUrl: pptUrl.trim(),
        githubUrl: githubUrl.trim() || undefined,
      };

      await submitProject(updatedData);
      showToast("Project submitted successfully! ✓", "success");
      setShowReviewModal(false);
      router.replace("/dashboard");
    } catch (err: any) {
      const msg = err?.message || "Submission failed. Please try again.";
      setModalError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-deep)", paddingBottom: "3rem" }}>
      <div className="vv-narrow-container">
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
            // FINAL PROJECT SUBMISSION
          </div>
          <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            FINAL SUBMISSION & PPT LINK
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#9AA8C0", margin: 0 }}>
            Submit accessible shareable link for your final presentation. LINK ONLY — NO FILE UPLOADS.
          </p>
        </div>

        {/* ─── CASE 1: WINDOW CLOSED ─── */}
        {!isFinalWindowOpen && (
          <div className="vv-card vv-corners" style={{ padding: "3rem 2rem", textAlign: "center", border: "1px solid rgba(233,30,140,0.3)", background: "rgba(233,30,140,0.03)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(233,30,140,0.1)", border: "1px solid var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <Lock size={28} style={{ color: "var(--pink)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", color: "var(--pink)", letterSpacing: "1px", marginBottom: "0.5rem" }}>
              FINAL SUBMISSION — LOCKED UNTIL FINAL PROJECT WINDOW
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
              Project submission is not open yet. The final submission window will be unlocked by the Event Admin during final hours.
            </p>
          </div>
        )}

        {/* ─── CASE 2: WINDOW OPEN & SUBMISSION IS LOCKED ─── */}
        {isFinalWindowOpen && isLocked && (
          <div className="animate-slide-up">
            <div className="vv-card vv-corners" style={{ padding: "2rem", marginBottom: "2rem", background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,255,136,0.15)", border: "2px solid #00ff88", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={26} style={{ color: "#00ff88" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", color: "#00ff88", letterSpacing: "1px" }}>
                    SUBMISSION LOCKED & RECORDED ✓
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(0,255,136,0.9)", marginTop: "0.2rem" }}>
                    Your final project presentation link is locked for evaluator review.
                  </div>
                </div>
              </div>

              {/* Submitted Details Box */}
              <div style={{ padding: "1.25rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0" }}>SUBMITTED PPT LINK:</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--cyan)" }}>STATUS: LOCKED</span>
                </div>
                <a
                  href={pptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "var(--cyan)",
                    wordBreak: "break-all",
                    textDecoration: "underline",
                  }}
                >
                  {pptUrl} <ExternalLink size={13} />
                </a>

                {githubUrl && (
                  <div style={{ marginTop: "0.85rem" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", marginBottom: "0.2rem" }}>GITHUB REPO:</div>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-main)" }}>
                      {githubUrl}
                    </a>
                  </div>
                )}
              </div>

              <div style={{ padding: "0.85rem 1rem", background: "rgba(253,191,21,0.06)", border: "1px solid rgba(253,191,21,0.25)", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--primary)" }}>
                ⚡ Re-editing is locked. Only an Event Admin can reopen submission if requested.
              </div>
            </div>
          </div>
        )}

        {/* ─── CASE 3: WINDOW OPEN & SUBMISSION ACTIVE (OR REOPENED) ─── */}
        {isFinalWindowOpen && !isLocked && (
          <div className="animate-slide-up">
            {isReopened && (
              <div style={{ padding: "0.85rem 1.25rem", background: "rgba(0,212,255,0.08)", border: "1px solid var(--cyan)", borderRadius: "4px", marginBottom: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--cyan)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={16} /> ADMIN REOPENED SUBMISSION — You may now edit your PPT link and resubmit.
              </div>
            )}

            <div className="vv-card vv-corners" style={{ padding: "2rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
                // SUBMIT ONLINE PRESENTATION LINK
              </div>

              <form onSubmit={handleOpenReview}>
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-main)", letterSpacing: "1.5px", marginBottom: "0.45rem" }}>
                    PPT / PRESENTATION LINK <span style={{ color: "var(--pink)" }}>*</span>
                  </label>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#9AA8C0", marginBottom: "0.6rem" }}>
                    Provide an accessible shareable link (e.g. Google Drive, Canva, OneDrive). Must start with <strong style={{ color: "var(--cyan)" }}>https://</strong>.
                  </p>
                  <input
                    type="url"
                    value={pptUrl}
                    onChange={(e) => {
                      setPptUrl(e.target.value);
                      if (validationError) validatePptLink(e.target.value);
                    }}
                    placeholder="https://drive.google.com/file/d/... or https://canva.com/design/..."
                    style={{
                      width: "100%",
                      background: "rgba(0,0,0,0.6)",
                      border: `1px solid ${validationError ? "var(--pink)" : "rgba(255,255,255,0.15)"}`,
                      color: "var(--text-main)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.88rem",
                      padding: "0.85rem 1rem",
                      outline: "none",
                    }}
                  />
                  {validationError && (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", marginTop: "0.4rem" }}>
                      ⚠ {validationError}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-main)", letterSpacing: "1.5px", marginBottom: "0.45rem" }}>
                    GITHUB / CODE REPOSITORY LINK <span style={{ color: "var(--text-muted)" }}>(OPTIONAL)</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/team/repo"
                    style={{
                      width: "100%",
                      background: "rgba(0,0,0,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "var(--text-main)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.88rem",
                      padding: "0.85rem 1rem",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "0.95rem",
                    background: "var(--primary)",
                    border: "none",
                    color: "#000",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.95rem",
                    letterSpacing: "1.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(253,191,21,0.25)",
                  }}
                >
                  <FileCheck size={18} /> REVIEW SUBMISSION & CONTINUE
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ─── REVIEW STEP MODAL ─── */}
        {showReviewModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div className="vv-card vv-corners animate-slide-up" style={{ maxWidth: "560px", width: "100%", padding: "2rem", border: "1px solid var(--border-yellow)", background: "#0D131F" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.85rem" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--primary)", letterSpacing: "1.5px" }}>
                  REVIEW FINAL SUBMISSION
                </div>
                {!submitting && (
                  <button onClick={() => setShowReviewModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    <X size={20} />
                  </button>
                )}
              </div>

              {modalError && (
                <div style={{ padding: "0.75rem 1rem", background: "rgba(230,16,80,0.15)", border: "1px solid rgba(230,16,80,0.6)", borderRadius: "4px", marginBottom: "1.25rem", textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#FF4D4D", letterSpacing: "0.5px" }}>
                    ⚠ {modalError}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.75rem" }}>
                <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#9AA8C0" }}>TEAM:</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--primary)" }}>{state.teamName} ({state.teamId})</div>
                </div>

                <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#9AA8C0" }}>SELECTED DOMAIN:</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)" }}>{state.selectedDomainName}</div>
                </div>

                <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(253,191,21,0.25)", borderRadius: "4px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#9AA8C0" }}>PPT PRESENTATION LINK:</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--primary)", wordBreak: "break-all", marginTop: "0.2rem" }}>{pptUrl}</div>
                </div>

                {githubUrl && (
                  <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#9AA8C0" }}>GITHUB REPO LINK:</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-main)", wordBreak: "break-all", marginTop: "0.2rem" }}>{githubUrl}</div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.85rem" }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "var(--text-main)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.8rem",
                    letterSpacing: "1px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Edit size={14} /> EDIT DETAILS
                </button>

                <button
                  type="button"
                  onClick={handleConfirmFinalSubmit}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    background: "var(--pink)",
                    border: "none",
                    color: "#fff",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.8rem",
                    letterSpacing: "1.5px",
                    fontWeight: 700,
                    cursor: submitting ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  {submitting ? "TRANSMITTING..." : "CONFIRM & FINAL SUBMIT"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
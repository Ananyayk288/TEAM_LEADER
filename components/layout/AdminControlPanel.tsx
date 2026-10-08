"use client";
import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Sliders,
  X,
  AlertCircle,
  QrCode,
  Radio,
} from "lucide-react";
import {
  getWorkflowState,
  updateWorkflowState,
  adminApprovePayment,
  adminRejectPayment,
  adminToggleFinalHours,
  adminToggleResultsPublished,
  type WorkflowState,
} from "@/lib/services/workflowService";

export default function AdminControlPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<WorkflowState | null>(null);
  const [rejectReason, setRejectReason] = useState("UTR number unverified. Please upload a clear transaction screenshot.");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const refreshState = () => {
    setState(getWorkflowState());
  };

  useEffect(() => {
    refreshState();
    window.addEventListener("vv_workflow_updated", refreshState);
    return () => window.removeEventListener("vv_workflow_updated", refreshState);
  }, []);

  if (!state) return null;

  const handleApprove = () => {
    adminApprovePayment();
    refreshState();
  };

  const handleReject = () => {
    adminRejectPayment(rejectReason);
    setShowRejectForm(false);
    refreshState();
  };

  const handleToggleFinalHours = () => {
    adminToggleFinalHours(!state.submissionWindowOpen);
    refreshState();
  };

  const handleToggleResults = () => {
    adminToggleResultsPublished(!state.resultsPublished);
    refreshState();
  };

  return (
    <>
      {/* Floating Toggle Button in bottom right */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 90,
          background: "#0F0F0F",
          border: "1px solid var(--primary)",
          color: "var(--primary)",
          padding: "0.6rem 1.1rem",
          fontFamily: "var(--font-heading)",
          fontSize: "0.75rem",
          letterSpacing: "1.5px",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(253,191,21,0.25)",
        }}
      >
        <Sliders size={16} />
        ADMIN SIMULATOR
      </button>

      {/* Slide-over Control Drawer */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              height: "100%",
              background: "#0C0C0C",
              borderLeft: "1px solid var(--border-yellow)",
              padding: "1.75rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <ShieldCheck size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--primary)", letterSpacing: "1.5px" }}>
                    EVENT ADMIN PANEL
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
                    LIVE CONTROL & WORKFLOW SIMULATOR
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* SECTION 0: EDIT / SEED PRE-REGISTERED TEAM & DOMAIN */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "1.5px", marginBottom: "0.85rem" }}>
                // 0. ADMIN PRE-REGISTERED TEAM & DOMAIN EDITOR
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>TEAM NAME</label>
                  <input
                    type="text"
                    value={state.teamName}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateWorkflowState((prev) => ({ ...prev, teamName: val }));
                      refreshState();
                    }}
                    style={{ width: "100%", background: "#000", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.75rem", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>TEAM UNIQUE ID</label>
                  <input
                    type="text"
                    value={state.teamId}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateWorkflowState((prev) => ({ ...prev, teamId: val }));
                      refreshState();
                    }}
                    style={{ width: "100%", background: "#000", border: "1px solid rgba(255,255,255,0.15)", color: "var(--cyan)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>SELECTED DOMAIN</label>
                  <select
                    value={state.selectedDomainId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const name = id === "agentic-ai" ? "AGENTIC AI" : id === "cyber-security" ? "CYBER SECURITY" : id === "computer-vision" ? "COMPUTER VISION" : "ROBOTICS & DRONES";
                      updateWorkflowState((prev) => ({ ...prev, selectedDomainId: id, selectedDomainName: name }));
                      refreshState();
                    }}
                    style={{ width: "100%", background: "#000", border: "1px solid rgba(255,255,255,0.15)", color: "var(--pink)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", padding: "0.4rem" }}
                  >
                    <option value="cyber-security">CYBER SECURITY</option>
                    <option value="agentic-ai">AGENTIC AI</option>
                    <option value="computer-vision">COMPUTER VISION</option>
                    <option value="robotics-drones">ROBOTICS & DRONES</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 1: PAYMENT VERIFICATION */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "1.5px", marginBottom: "0.85rem" }}>
                // 1. PAYMENT VERIFICATION
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>CURRENT PAYMENT STATUS</div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    color:
                      state.paymentStatus === "APPROVED"
                        ? "#00ff88"
                        : state.paymentStatus === "REJECTED"
                        ? "var(--pink)"
                        : "var(--primary)",
                    marginTop: "0.2rem",
                  }}
                >
                  {state.paymentStatus}
                </div>
              </div>

              {state.paymentProof && (
                <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)" }}>
                  <div>UTR Ref: <span style={{ color: "var(--cyan)" }}>{state.paymentProof.utrRef}</span></div>
                  <div>Submitted: {state.paymentProof.submittedAt}</div>
                  {state.paymentProof.rejectionReason && (
                    <div style={{ color: "var(--pink)", marginTop: "0.3rem" }}>Note: {state.paymentProof.rejectionReason}</div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
                <button
                  onClick={handleApprove}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.7rem",
                    background: "rgba(0,255,136,0.15)",
                    border: "1px solid #00ff88",
                    color: "#00ff88",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    letterSpacing: "1px",
                  }}
                >
                  <CheckCircle size={15} /> APPROVE PAYMENT (GENERATE QR)
                </button>

                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.7rem",
                      background: "rgba(233,30,140,0.15)",
                      border: "1px solid var(--pink)",
                      color: "var(--pink)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      letterSpacing: "1px",
                    }}
                  >
                    <XCircle size={15} /> REJECT PAYMENT (PROMPT RESUBMISSION)
                  </button>
                ) : (
                  <div style={{ padding: "0.75rem", background: "rgba(233,30,140,0.06)", border: "1px solid rgba(233,30,140,0.3)" }}>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--pink)", marginBottom: "0.4rem" }}>
                      REJECTION REASON (VISIBLE TO LEADER)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={2}
                      style={{ width: "100%", background: "#000", border: "1px solid var(--pink)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.7rem", padding: "0.5rem" }}
                    />
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button
                        onClick={handleReject}
                        style={{ flex: 1, padding: "0.4rem", background: "var(--pink)", color: "#fff", border: "none", fontFamily: "var(--font-heading)", fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        CONFIRM REJECTION
                      </button>
                      <button
                        onClick={() => setShowRejectForm(false)}
                        style={{ padding: "0.4rem 0.75rem", background: "transparent", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", cursor: "pointer" }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: FINAL HOURS PROJECT WINDOW & REOPEN SUBMISSION */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "1.5px", marginBottom: "0.85rem" }}>
                // 2. FINAL HOURS PROJECT & SUBMISSION LOCK
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>PROJECT SECTION STATUS</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: state.submissionWindowOpen ? "#00ff88" : "var(--pink)" }}>
                    {state.submissionWindowOpen ? "OPEN FOR SUBMISSION" : "LOCKED (BEFORE FINAL HOURS)"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <button
                  onClick={handleToggleFinalHours}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    background: state.submissionWindowOpen ? "rgba(233,30,140,0.15)" : "rgba(0,255,136,0.15)",
                    border: `1px solid ${state.submissionWindowOpen ? "var(--pink)" : "#00ff88"}`,
                    color: state.submissionWindowOpen ? "var(--pink)" : "#00ff88",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    letterSpacing: "1px",
                  }}
                >
                  <Clock size={15} />
                  {state.submissionWindowOpen ? "LOCK PROJECT WINDOW" : "OPEN PROJECT WINDOW (FINAL HOURS)"}
                </button>

                <button
                  onClick={() => {
                    updateWorkflowState((prev) => ({ ...prev, submissionReopened: !prev.submissionReopened }));
                    refreshState();
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.6rem",
                    background: state.submissionReopened ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${state.submissionReopened ? "var(--cyan)" : "rgba(255,255,255,0.2)"}`,
                    color: state.submissionReopened ? "var(--cyan)" : "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    letterSpacing: "1px",
                  }}
                >
                  {state.submissionReopened ? "🔒 LOCK SUBMISSION AGAIN" : "🔓 ADMIN REOPEN SUBMISSION (submissionReopened = true)"}
                </button>
              </div>
            </div>

            {/* SECTION 3: RESULTS PUBLISHING */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", letterSpacing: "1.5px", marginBottom: "0.85rem" }}>
                // 3. EVENT RESULTS PUBLICATION
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>RESULTS VISIBILITY</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: state.resultsPublished ? "#00ff88" : "var(--pink)" }}>
                    {state.resultsPublished ? "PUBLISHED (TEAMS CAN VIEW OWN RESULTS)" : "CLASSIFIED / HIDDEN"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleResults}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  background: state.resultsPublished ? "rgba(233,30,140,0.15)" : "rgba(253,191,21,0.15)",
                  border: `1px solid ${state.resultsPublished ? "var(--pink)" : "var(--primary)"}`,
                  color: state.resultsPublished ? "var(--pink)" : "var(--primary)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                <Trophy size={15} />
                {state.resultsPublished ? "UNPUBLISH RESULTS" : "PUBLISH RESULTS TO TEAMS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

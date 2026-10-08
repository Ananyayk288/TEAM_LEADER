"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getWorkflowState, type WorkflowState } from "@/lib/services/workflowService";
import { getProjectRecord } from "@/lib/services/projectService";

export default function SubmissionCard() {
  const [wfState, setWfState] = useState<WorkflowState | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [pptFileName, setPptFileName] = useState<string | null>(null);

  const loadData = () => {
    const s = getWorkflowState();
    setWfState(s);
    getProjectRecord().then((record) => {
      if (record?.submittedAt) setSubmittedAt(record.submittedAt);
      if (record?.data?.pptUrl) setPptFileName(record.data.pptUrl);
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener("vv_workflow_updated", loadData);
    return () => {
      window.removeEventListener("vv_workflow_updated", loadData);
    };
  }, []);

  const isSubmitted = wfState?.projectStatus === "SUBMITTED";
  const statusLabel = isSubmitted ? "SUBMITTED / LOCKED" : "NOT SUBMITTED";
  const statusColor = isSubmitted ? "#00ff88" : "var(--pink)";
  const statusBg = isSubmitted ? "rgba(0,255,136,0.1)" : "var(--pink-dim)";
  const statusIcon = isSubmitted ? "✓" : "⊘";
  const ctaLabel = isSubmitted ? "VIEW SUBMISSION" : "SUBMIT NOW";

  return (
    <div className="vv-card vv-corners" style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--primary)", letterSpacing: "1px", marginBottom: "1.2rem" }}>
        SUBMISSION STATUS
      </h2>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1rem" }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          border: `2px solid ${statusColor}`, background: statusBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", color: statusColor,
          boxShadow: `0 0 24px ${statusColor}55`,
        }}>{statusIcon}</div>

        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: statusColor, letterSpacing: "1px" }}>{statusLabel}</div>
          {isSubmitted && submittedAt && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#00ff88", marginTop: "0.3rem" }}>
              Submitted: {submittedAt}
            </div>
          )}
          {pptFileName && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--cyan)", marginTop: "0.3rem", wordBreak: "break-all" }}>
              🔗 {pptFileName}
            </div>
          )}
        </div>

        <div style={{ textAlign: "left", width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", padding: "0.75rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "0.25rem" }}>DEADLINE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--primary)" }}>November 2, 2026 — 11:59 PM</div>
        </div>
      </div>

      <Link href="/project" style={{
        display: "block", marginTop: "1.2rem", textAlign: "center",
        background: !isSubmitted ? "var(--primary)" : "transparent",
        border: `1px solid ${!isSubmitted ? "var(--primary)" : statusColor}`,
        color: !isSubmitted ? "#000" : statusColor,
        padding: "0.75rem", fontFamily: "var(--font-heading)", fontSize: "0.9rem",
        letterSpacing: "1px", textDecoration: "none", transition: "var(--transition)",
        fontWeight: "bold"
      }}>{ctaLabel} ▶</Link>
    </div>
  );
}
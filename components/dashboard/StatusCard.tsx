"use client";
import { useEffect, useState } from "react";
import { getWorkflowState, type WorkflowState } from "@/lib/services/workflowService";

export default function StatusCard() {
  const [state, setState] = useState<WorkflowState | null>(null);

  const loadState = () => {
    setState(getWorkflowState());
  };

  useEffect(() => {
    loadState();
    window.addEventListener("vv_workflow_updated", loadState);
    return () => window.removeEventListener("vv_workflow_updated", loadState);
  }, []);

  const isPending = state?.paymentStatus === "PENDING";
  const isApproved = state?.paymentStatus === "APPROVED";
  const isSubmitted = state?.projectStatus === "SUBMITTED";
  const isFinalOpen = state?.submissionWindowOpen;

  const stages = [
    { label: "1. TEAM REGISTERED & DOMAIN SELECTED", complete: true, active: false },
    { label: isPending ? "2. PAYMENT VERIFICATION PENDING" : "2. PAYMENT & PROOF VERIFICATION", complete: isApproved, active: !isApproved },
    { label: "3. EVENT DAY & TEAM QR CHECK-IN", complete: isApproved && !!state?.checkedIn, active: isApproved && !isSubmitted },
    { label: "4. FINAL PROJECT SUBMISSION", complete: isSubmitted, active: isApproved && isFinalOpen && !isSubmitted },
    { label: "5. JUDGING & SCORECARD EVALUATION", complete: !!state?.resultsPublished, active: !!state?.resultsPublished },
  ];

  const completedCount = stages.filter((s) => s.complete).length;
  const overallPercent = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="vv-card vv-corners" style={{ padding: "1.5rem", height: "100%" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--cyan)", letterSpacing: "1px", marginBottom: "1.2rem" }}>
        MISSION PROGRESS & STATUS
      </h2>

      {/* Big percent */}
      <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "3.5rem", color: "var(--primary)", lineHeight: 1 }} className="text-glow-yellow">
          {overallPercent}%
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0", letterSpacing: "1px" }}>OVERALL COMPLETION</div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.07)", height: "6px", borderRadius: "2px", marginBottom: "1.5rem", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${overallPercent}%`,
          background: "linear-gradient(90deg,var(--cyan),var(--primary))",
          boxShadow: "0 0 10px var(--cyan-glow)",
          transition: "width 1s ease",
        }} />
      </div>

      {/* Stage pipeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {stages.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            opacity: 1,
          }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${s.complete ? "var(--primary)" : s.active ? "var(--cyan)" : "rgba(255,255,255,0.2)"}`,
              background: s.complete ? "var(--primary)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", color: s.complete ? "#000" : "#9AA8C0", fontWeight: "bold",
              boxShadow: s.active ? "0 0 10px var(--cyan-glow)" : "none",
            }}>{s.complete ? "✓" : s.active ? "▶" : ""}</div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.78rem",
              color: s.complete ? "var(--primary)" : s.active ? "var(--cyan)" : "#9AA8C0",
              letterSpacing: "0.5px",
            }}>{s.label}</div>
            {s.active && (
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--cyan)", animation: "terminal-blink 1s step-end infinite" }}>NOW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
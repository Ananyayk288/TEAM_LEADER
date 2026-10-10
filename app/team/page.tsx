"use client";
import React, { useState, useEffect } from "react";
import { getWorkflowState, type WorkflowState, type TeamMember } from "@/lib/services/workflowService";
import { CheckCircle2, Shield, User, Mail, Phone, Building, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";

export default function TeamPage() {
  const [state, setState] = useState<WorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = getWorkflowState();
      setState(data);
    } catch {
      setHasError(true);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("vv_workflow_updated", loadData);
    return () => window.removeEventListener("vv_workflow_updated", loadData);
  }, []);

  if (isLoading) {
    return (
      <main style={{ paddingBottom: "3rem", minHeight: "100vh", background: "var(--bg-deep)" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <SkeletonText width="40%" height="2rem" />
          <SkeletonCard height="160px" />
          <SkeletonCard height="320px" />
        </div>
      </main>
    );
  }

  if (hasError || !state) {
    return (
      <main style={{ paddingBottom: "3rem", minHeight: "100vh", background: "var(--bg-deep)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="vv-card vv-corners" style={{ padding: "3rem", textAlign: "center", maxWidth: "500px" }}>
          <AlertTriangle size={36} style={{ color: "var(--pink)", margin: "0 auto 1rem" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
            UNABLE TO LOAD TEAM DATA
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            No registered team record could be retrieved for this session credentials.
          </p>
          <button onClick={loadData} className="vv-button" style={{ fontSize: "0.9rem", padding: "0.75rem 1.5rem" }}>
            <RefreshCw size={14} /> RETRY LOADING
          </button>
        </div>
      </main>
    );
  }

  const members: TeamMember[] = state.members || [];
  const leader = members.find((m) => m.isLeader) || members[0];
  const paymentStatus = state.paymentStatus || "UNPAID";

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case "APPROVED":
        return { label: "CONFIRMED & READY", color: "#00FF88", bg: "rgba(0,255,136,0.1)" };
      case "PENDING":
        return { label: "PAYMENT UNDER REVIEW", color: "var(--cyan)", bg: "rgba(56,225,232,0.1)" };
      default:
        return { label: "PAYMENT PENDING", color: "var(--pink)", bg: "rgba(255,15,90,0.1)" };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <main style={{ paddingBottom: "3rem", minHeight: "100vh", background: "var(--bg-deep)" }}>
      <div className="vv-main-container">

        {/* HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--pink)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
            // PRE-REGISTERED TEAM INFORMATION
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.1 }}>
                SQUAD ROSTER & METADATA
              </h1>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#9AA8C0", marginTop: "0.3rem" }}>
                Pre-registered team records & domain selection for ViceVerse 2026.
              </p>
            </div>

            {/* STATUS BADGE */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 1.25rem", background: statusBadge.bg, border: `1px solid ${statusBadge.color}`, borderRadius: "4px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusBadge.color, boxShadow: `0 0 8px ${statusBadge.color}` }} />
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: statusBadge.color, letterSpacing: "1px" }}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* TEAM & DOMAIN OVERVIEW CARD */}
        <div className="vv-card vv-corners" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // OFFICIAL TEAM RECORD (READ-ONLY)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {/* TEAM NAME */}
            <div style={{ padding: "1.1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0", letterSpacing: "1px" }}>TEAM NAME</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--primary)", marginTop: "0.25rem" }}>{state.teamName}</div>
            </div>

            {/* TEAM UNIQUE ID WITH COPY BUTTON */}
            <div style={{ padding: "1.1rem", background: "#0E1626", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0", letterSpacing: "1px" }}>TEAM UNIQUE ID</div>
                <CopyButton value={state.teamId} label="COPY" toastMessage={`Copied Team ID: ${state.teamId}`} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "var(--cyan)", fontWeight: 700 }}>{state.teamId}</div>
            </div>

            {/* SELECTED DOMAIN */}
            <div style={{ padding: "1.1rem", background: "rgba(255,15,90,0.06)", border: "1px solid rgba(255,15,90,0.25)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#FF0F5A", letterSpacing: "1px" }}>SELECTED DOMAIN</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "#FF0F5A", marginTop: "0.25rem" }}>
                {state.selectedDomainName || "CYBER SECURITY"}
              </div>
            </div>

            {/* INSTITUTION / COLLEGE */}
            <div style={{ padding: "1.1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0", letterSpacing: "1px" }}>INSTITUTION</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "#C5CEDF", marginTop: "0.25rem", fontWeight: 600 }}>{state.college || "VVCE Mysuru"}</div>
            </div>
          </div>
        </div>

        {/* TEAM LEADER CONTACT DETAILS CARD */}
        {leader && (
          <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "2px", marginBottom: "1rem" }}>
              // REGISTERED TEAM LEADER
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", padding: "1.1rem", background: "rgba(230,16,80,0.05)", border: "1px solid rgba(230,16,80,0.25)", borderRadius: "4px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "2px solid var(--primary)", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--primary)", flexShrink: 0 }}>
                {leader.initials}
              </div>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.1rem", color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {leader.name} <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--primary)", marginLeft: "0.5rem" }}>[TEAM LEADER]</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#B8C2D6", marginTop: "0.4rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Mail size={14} style={{ color: "var(--cyan)" }} /> {leader.email || state.leaderEmail}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Phone size={14} style={{ color: "var(--pink)" }} /> {leader.phone || state.leaderPhone}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Building size={14} style={{ color: "var(--primary)" }} /> {leader.branch}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULL MEMBER ROSTER CARD */}
        <div className="vv-card vv-corners" style={{ padding: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.5rem" }}>
            // COMPLETE TEAM MEMBER ROSTER ({members.length} REGISTERED MEMBERS)
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {members.map((m, idx) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1.25rem",
                  background: m.isLeader ? "rgba(230,16,80,0.06)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${m.isLeader ? "rgba(230,16,80,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "4px",
                  flexWrap: "wrap"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: `2px solid ${m.accentColor || "var(--cyan)"}`,
                    background: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1rem",
                    color: m.accentColor || "var(--cyan)",
                    flexShrink: 0,
                  }}
                >
                  {m.initials}
                </div>

                <div style={{ flex: 1, minWidth: "240px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.05rem", color: "#FFFFFF" }}>
                      {m.name}
                    </span>
                    <span style={{ padding: "0.2rem 0.6rem", background: "rgba(56,225,232,0.15)", border: "1px solid rgba(56,225,232,0.3)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--cyan)", borderRadius: "3px", letterSpacing: "1px" }}>
                      MEMBER {idx + 1}
                    </span>
                  </div>

                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#B8C2D6", display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.3rem" }}>
                    <span>Role: <strong style={{ color: "#FFFFFF" }}>{m.role}</strong></span>
                    <span>Branch/Dept: <strong style={{ color: "var(--cyan)" }}>{m.branch}</strong></span>
                    {m.email && <span>Email: <span style={{ color: "#8FA0BA" }}>{m.email}</span></span>}
                    {m.phone && <span>Phone: <span style={{ color: "#8FA0BA" }}>{m.phone}</span></span>}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#00FF88", fontWeight: 600 }}>REGISTERED</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: "1.75rem", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#8FA0BA", margin: 0 }}>
            All team member details are pre-registered and verified. Contact your assigned SPOC if you require updates.
          </p>
        </div>
      </div>
    </main>
  );
}
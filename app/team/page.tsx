"use client";
import React, { useState, useEffect } from "react";
import { getWorkflowState, type WorkflowState } from "@/lib/services/workflowService";
import { CheckCircle2, AlertCircle, Shield, Users, Target } from "lucide-react";

export default function TeamPage() {
  const [state, setState] = useState<WorkflowState | null>(null);

  const loadState = () => {
    setState(getWorkflowState());
  };

  useEffect(() => {
    loadState();
    window.addEventListener("vv_workflow_updated", loadState);
    return () => window.removeEventListener("vv_workflow_updated", loadState);
  }, []);

  if (!state) return null;

  const members = state.members;
  const count = members.length;
  const isComplete = count === 3;

  const statusText = isComplete
    ? "3/3 Team Complete"
    : `${count}/3 Members`;

  return (
    <main style={{ paddingBottom: "3rem", minHeight: "100vh", background: "var(--bg-deep)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
            // SECTION 02: SQUAD ROSTER & DOMAIN
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.1 }}>
              SQUAD ROSTER & DOMAIN
            </h1>

            {/* Clear Team Status Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 1.25rem",
                background: isComplete ? "rgba(0,255,136,0.1)" : "rgba(233,30,140,0.1)",
                border: `1px solid ${isComplete ? "#00ff88" : "var(--pink)"}`,
              }}
            >
              {isComplete ? (
                <CheckCircle2 size={18} style={{ color: "#00ff88" }} />
              ) : (
                <AlertCircle size={18} style={{ color: "var(--pink)" }} />
              )}
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: isComplete ? "#00ff88" : "var(--pink)", letterSpacing: "1.5px" }}>
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Team & Domain Metadata Card */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // TEAM METADATA (VIEW ONLY)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem" }}>
            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "1px" }}>TEAM NAME</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--primary)", marginTop: "0.2rem" }}>{state.teamName}</div>
            </div>

            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "1px" }}>TEAM UNIQUE ID</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--cyan)", marginTop: "0.2rem", fontWeight: "bold" }}>{state.teamId}</div>
            </div>

            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "1px" }}>TEAM STRENGTH</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: isComplete ? "#00ff88" : "var(--pink)", marginTop: "0.2rem" }}>{statusText}</div>
            </div>

            {/* PERSISTED SELECTED DOMAIN DISPLAY */}
            <div style={{ padding: "1rem", background: "rgba(233,30,140,0.06)", border: "1px solid rgba(233,30,140,0.25)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--pink)", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Target size={12} /> SELECTED DOMAIN
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--pink)", marginTop: "0.2rem" }}>
                {state.selectedDomainName || "Cybersecurity & Defense"}
              </div>
            </div>
          </div>
        </div>

        {/* Squad Members Roster */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // SQUAD ROSTER (EXACTLY 3 MEMBERS REQUIRED)
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {members.map((m, index) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1.1rem 1.25rem",
                  background: m.isLeader ? "rgba(253,191,21,0.05)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${m.isLeader ? "rgba(253,191,21,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: `2px solid ${m.accentColor}`,
                    background: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1rem",
                    color: m.accentColor,
                    boxShadow: `0 0 14px ${m.accentColor}44`,
                    flexShrink: 0,
                  }}
                >
                  {m.initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", color: "var(--text-main)" }}>
                      {m.name}
                    </span>
                    {m.isLeader && (
                      <span style={{ padding: "0.15rem 0.5rem", background: "var(--primary)", fontFamily: "var(--font-heading)", fontSize: "0.58rem", color: "#000", letterSpacing: "1px" }}>
                        MEMBER 1 (LEADER)
                      </span>
                    )}
                    {!m.isLeader && (
                      <span style={{ padding: "0.15rem 0.5rem", background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--cyan)", letterSpacing: "1px" }}>
                        MEMBER {index + 1}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {m.role} · {m.branch} {m.email ? `· ${m.email}` : ""}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#00ff88" }}>VERIFIED</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: "1.75rem", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>
            Squad roster is established and locked. Contact your SPOC to request roster modifications.
          </p>
        </div>
      </div>
    </main>
  );
}
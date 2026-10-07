"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getWorkflowState,
  type WorkflowState,
} from "@/lib/services/workflowService";
import { ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

// ─── TEAM QR CARD (Generated ONLY upon Admin Approval) ────────────────────────
function TeamQRCard({ teamId, teamName, isApproved }: { teamId: string; teamName: string; isApproved: boolean }) {
  if (!isApproved) {
    return (
      <div className="vv-card vv-corners" style={{ padding: "2rem", height: "100%", border: "1px solid rgba(233,30,140,0.3)", background: "rgba(233,30,140,0.03)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
          // TEAM QR — LOCKED
        </div>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(233,30,140,0.1)", border: "1px solid var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <ShieldAlert size={28} style={{ color: "var(--pink)" }} />
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--pink)", marginBottom: "0.5rem" }}>
          PAYMENT VERIFICATION PENDING
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Team QR Code is generated only after Admin verifies your payment proof.
        </p>
        <Link
          href="/payment"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.25rem",
            background: "var(--pink)",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontSize: "0.78rem",
            letterSpacing: "1px",
            textDecoration: "none",
          }}
        >
          CHECK PAYMENT STATUS <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="vv-card animate-slide-up" style={{ padding: "1.75rem", height: "100%", border: "1px solid var(--border-yellow)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "14px", height: "14px", borderTop: "2px solid var(--primary)", borderLeft: "2px solid var(--primary)" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "14px", height: "14px", borderBottom: "2px solid var(--cyan)", borderRight: "2px solid var(--cyan)" }} />

      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
        // OFFICIAL EVENT TEAM QR CODE
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "#000", border: "1px solid rgba(0,255,136,0.3)", position: "relative" }}>
        <div style={{ width: "160px", height: "160px", background: "#fff", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            <path fill="#000" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M50,40 h20 v20 h-20 z M80,80 h20 v20 h-20 z M30,50 h10 v30 h-10 z" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "#00ff88", letterSpacing: "2px", marginBottom: "0.2rem" }}>
            {teamName}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--cyan)", letterSpacing: "1px" }}>
            TEAM ID: {teamId}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#00ff88", marginTop: "0.5rem", letterSpacing: "1px" }}>
            ✓ VERIFIED FOR CLUB CHECK-IN
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
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

  const isApproved = state.paymentStatus === "APPROVED";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-deep)", paddingBottom: "3rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
            // EVENT DAY & ATTENDANCE DECK
          </div>
          <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,3rem)", lineHeight: 1.1, marginBottom: "0.85rem" }}>
            TEAM EVENT STATUS & QR
          </h1>

          {/* Status Banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              background: isApproved ? "rgba(0,255,136,0.07)" : "rgba(233,30,140,0.07)",
              border: `1px solid ${isApproved ? "rgba(0,255,136,0.4)" : "rgba(233,30,140,0.4)"}`,
              padding: "0.85rem 1.5rem",
            }}
          >
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: isApproved ? "#00ff88" : "var(--pink)", boxShadow: `0 0 12px ${isApproved ? "#00ff88" : "var(--pink)"}` }} />
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: isApproved ? "#00ff88" : "var(--pink)", letterSpacing: "1px" }}>
                {isApproved ? "READY FOR EVENT ✓" : "PAYMENT VERIFICATION PENDING"}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "0.15rem" }}>
                {isApproved ? "Your squad is confirmed and ready for ViceVerse." : "Upload payment proof in Payment section to unlock Team QR."}
              </div>
            </div>
          </div>
        </div>

        {/* Squad Status Grid */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // SQUAD OVERVIEW
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "0.75rem" }}>
            <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>TEAM NAME</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--primary)" }}>{state.teamName}</div>
            </div>
            <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>TEAM ID</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)" }}>{state.teamId}</div>
            </div>
            <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>MEMBERS</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--text-main)" }}>{state.members.length} / 3</div>
            </div>
            <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>DOMAIN</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)" }}>{state.selectedDomainName || "Cybersecurity"}</div>
            </div>
            <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>PAYMENT STATUS</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: isApproved ? "#00ff88" : "var(--pink)" }}>{state.paymentStatus}</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Squad Roster + Team QR Card */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Squad Roster */}
          <div className="vv-card vv-corners" style={{ padding: "1.75rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
              // CONFIRMED ROSTER
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {state.members.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem", background: m.isLeader ? "rgba(253,191,21,0.05)" : "rgba(255,255,255,0.025)", border: `1px solid ${m.isLeader ? "rgba(253,191,21,0.25)" : "rgba(255,255,255,0.07)"}` }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `2px solid ${m.accentColor}`, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: m.accentColor }}>
                    {m.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>{m.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>{m.branch} · {m.role}</div>
                  </div>
                  {m.isLeader && (
                    <span style={{ padding: "0.15rem 0.45rem", background: "var(--primary)", fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#000" }}>LEADER</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team QR Card */}
          <TeamQRCard teamId={state.teamId} teamName={state.teamName} isApproved={isApproved} />
        </div>
      </div>
    </main>
  );
}

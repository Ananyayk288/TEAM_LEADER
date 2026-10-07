"use client";
import React, { useState, useEffect } from "react";
import {
  Trophy,
  Lock,
  Award,
  Sparkles,
  Layers,
  FileText,
  CheckCircle,
} from "lucide-react";
import {
  getWorkflowState,
  type WorkflowState,
} from "@/lib/services/workflowService";

export default function ResultsPage() {
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

  const isPublished = state.resultsPublished;
  const result = state.teamResult;

  return (
    <main style={{ paddingBottom: "3rem", minHeight: "100vh", background: "var(--bg-deep)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
            // SECTION 09: EVALUATION & RESULTS
          </div>
          <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            OFFICIAL MISSION RESULTS
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
            Official round scores, standings, and evaluator feedback for squad <span style={{ color: "var(--primary)" }}>{state.teamName}</span>.
          </p>
        </div>

        {!isPublished ? (
          /* LOCKED / UNPUBLISHED STATE */
          <div className="vv-card vv-corners" style={{ padding: "3.5rem 2rem", textAlign: "center", border: "1px solid rgba(253,191,21,0.2)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(253,191,21,0.08)", border: "1px solid var(--border-yellow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Lock size={28} style={{ color: "var(--primary)" }} />
            </div>

            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
              // EVALUATION IN PROGRESS
            </div>

            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--primary)", letterSpacing: "1.5px", marginBottom: "1rem" }}>
              RESULTS CLASSIFIED & LOCKED
            </div>

            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-dim)", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Evaluation scores for <strong style={{ color: "var(--primary)" }}>{state.teamName}</strong> are currently under review by the judging panel. Official results will be published here once authorized by the Event Admin.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 1.25rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--pink)", boxShadow: "0 0 8px var(--pink)", animation: "status-pulse 2s ease-in-out infinite" }} />
              STATUS: AWAITING ADMIN PUBLICATION
            </div>
          </div>
        ) : (
          /* PUBLISHED OWN RESULTS ONLY */
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="vv-card vv-corners" style={{ padding: "1.75rem", background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <CheckCircle size={20} style={{ color: "#00ff88" }} />
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#00ff88", letterSpacing: "1.5px" }}>
                  RESULTS PUBLISHED — OWN SQUAD PERFORMANCE
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-dim)", margin: 0 }}>
                Showing confidential evaluation data for squad <strong style={{ color: "var(--primary)" }}>{state.teamName} ({state.teamId})</strong>.
              </p>
            </div>

            {/* Score & Rank Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Card */}
              <div className="vv-card vv-corners" style={{ padding: "2rem", textAlign: "center", background: "rgba(253,191,21,0.04)", border: "1px solid var(--border-yellow)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
                  // TOTAL EVALUATION SCORE
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "3.5rem", color: "var(--primary)", lineHeight: 1 }} className="text-glow-yellow">
                  {result?.score ?? 94.5} <span style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}>/ 100</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--cyan)", marginTop: "0.75rem" }}>
                  SCORE VERIFIED BY JUDGING PANEL
                </div>
              </div>

              {/* Standing Rank Card */}
              <div className="vv-card vv-corners" style={{ padding: "2rem", textAlign: "center", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.3)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
                  // EVENT STANDING & RANK
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "3.5rem", color: "var(--cyan)", lineHeight: 1 }}>
                  #{result?.rank ?? 2} <span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>OF {result?.totalTeams ?? 48} TEAMS</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#00ff88", marginTop: "0.75rem" }}>
                  TOP TIER FINALIST QUALIFIED
                </div>
              </div>
            </div>

            {/* Detailed Criteria Breakdown */}
            <div className="vv-card vv-corners" style={{ padding: "1.75rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "1.5rem" }}>
                // CRITERIA SCORE BREAKDOWN
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div style={{ padding: "1.25rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>INNOVATION & NOVELTY</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--primary)" }}>{result?.innovationScore ?? 28} / 30</div>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>TECHNICAL EXECUTION</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--cyan)" }}>{result?.techScore ?? 34} / 35</div>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>PRESENTATION & PITCH</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--pink)" }}>{result?.presentationScore ?? 32.5} / 35</div>
                </div>
              </div>

              {/* Evaluator Remarks */}
              <div style={{ padding: "1.25rem", background: "rgba(253,191,21,0.03)", border: "1px solid rgba(253,191,21,0.18)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "1.5px", marginBottom: "0.5rem" }}>
                  EVALUATOR / JUDGE REMARKS
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>
                  "{result?.feedback || "Exceptional architecture with robust real-time security telemetry. Great presentation clarity."}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
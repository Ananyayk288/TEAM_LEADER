"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  RotateCcw,
} from "lucide-react";
import {
  getWorkflowState,
  submitPaymentProof,
  type WorkflowState,
} from "@/lib/services/workflowService";

export default function PaymentPage() {
  const [state, setState] = useState<WorkflowState | null>(null);
  const [utrRef, setUtrRef] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadState = () => {
    const s = getWorkflowState();
    setState(s);
    if (s.paymentProof?.utrRef) {
      setUtrRef(s.paymentProof.utrRef);
    }
  };

  useEffect(() => {
    loadState();
    window.addEventListener("vv_workflow_updated", loadState);
    return () => window.removeEventListener("vv_workflow_updated", loadState);
  }, []);

  if (!state) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrRef.trim() || utrRef.trim().length < 6) {
      setError("Please enter a valid Transaction UTR / Ref (at least 6 characters)");
      return;
    }
    setError("");
    setSubmitting(true);

    setTimeout(() => {
      submitPaymentProof(utrRef.trim(), fileName || "payment_receipt.png");
      setSubmitting(false);
      loadState();
    }, 600);
  };

  const isPending = state.paymentStatus === "PENDING";
  const isApproved = state.paymentStatus === "APPROVED";
  const isRejected = state.paymentStatus === "REJECTED";

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
          // SECTION 05: REGISTRATION FEE & PROOF
        </div>
        <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
          MISSION FEES & VERIFICATION
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
          Complete squad registration payment via QR code and upload proof for Admin Verification.
        </p>
      </div>

      {/* ─── STATUS BANNERS ─── */}

      {/* APPROVED BANNER */}
      {isApproved && (
        <div
          className="vv-card vv-corners"
          style={{
            padding: "1.75rem",
            marginBottom: "2rem",
            background: "rgba(0,255,136,0.06)",
            border: "1px solid rgba(0,255,136,0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(0,255,136,0.15)", border: "2px solid #00ff88", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle2 size={24} style={{ color: "#00ff88" }} />
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "#00ff88", letterSpacing: "1px" }}>
                PAYMENT VERIFIED & APPROVED ✓
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(0,255,136,0.8)", marginTop: "0.25rem" }}>
                Your payment has been verified by the Event Admin. Team QR Code is generated and unlocked!
              </div>
            </div>
            <Link
              href="/confirmed"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "#00ff88",
                color: "#000",
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                letterSpacing: "1.5px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              VIEW TEAM QR <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* PENDING BANNER */}
      {isPending && (
        <div
          className="vv-card vv-corners"
          style={{
            padding: "1.75rem",
            marginBottom: "2rem",
            background: "rgba(253,191,21,0.05)",
            border: "1px solid rgba(253,191,21,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(253,191,21,0.15)", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Clock size={22} style={{ color: "var(--primary)" }} />
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--primary)", letterSpacing: "1px" }}>
                PAYMENT PROOF SUBMITTED — AWAITING VERIFICATION
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
                UTR: <span style={{ color: "var(--cyan)" }}>{state.paymentProof?.utrRef}</span> · Submitted on {state.paymentProof?.submittedAt}
              </div>
            </div>
            <div style={{ padding: "0.5rem 1rem", background: "rgba(253,191,21,0.1)", border: "1px solid rgba(253,191,21,0.3)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--primary)" }}>
              STATUS: PENDING
            </div>
          </div>
        </div>
      )}

      {/* REJECTED BANNER */}
      {isRejected && (
        <div
          className="vv-card vv-corners"
          style={{
            padding: "1.75rem",
            marginBottom: "2rem",
            background: "rgba(233,30,140,0.06)",
            border: "1px solid rgba(233,30,140,0.4)",
            borderLeft: "4px solid var(--pink)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(233,30,140,0.15)", border: "2px solid var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.15rem" }}>
              <AlertTriangle size={20} style={{ color: "var(--pink)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--pink)", letterSpacing: "1px" }}>
                PAYMENT PROOF REJECTED BY ADMIN
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-main)", margin: "0.4rem 0 0.6rem 0", lineHeight: 1.5 }}>
                Reason: <span style={{ color: "var(--pink)", fontWeight: "bold" }}>{state.paymentProof?.rejectionReason || "Invalid UTR / Payment receipt unclear."}</span>
              </p>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                Please check your transaction details and resubmit a clear screenshot or corrected UTR number below.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN PAYMENT & PROOF CARD ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN: UPI & QR CODE */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
              // STEP 1: SCAN & PAY VIA QR
            </div>

            {/* Team details */}
            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>TEAM:</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--primary)" }}>{state.teamName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>TEAM ID:</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--cyan)" }}>{state.teamId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>REGISTRATION FEE:</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#00ff88" }}>₹ 500 INR</span>
              </div>
            </div>

            {/* QR Code Graphic Box */}
            <div
              style={{
                background: "#000",
                border: "2px dashed var(--border-yellow)",
                padding: "1.5rem",
                textAlign: "center",
                position: "relative",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ position: "absolute", top: "8px", left: "8px", width: "12px", height: "12px", borderTop: "2px solid var(--primary)", borderLeft: "2px solid var(--primary)" }} />
              <div style={{ position: "absolute", top: "8px", right: "8px", width: "12px", height: "12px", borderTop: "2px solid var(--pink)", borderRight: "2px solid var(--pink)" }} />
              <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "12px", height: "12px", borderBottom: "2px solid var(--cyan)", borderLeft: "2px solid var(--cyan)" }} />
              <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "12px", height: "12px", borderBottom: "2px solid #00ff88", borderRight: "2px solid #00ff88" }} />

              {/* QR Code Simulated Box */}
              <div style={{ width: "140px", height: "140px", margin: "0 auto 1rem", background: "#fff", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                  <path fill="#000" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M50,40 h20 v20 h-20 z M80,80 h20 v20 h-20 z M30,50 h10 v30 h-10 z" />
                </svg>
              </div>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "0.2rem" }}>
                OFFICIAL UPI ID
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)", letterSpacing: "1.5px" }}>
                vvce.ivcclub@upi
              </div>
            </div>
          </div>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
            Scan using PhonePe, Google Pay, Paytm or any UPI App to pay ₹500.
          </div>
        </div>

        {/* RIGHT COLUMN: PROOF UPLOAD FORM */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // STEP 2: UPLOAD PAYMENT PROOF
          </div>

          <form onSubmit={handleSubmitProof}>
            {/* Transaction UTR / Ref Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-main)", letterSpacing: "1.5px", marginBottom: "0.45rem" }}>
                TRANSACTION UTR / REF NUMBER <span style={{ color: "var(--pink)" }}>*</span>
              </label>
              <input
                type="text"
                value={utrRef}
                onChange={(e) => setUtrRef(e.target.value)}
                disabled={isApproved}
                placeholder="e.g. 429018491024 or UPI-9048..."
                style={{
                  width: "100%",
                  background: isApproved ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.6)",
                  border: `1px solid ${error ? "var(--pink)" : "rgba(255,255,255,0.15)"}`,
                  color: "var(--text-main)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  padding: "0.8rem 1rem",
                  outline: "none",
                }}
              />
              {error && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--pink)", marginTop: "0.35rem" }}>⚠ {error}</div>}
            </div>

            {/* Proof Screenshot Upload Input */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-main)", letterSpacing: "1.5px", marginBottom: "0.45rem" }}>
                PAYMENT RECEIPT / SCREENSHOT
              </label>

              <div
                style={{
                  border: "1px dashed rgba(255,255,255,0.2)",
                  background: "rgba(0,0,0,0.4)",
                  padding: "1.25rem",
                  textAlign: "center",
                  cursor: isApproved ? "default" : "pointer",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  disabled={isApproved}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: isApproved ? "default" : "pointer",
                    width: "100%",
                  }}
                />
                <Upload size={24} style={{ color: fileName ? "#00ff88" : "var(--text-muted)", margin: "0 auto 0.5rem" }} />
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", color: fileName ? "#00ff88" : "var(--text-dim)" }}>
                  {fileName ? fileName : "CLICK TO CHOOSE SCREENSHOT"}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  PNG, JPG, or PDF (Max 5MB)
                </div>
              </div>
            </div>

            {/* Submit / Resubmit Button */}
            {!isApproved && (
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.9rem",
                  background: isRejected ? "var(--pink)" : "var(--primary)",
                  border: "none",
                  color: "#000",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  letterSpacing: "2px",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 0 16px rgba(253,191,21,0.2)",
                }}
              >
                {submitting ? (
                  <>
                    <div className="vv-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#000" }} />
                    TRANSMITTING PROOF...
                  </>
                ) : isRejected ? (
                  <>
                    <RotateCcw size={16} /> RESUBMIT PAYMENT PROOF
                  </>
                ) : (
                  <>
                    <FileCheck size={16} /> SUBMIT PROOF FOR VERIFICATION
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
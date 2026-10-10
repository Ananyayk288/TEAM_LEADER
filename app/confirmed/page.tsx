"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getWorkflowState,
  submitPaymentProof,
  type WorkflowState,
} from "@/lib/services/workflowService";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  FileCheck,
  RotateCcw,
  HelpCircle,
  Mail,
  User,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

// ─── TEAM QR CARD (Generated ONLY upon Admin Approval) ────────────────────────
function TeamQRCard({ teamId, teamName, isApproved }: { teamId: string; teamName: string; isApproved: boolean }) {
  if (!isApproved) {
    return (
      <div className="vv-card vv-corners" style={{ padding: "2rem", height: "100%", border: "1px solid rgba(253,191,21,0.3)", background: "rgba(253,191,21,0.03)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
          // TEAM QR — LOCKED UNTIL APPROVAL
        </div>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(253,191,21,0.1)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <ShieldAlert size={28} style={{ color: "var(--primary)" }} />
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
          PAYMENT VERIFICATION PENDING
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Team QR Code & Registration Confirmation are unlocked only after Admin verifies and approves your payment proof.
        </p>
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
  const [utrRef, setUtrRef] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

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
      showToast(`Selected file: ${e.target.files[0].name}`, "info");
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrRef.trim() || utrRef.trim().length < 6) {
      const msg = "Please enter a valid Transaction UTR / Ref (at least 6 characters)";
      setError(msg);
      showToast(msg, "error");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      let uploadedUrl = "";
      let uploadedFileName = fileName || "payment_receipt.png";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await fetch("/api/payment/upload", {
          method: "POST",
          body: formData,
          credentials: "same-origin",
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.fileUrl;
          uploadedFileName = uploadData.fileName;
        }
      }

      const res = await fetch("/api/payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utrRef: utrRef.trim(),
          proofUrl: uploadedUrl,
          proofFileName: uploadedFileName,
        }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit payment proof");
      }

      submitPaymentProof(utrRef.trim(), uploadedFileName);
      showToast("Payment proof submitted successfully! Verification pending.", "success");
      loadState();
    } catch (err: any) {
      const msg = err?.message || "Error submitting payment proof";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = state.paymentStatus === "PENDING";
  const isApproved = state.paymentStatus === "APPROVED";
  const isRejected = state.paymentStatus === "REJECTED";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-deep)", paddingBottom: "3rem" }}>
      <div className="vv-main-container">
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "0.5rem" }}>
            // EVENT DAY & ATTENDANCE DECK
          </div>
          <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.1, marginBottom: "0.85rem" }}>
            TEAM, EVENT STATUS & QR
          </h1>

          {/* Status Summary Banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              background: isApproved
                ? "rgba(0,255,136,0.07)"
                : isRejected
                ? "rgba(233,30,140,0.07)"
                : "rgba(253,191,21,0.07)",
              border: `1px solid ${
                isApproved
                  ? "rgba(0,255,136,0.4)"
                  : isRejected
                  ? "rgba(233,30,140,0.4)"
                  : "rgba(253,191,21,0.4)"
              }`,
              padding: "0.85rem 1.5rem",
              borderRadius: "4px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: isApproved ? "#00ff88" : isRejected ? "var(--pink)" : "var(--primary)",
                boxShadow: `0 0 12px ${isApproved ? "#00ff88" : isRejected ? "var(--pink)" : "var(--primary)"}`,
              }}
            />
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: isApproved ? "#00ff88" : isRejected ? "var(--pink)" : "var(--primary)", letterSpacing: "1px" }}>
                {isApproved
                  ? "REGISTRATION SUCCESSFUL ✓"
                  : isRejected
                  ? "CORRECTION REQUIRED"
                  : isPending
                  ? "PAYMENT VERIFICATION PENDING"
                  : "PAYMENT PROOF REQUIRED"}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0", marginTop: "0.15rem" }}>
                {isApproved
                  ? "Confirmation Email Sent — Team registration active & Team QR unlocked."
                  : isRejected
                  ? "Your payment proof was rejected. Please review instructions and resubmit below."
                  : "After payment confirmation, an email will be sent regarding successful registration of participation."}
              </div>
            </div>
          </div>
        </div>

        {/* ─── PAYMENT & REGISTRATION STATUS DASHBOARD (Driven by actual data) ─── */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // PAYMENT & REGISTRATION STATUS
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {/* Box 1: Payment Status */}
            <div style={{ padding: "1rem 1.1rem", background: "rgba(0,0,0,0.45)", border: `1px solid ${isApproved ? "rgba(0,255,136,0.3)" : isRejected ? "rgba(233,30,140,0.3)" : "rgba(253,191,21,0.3)"}`, borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                Payment Status:
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: isApproved ? "#00ff88" : isRejected ? "var(--pink)" : "var(--primary)", fontWeight: 700 }}>
                {isApproved ? "Verified & Approved" : isRejected ? "Payment Rejected" : isPending ? "Pending Verification" : "Payment Pending"}
              </div>
            </div>

            {/* Box 2: Registration Status */}
            <div style={{ padding: "1rem 1.1rem", background: "rgba(0,0,0,0.45)", border: `1px solid ${isApproved ? "rgba(0,255,136,0.3)" : isRejected ? "rgba(233,30,140,0.3)" : "rgba(56,225,232,0.3)"}`, borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                Registration Status:
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: isApproved ? "#00ff88" : isRejected ? "var(--pink)" : "var(--cyan)", fontWeight: 700 }}>
                {isApproved ? "Registration Successful" : isRejected ? "Correction Required" : "Awaiting Confirmation"}
              </div>
            </div>

            {/* Box 3: Notification */}
            <div style={{ padding: "1rem 1.1rem", background: "rgba(0,0,0,0.45)", border: `1px solid ${isApproved ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                Notification:
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: isApproved ? "#00ff88" : "var(--text-main)", fontWeight: 600, lineHeight: 1.4 }}>
                {isApproved ? "Confirmation Email Sent" : "After payment confirmation, an email will be sent regarding successful registration of participation."}
              </div>
            </div>
          </div>

          {state.paymentProof && (
            <div style={{ marginTop: "1.25rem", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0" }}>
              <div>Transaction Ref: <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{state.paymentProof.utrRef}</span></div>
              <div>Submitted: <span style={{ color: "#E7EEF8" }}>{state.paymentProof.submittedAt}</span></div>
            </div>
          )}
        </div>

        {/* ─── PENDING STATE VIEW ─── */}
        {isPending && (
          <div className="animate-slide-up" style={{ marginBottom: "2rem" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Information Card (2 cols) */}
              <div className="md:col-span-2 vv-card vv-corners" style={{ padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--cyan)", letterSpacing: "1px", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <HelpCircle size={20} style={{ color: "var(--cyan)" }} /> Verification Process
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      Your payment proof is currently under review by the ViceVerse organizing team.
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      Once approved, your team registration becomes active and your official Team QR code unlocks.
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      An official confirmation email will be sent regarding your successful registration of participation.
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicator Card */}
              <div className="vv-card vv-corners" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "rgba(253,191,21,0.03)", border: "1px solid rgba(253,191,21,0.3)" }}>
                <Clock size={40} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
                  VERIFICATION IN QUEUE
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Verification is handled chronologically by administrators. Please check back shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── REJECTED STATE BANNER ─── */}
        {isRejected && (
          <div className="vv-card vv-corners mb-6" style={{ padding: "1.75rem", background: "rgba(233,30,140,0.06)", border: "1px solid rgba(233,30,140,0.4)", borderLeft: "4px solid var(--pink)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(233,30,140,0.15)", border: "2px solid var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.15rem" }}>
                <AlertTriangle size={20} style={{ color: "var(--pink)" }} />
              </div>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--pink)", letterSpacing: "1px" }}>
                  PAYMENT PROOF REJECTED BY ADMIN
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-main)", margin: "0.4rem 0 0.6rem 0", lineHeight: 1.5 }}>
                  Correction Instruction: <span style={{ color: "var(--pink)", fontWeight: "bold" }}>{state.paymentProof?.rejectionReason || "Invalid UTR / Payment receipt unclear."}</span>
                </p>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {state.resubmissionAllowed !== false
                    ? "Please check your transaction details and resubmit a clear receipt screenshot or corrected UTR number below."
                    : "Resubmission is currently disabled. Please contact your assigned SPOC for assistance."}
                </div>
                {state.resubmissionAllowed === false && (
                  <div style={{ marginTop: "1rem" }}>
                    <Link href="/spoc" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: "var(--pink)", color: "#fff", fontFamily: "var(--font-heading)", fontSize: "0.78rem", letterSpacing: "1px", textDecoration: "none" }}>
                      <Mail size={13} /> CONTACT SPOC FOR ASSISTANCE
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── PAYMENT SUBMISSION / RESUBMISSION FORM (Visible if UNPAID or REJECTED with resubmission allowed) ─── */}
        {(!isPending && !isApproved && (state.resubmissionAllowed !== false || !isRejected)) && (
          <div className="vv-card vv-corners mb-8" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
              // {isRejected ? "RESUBMIT PAYMENT PROOF" : "SUBMIT REGISTRATION FEE PROOF"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN: UPI DETAILS & QR */}
              <div style={{ padding: "1.25rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--primary)", marginBottom: "0.75rem" }}>
                    STEP 1: SCAN & PAY VIA UPI
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>FEE AMOUNT:</span>
                    <span style={{ color: "#00ff88", fontWeight: 700 }}>₹ 500 INR</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>OFFICIAL UPI ID:</span>
                    <span style={{ color: "var(--cyan)", fontWeight: 700 }}>vvce.ivcclub@upi</span>
                  </div>

                  {/* QR Graphic Box */}
                  <div style={{ background: "#000", border: "1px dashed var(--border-yellow)", padding: "1rem", textAlign: "center", marginBottom: "1rem" }}>
                    <div style={{ width: "120px", height: "120px", margin: "0 auto 0.5rem", background: "#fff", padding: "8px" }}>
                      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                        <path fill="#000" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M50,40 h20 v20 h-20 z M80,80 h20 v20 h-20 z M30,50 h10 v30 h-10 z" />
                      </svg>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Scan using PhonePe, GPay, or Paytm</div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PROOF SUBMISSION FORM */}
              <div>
                <form onSubmit={handleSubmitProof}>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-main)", letterSpacing: "1.5px", marginBottom: "0.45rem" }}>
                      TRANSACTION UTR / REF NUMBER <span style={{ color: "var(--pink)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={utrRef}
                      onChange={(e) => setUtrRef(e.target.value)}
                      placeholder="e.g. 429018491024 or UPI-9048..."
                      style={{
                        width: "100%",
                        background: "rgba(0,0,0,0.6)",
                        border: `1px solid ${error ? "var(--pink)" : "rgba(255,255,255,0.15)"}`,
                        color: "var(--text-main)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        padding: "0.75rem 0.9rem",
                        outline: "none",
                        borderRadius: "4px",
                      }}
                    />
                    {error && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", marginTop: "0.35rem" }}>⚠ {error}</div>}
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-main)", letterSpacing: "1.5px", marginBottom: "0.45rem" }}>
                      PAYMENT RECEIPT / SCREENSHOT
                    </label>
                    <div
                      style={{
                        border: "1px dashed rgba(255,255,255,0.2)",
                        background: "rgba(0,0,0,0.4)",
                        padding: "1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        position: "relative",
                        borderRadius: "4px",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          cursor: "pointer",
                          width: "100%",
                        }}
                      />
                      <Upload size={20} style={{ color: fileName ? "#00ff88" : "var(--text-muted)", margin: "0 auto 0.4rem" }} />
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.78rem", color: fileName ? "#00ff88" : "var(--text-dim)" }}>
                        {fileName ? fileName : "CHOOSE RECEIPT SCREENSHOT"}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        PNG, JPG, or PDF (Max 5MB)
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      padding: "0.85rem",
                      background: isRejected ? "var(--pink)" : "var(--primary)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#000",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.88rem",
                      letterSpacing: "2px",
                      cursor: submitting ? "wait" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="vv-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#000" }} />
                        SUBMITTING PROOF...
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
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Squad Overview & Roster Details */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--pink)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
            // SQUAD OVERVIEW
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "0.75rem" }}>
            <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0" }}>TEAM NAME</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--primary)", marginTop: "0.2rem" }}>{state.teamName}</div>
            </div>
            <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0" }}>TEAM ID</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--cyan)", marginTop: "0.2rem" }}>{state.teamId}</div>
            </div>
            <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0" }}>MEMBERS</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--text-main)", marginTop: "0.2rem" }}>{state.members.length} / 3</div>
            </div>
            <div style={{ padding: "0.85rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9AA8C0" }}>SELECTED DOMAIN</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--cyan)", marginTop: "0.2rem" }}>{state.selectedDomainName || "Cybersecurity"}</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Squad Roster + Team QR Card */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "1.5rem" }}>
          {/* Squad Roster */}
          <div className="vv-card vv-corners" style={{ padding: "1.75rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1.25rem" }}>
              // CONFIRMED ROSTER
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {state.members.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem", background: m.isLeader ? "rgba(253,191,21,0.05)" : "rgba(255,255,255,0.025)", border: `1px solid ${m.isLeader ? "rgba(253,191,21,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: "4px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `2px solid ${m.accentColor}`, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: m.accentColor, flexShrink: 0 }}>
                    {m.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>{m.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>{m.branch} · {m.role}</div>
                  </div>
                  {m.isLeader && (
                    <span style={{ padding: "0.15rem 0.45rem", background: "var(--primary)", fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#000", borderRadius: "2px" }}>LEADER</span>
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


"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  HelpCircle,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import {
  getWorkflowState,
  submitPaymentProof,
  type WorkflowState,
} from "@/lib/services/workflowService";

import { useToast } from "@/components/ui/Toast";

export default function PaymentPage() {
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
            // REGISTRATION FEE & PROOF VERIFICATION
          </div>
          <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            {isPending ? "PAYMENT VERIFICATION PENDING" : isApproved ? "PAYMENT & REGISTRATION CONFIRMED" : "MISSION FEES & VERIFICATION"}
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#9AA8C0", margin: 0 }}>
            {isPending
              ? "Your payment proof is under review by the ViceVerse organizing team."
              : isApproved
              ? "Your team registration is fully confirmed. Event access and Team QR are unlocked."
              : "Complete squad registration payment via QR code and upload proof for Admin Verification."}
          </p>
        </div>

        {/* ─── STATE 1: PENDING VERIFICATION VIEW ─── */}
        {isPending && (
          <div className="animate-slide-up">
            {/* Card 1: Professional Status Card */}
            <div
              className="vv-card vv-corners"
              style={{
                padding: "2rem",
                marginBottom: "1.75rem",
                border: "1px solid rgba(253,191,21,0.35)",
                background: "rgba(253,191,21,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(253,191,21,0.15)", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={24} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", color: "var(--primary)", letterSpacing: "1px" }}>
                    Payment Verification Pending
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--cyan)", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    ⏳ Waiting for Verification
                  </div>
                </div>
              </div>

              <div style={{ padding: "1.25rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "#C5CEDF", lineHeight: 1.7, margin: 0 }}>
                  Thank you for submitting your payment proof.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "#C5CEDF", lineHeight: 1.7, marginTop: "0.75rem", marginBottom: 0 }}>
                  Our organizing team is currently verifying your payment.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "#C5CEDF", lineHeight: 1.7, marginTop: "0.75rem", marginBottom: 0 }}>
                  Once your payment has been successfully verified, you will receive a confirmation email regarding your successful registration for ViceVerse Ideathon.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "#C5CEDF", lineHeight: 1.7, marginTop: "0.75rem", marginBottom: 0 }}>
                  Until then, your registration will remain in the verification queue.
                </p>
              </div>
            </div>

            {/* Grid Row: Card 2 (What happens next?) & Card 3 (Current Status) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 2: Information Card (2 columns wide) */}
              <div className="md:col-span-2 vv-card vv-corners" style={{ padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--cyan)", letterSpacing: "1px", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <HelpCircle size={20} style={{ color: "var(--cyan)" }} /> What happens next?
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      Payment is reviewed by the organizers.
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      Once approved, your team registration becomes active.
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      A confirmation email will be sent to your registered Team Leader email address.
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    <CheckCircle2 size={18} style={{ color: "#00ff88", flexShrink: 0, marginTop: "0.15rem" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#C5CEDF", lineHeight: 1.5 }}>
                      After approval, additional portal features (such as Team QR, Event updates, etc.) will become available.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Small Card (Current Status) */}
              <div className="vv-card vv-corners" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--primary)", letterSpacing: "1px", marginBottom: "1.25rem" }}>
                    Current Status
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ padding: "0.85rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(253,191,21,0.25)", borderRadius: "4px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", marginBottom: "0.25rem" }}>
                        Payment Status:
                      </div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--primary)", fontWeight: 700 }}>
                        Pending Verification
                      </div>
                    </div>

                    <div style={{ padding: "0.85rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(56,225,232,0.25)", borderRadius: "4px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", marginBottom: "0.25rem" }}>
                        Registration Status:
                      </div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)", fontWeight: 700 }}>
                        Awaiting Confirmation
                      </div>
                    </div>

                    <div style={{ padding: "0.85rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(233,30,140,0.25)", borderRadius: "4px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#9AA8C0", marginBottom: "0.25rem" }}>
                        Notification:
                      </div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--pink)", fontWeight: 700 }}>
                        Confirmation Email Pending
                      </div>
                    </div>
                  </div>
                </div>

                {state.paymentProof && (
                  <div style={{ marginTop: "1.25rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#9AA8C0" }}>
                    <div>UTR Ref: <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{state.paymentProof.utrRef}</span></div>
                    <div style={{ marginTop: "0.2rem" }}>Submitted: {state.paymentProof.submittedAt}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Single Primary Button */}
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.9rem 2.5rem",
                  background: "var(--primary)",
                  color: "#000",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.95rem",
                  letterSpacing: "1.5px",
                  fontWeight: 700,
                  textDecoration: "none",
                  borderRadius: "4px",
                  boxShadow: "0 0 20px rgba(253,191,21,0.25)",
                  transition: "var(--transition)",
                }}
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* ─── STATE 2: APPROVED VIEW ─── */}
        {isApproved && (
          <div className="animate-slide-up">
            <div
              className="vv-card vv-corners"
              style={{
                padding: "2rem",
                marginBottom: "2rem",
                background: "rgba(0,255,136,0.06)",
                border: "1px solid rgba(0,255,136,0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,255,136,0.15)", border: "2px solid #00ff88", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle2 size={26} style={{ color: "#00ff88" }} />
                </div>
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", color: "#00ff88", letterSpacing: "1px" }}>
                    PAYMENT VERIFIED & REGISTRATION CONFIRMED ✓
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(0,255,136,0.9)", marginTop: "0.25rem" }}>
                    Your payment proof has been verified by the Event Admin. Team registration is active!
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.85rem", marginBottom: "1.5rem" }}>
                <div style={{ padding: "0.85rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "4px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#9AA8C0" }}>Payment Status:</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#00ff88", fontWeight: 700, marginTop: "0.2rem" }}>VERIFIED & APPROVED</div>
                </div>
                <div style={{ padding: "0.85rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "4px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#9AA8C0" }}>Registration Status:</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#00ff88", fontWeight: 700, marginTop: "0.2rem" }}>REGISTRATION SUCCESSFUL ✓</div>
                </div>
                <div style={{ padding: "0.85rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "4px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#9AA8C0" }}>Notification:</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "var(--cyan)", fontWeight: 700, marginTop: "0.2rem" }}>Confirmation Email Sent</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link
                  href="/dashboard"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.85rem",
                    letterSpacing: "1.5px",
                    textDecoration: "none",
                  }}
                >
                  <LayoutDashboard size={14} /> DASHBOARD
                </Link>
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
          </div>
        )}

        {/* ─── STATE 3: UNPAID OR REJECTED (UPLOAD FORM ACTIVE IF RESUBMISSION ALLOWED) ─── */}
        {(!isPending && !isApproved) && (
          <div>
            {/* REJECTED BANNER */}
            {isRejected && (
              <div
                className="vv-card vv-corners mb-6"
                style={{
                  padding: "1.75rem",
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
                      Reason / Correction Note: <span style={{ color: "var(--pink)", fontWeight: "bold" }}>{state.paymentProof?.rejectionReason || "Invalid UTR / Payment receipt unclear."}</span>
                    </p>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      {state.resubmissionAllowed !== false
                        ? "Please check your transaction details and resubmit a clear screenshot or corrected UTR number below to return to Pending Verification."
                        : "Resubmission is currently disabled by event organizers. Please contact your assigned SPOC for assistance."}
                    </div>
                    {state.resubmissionAllowed === false && (
                      <div style={{ marginTop: "1rem" }}>
                        <Link
                          href="/spoc"
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
                          <Mail size={13} /> CONTACT SPOC FOR ASSISTANCE
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MAIN PAYMENT & PROOF CARD */}
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
                      placeholder="e.g. 429018491024 or UPI-9048..."
                      style={{
                        width: "100%",
                        background: "rgba(0,0,0,0.6)",
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
                        cursor: "pointer",
                        position: "relative",
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
                      <Upload size={24} style={{ color: fileName ? "#00ff88" : "var(--text-muted)", margin: "0 auto 0.5rem" }} />
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", color: fileName ? "#00ff88" : "var(--text-dim)" }}>
                        {fileName ? fileName : "CLICK TO CHOOSE SCREENSHOT"}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        PNG, JPG, or PDF (Max 5MB)
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
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
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
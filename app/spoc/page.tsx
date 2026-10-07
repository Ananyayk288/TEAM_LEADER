"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Mail,
  Phone,
  Building,
  Shield,
  Copy,
  Check,
  Send,
  Lock,
  MessageSquare,
  Radio,
} from "lucide-react";

export default function SpocPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [pingSent, setPingSent] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([
    "[10:14:02 UTC] SPOC Dr. Elena Rostova attached to Squad SHADOW-NINE.",
    "[10:15:30 UTC] MENTOR: Initial briefing materials uploaded to secure cache.",
    "[11:00:12 UTC] MENTOR: Available for architecture reviews between 1400-1800 hrs.",
  ]);

  const SPOC_DETAILS = {
    name: "Dr. Elena Rostova",
    designation: "Chief Technical Mentor & Systems Security Architect",
    department: "Department of Computer Science & Engineering // IVC Club",
    email: "elena.rostova@vvce.ac.in",
    phone: "+91 98765 01928",
    officeLocation: "Lab Node 04 // VVCE Campus",
    status: "ONLINE // AVAILABLE",
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SPOC_DETAILS.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(SPOC_DETAILS.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSendPing = () => {
    setPingSent(true);
    setChatLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] LEAD: Priority beacon dispatched to Dr. Elena Rostova.`,
      `[${new Date().toLocaleTimeString()}] SYSTEM: Telemetry packet acknowledged by mentor terminal.`,
    ]);
    setTimeout(() => setPingSent(false), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] LEAD: ${message.trim()}`,
    ]);
    setMessage("");
  };

  return (
    <main style={{ paddingBottom: "3rem" }}>
      {/* Title Header */}
      <div style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--pink)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
          // SECTION 07: SINGLE POINT OF CONTACT (SPOC)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h1 className="text-glow-yellow" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1, marginBottom: "0.5rem" }}>
              ASSIGNED SPOC & MENTOR DETAILS
            </h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
              Official single point of contact details assigned by Event Administration.
            </p>
          </div>

          <div style={{ padding: "0.5rem 1rem", background: "rgba(253,191,21,0.06)", border: "1px solid var(--border-yellow)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={14} style={{ color: "var(--primary)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--primary)", letterSpacing: "1px" }}>
              READ-ONLY // ASSIGNED BY ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Left Column: Read-Only SPOC Telemetry Card */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid #00ff88", background: "rgba(0,255,136,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <UserCheck size={28} style={{ color: "#00ff88" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--text-main)", letterSpacing: "1px" }}>
                  {SPOC_DETAILS.name}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#00ff88", marginTop: "0.2rem" }}>
                  {SPOC_DETAILS.designation}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Building size={12} />
                  <span>{SPOC_DETAILS.department}</span>
                </div>
              </div>
            </div>

            {/* Read-Only Details Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {/* Email Card */}
              <div style={{ padding: "1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                  1. OFFICIAL EMAIL ADDRESS
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--cyan)", wordBreak: "break-all" }}>
                  {SPOC_DETAILS.email}
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  <a
                    href={`mailto:${SPOC_DETAILS.email}`}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.75rem",
                      background: "rgba(0,212,255,0.15)",
                      border: "1px solid var(--cyan)",
                      color: "var(--cyan)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.72rem",
                      letterSpacing: "1px",
                      textDecoration: "none",
                    }}
                  >
                    <Mail size={12} /> SEND EMAIL
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    style={{
                      padding: "0.45rem 0.75rem",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "var(--text-dim)",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                    }}
                  >
                    {copiedEmail ? <Check size={12} style={{ color: "#00ff88" }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Phone Card */}
              <div style={{ padding: "1rem", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                  2. CONTACT PHONE / HELPLINE
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", color: "#00ff88", fontWeight: "bold" }}>
                  {SPOC_DETAILS.phone}
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  <a
                    href={`tel:${SPOC_DETAILS.phone}`}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.75rem",
                      background: "rgba(0,255,136,0.15)",
                      border: "1px solid #00ff88",
                      color: "#00ff88",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.72rem",
                      letterSpacing: "1px",
                      textDecoration: "none",
                    }}
                  >
                    <Phone size={12} /> CALL MENTOR
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    style={{
                      padding: "0.45rem 0.75rem",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "var(--text-dim)",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                    }}
                  >
                    {copiedPhone ? <Check size={12} style={{ color: "#00ff88" }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Ping Action */}
          <button
            onClick={handleSendPing}
            disabled={pingSent}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.8rem",
              background: pingSent ? "rgba(0,255,136,0.15)" : "rgba(253,191,21,0.15)",
              border: `1px solid ${pingSent ? "#00ff88" : "var(--primary)"}`,
              color: pingSent ? "#00ff88" : "var(--primary)",
              fontFamily: "var(--font-heading)",
              fontSize: "0.8rem",
              letterSpacing: "1.5px",
              cursor: pingSent ? "default" : "pointer",
            }}
          >
            <Radio size={14} />
            {pingSent ? "PRIORITY PING DISPATCHED ✓" : "DISPATCH TELEMETRY PING TO SPOC"}
          </button>
        </div>

        {/* Right Column: Encrypted SPOC Uploader & Telemetry Channel */}
        <div className="vv-card vv-corners" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "2px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MessageSquare size={14} /> ENCRYPTED SPOC CONSULTATION UPLINK
            </div>

            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Direct line to SPOC for technical clarifications, domain inquiries, and schedule questions.
            </p>

            {/* Chat Log Window */}
            <div style={{ height: "260px", overflowY: "auto", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {chatLog.map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.6rem 0.75rem",
                    background: log.includes("LEAD:") ? "rgba(0,212,255,0.06)" : log.includes("MENTOR:") ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${log.includes("LEAD:") ? "rgba(0,212,255,0.2)" : log.includes("MENTOR:") ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.05)"}`,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: log.includes("LEAD:") ? "var(--cyan)" : log.includes("MENTOR:") ? "#00ff88" : "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Send Input Form */}
          <form onSubmit={handleSendMessage} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type inquiry for SPOC..."
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--text-main)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                padding: "0.65rem 0.85rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.65rem 1rem",
                background: "var(--cyan)",
                border: "none",
                color: "#000",
                fontFamily: "var(--font-heading)",
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

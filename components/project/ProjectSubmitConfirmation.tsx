"use client";
import React, { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface ProjectSubmitConfirmationProps {
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  projectName: string;
  errorMessage?: string | null;
}

export default function ProjectSubmitConfirmation({
  onConfirm,
  onCancel,
  isSubmitting,
  projectName,
  errorMessage,
}: ProjectSubmitConfirmationProps) {
  // Trap focus and handle Escape key
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSubmitting, onCancel]);

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "vv-fade-in 0.2s ease both",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onCancel();
      }}
    >
      {/* Modal Card */}
      <div
        className="vv-card vv-corners"
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2rem)",
          background: "#0F0F0F",
          border: "1px solid rgba(233,30,140,0.35)",
          animation: "vv-slide-up 0.3s cubic-bezier(0.16,1,0.3,1) both",
          position: "relative",
          boxShadow: "0 25px 50px rgba(0,0,0,0.9), 0 0 30px rgba(233,30,140,0.15)",
        }}
      >
        {/* Close button */}
        {!isSubmitting && (
          <button
            onClick={onCancel}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.35rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "36px",
              minWidth: "36px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-main)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <X size={18} />
          </button>
        )}

        {/* Warning Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(233,30,140,0.08)",
            border: "1px solid rgba(233,30,140,0.25)",
            margin: "0 auto 1.25rem",
          }}
        >
          <AlertTriangle size={24} style={{ color: "var(--pink)" }} />
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--text-muted)",
            letterSpacing: "3px",
            textAlign: "center",
            marginBottom: "0.4rem",
          }}
        >
          FINAL CONFIRMATION
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.35rem",
            color: "var(--pink)",
            textAlign: "center",
            marginBottom: "1rem",
            letterSpacing: "1px",
          }}
        >
          SUBMIT PROJECT?
        </h2>

        {/* Error Banner inside modal if submission fails */}
        {errorMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(230,16,80,0.15)",
              border: "1px solid rgba(230,16,80,0.6)",
              borderRadius: "4px",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#FF4D4D", letterSpacing: "0.5px" }}>
              ⚠ {errorMessage}
            </span>
          </div>
        )}

        {/* Project Name Card */}
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(253,191,21,0.05)",
            border: "1px solid rgba(253,191,21,0.15)",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              color: "var(--text-muted)",
              letterSpacing: "1px",
              marginBottom: "0.25rem",
            }}
          >
            PROJECT TITLE
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              color: "var(--primary)",
              letterSpacing: "1px",
              wordBreak: "break-all",
            }}
          >
            {projectName || "UNNAMED PROJECT"}
          </div>
        </div>

        {/* Requirement 8: Updated warning message */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            color: "#C5CEDF",
            lineHeight: 1.6,
            textAlign: "center",
            marginBottom: "1.75rem",
          }}
        >
          Once submitted, your project will be locked. Only the Event Admin can reopen it.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
          {/* Confirm Submit Button */}
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            id="project-submit-confirm-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              width: "100%",
              minHeight: "46px",
              padding: "0.9rem",
              background: isSubmitting ? "rgba(233,30,140,0.4)" : "var(--pink)",
              color: "#fff",
              fontFamily: "var(--font-heading)",
              fontSize: "0.95rem",
              letterSpacing: "2px",
              border: "none",
              borderRadius: "4px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
              boxShadow: isSubmitting ? "none" : "0 0 16px rgba(255,15,90,0.3)",
            }}
          >
            {isSubmitting ? (
              <>
                <div className="vv-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#fff" }} />
                <span>SUBMITTING...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>CONFIRM SUBMISSION</span>
              </>
            )}
          </button>

          {/* Cancel Button */}
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isSubmitting}
            id="project-submit-cancel-btn"
            style={{
              width: "100%",
              minHeight: "42px",
              padding: "0.75rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "4px",
              color: isSubmitting ? "rgba(255,255,255,0.2)" : "var(--text-dim)",
              fontFamily: "var(--font-heading)",
              fontSize: "0.8rem",
              letterSpacing: "1px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.color = "var(--text-main)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                e.currentTarget.style.color = "var(--text-dim)";
              }
            }}
          >
            CANCEL — GO BACK
          </button>
        </div>
      </div>
    </div>
  );
}
